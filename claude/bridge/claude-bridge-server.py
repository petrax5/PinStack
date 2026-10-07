#!/usr/bin/env python3
"""Claude bridge live server — runs on Jesus's Mac.

Exposes his Claude Code (Pro login) over HTTP so Milo can call it on demand,
no 5-minute polling, no git round-trip. Stdlib only, zero dependencies.

Setup (on the Mac):
  cd ~/Documents/PinStack && git pull
  TOKEN=$(python3 -c "import secrets;print(secrets.token_hex(32))"); echo "TOKEN: $TOKEN"
  CLAUDE_BRIDGE_TOKEN=$TOKEN python3 claude/bridge/claude-bridge-server.py --port 8787

Then in another terminal (same move as the BloxBot bridge):
  cloudflared tunnel --url http://127.0.0.1:8787

Paste the tunnel URL + token to Milo in chat (never stored anywhere).
Kill cloudflared any time to cut access instantly.

Every exchange is saved as a transcript on the Mac at
~/.claude-bridge/transcripts/<timestamp>-<repo>-<hash>.md — the brief Milo
sent, the full prompt Claude saw (brief + project context), and Claude's
reply. Local only, never pushed anywhere.

Protocol:
  GET  /health          -> {"ok": true}
  POST /run             -> {"prompt": "...", "repo": "~/Documents/PinStack"}
                          <- {"ok": true, "reply": "..."} or {"ok": false, "error": "..."}
  Header: Authorization: Bearer <token>
"""
from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

DOCUMENTS = Path.home() / "Documents"
TRANSCRIPT_DIR = Path.home() / ".claude-bridge" / "transcripts"
MAX_PROMPT_CHARS = 200_000
CLAUDE_TIMEOUT_S = 600


def fail(handler: BaseHTTPRequestHandler, code: int, msg: str) -> None:
    body = json.dumps({"ok": False, "error": msg}).encode()
    handler.send_response(code)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def ok(handler: BaseHTTPRequestHandler, payload: dict) -> None:
    body = json.dumps(payload).encode()
    handler.send_response(200)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def resolve_repo(repo: str) -> Path:
    """Resolve the repo path and confine it to ~/Documents (no traversal)."""
    p = Path(os.path.expanduser(repo)).resolve()
    docs = DOCUMENTS.resolve()
    if p != docs and docs not in p.parents:
        raise ValueError("repo must be inside ~/Documents")
    if not p.is_dir():
        raise ValueError(f"repo not found: {p}")
    return p


def save_transcript(repo_name: str, brief: str, full_prompt: str, reply: str) -> Path:
    """Save the full exchange locally so Jesus can read what was asked/answered."""
    TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    digest = hashlib.sha256(brief.encode()).hexdigest()[:8]
    path = TRANSCRIPT_DIR / f"{ts}-{repo_name}-{digest}.md"
    path.write_text(
        f"# Claude bridge transcript — {ts} UTC\n\n"
        f"## Brief (what Milo sent)\n\n{brief}\n\n"
        f"## Full prompt (brief + project context, exactly what Claude saw)\n\n"
        f"{full_prompt}\n\n"
        f"## Reply (what Claude returned)\n\n{reply}\n"
    )
    return path


class Handler(BaseHTTPRequestHandler):
    token: str = ""

    def log_message(self, fmt: str, *args) -> None:  # keep the terminal quiet
        sys.stderr.write("bridge: " + fmt % args + "\n")

    def _authed(self) -> bool:
        auth = self.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return False
        return hmac.compare_digest(auth[7:], self.token)

    def do_GET(self) -> None:
        if self.path == "/health":
            ok(self, {"ok": True})
        else:
            fail(self, 404, "unknown path")

    def do_POST(self) -> None:
        if self.path != "/run":
            fail(self, 404, "unknown path")
            return
        if not self._authed():
            fail(self, 401, "bad or missing token")
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
        except ValueError:
            fail(self, 400, "bad Content-Length")
            return
        if length > MAX_PROMPT_CHARS + 4096:
            fail(self, 413, "body too large")
            return
        try:
            data = json.loads(self.rfile.read(length) or b"{}")
        except (json.JSONDecodeError, ValueError):
            fail(self, 400, "body must be JSON")
            return

        prompt = str(data.get("prompt", ""))[:MAX_PROMPT_CHARS]
        if not prompt.strip():
            fail(self, 400, "prompt is required")
        try:
            repo = resolve_repo(str(data.get("repo", "~/Documents/PinStack")))
        except ValueError as e:
            fail(self, 400, str(e))
            return

        readme = repo / "claude" / "README.md"
        context = readme.read_text() if readme.is_file() else "(no claude/README.md in this repo)"
        full_prompt = (
            f"You are collaborating in the {repo.name} repo at {repo}. "
            f"First read this project context and follow it:\n\n{context}\n\n"
            f"Then do the task below. Output your full result (file contents, not diffs). "
            f"Task: {prompt}"
        )
        self.log_message("run: repo=%s prompt_chars=%d", repo.name, len(prompt))
        try:
            proc = subprocess.run(
                ["claude", "-p", full_prompt],
                capture_output=True, text=True, timeout=CLAUDE_TIMEOUT_S,
            )
        except FileNotFoundError:
            fail(self, 500, "claude CLI not found on PATH")
            return
        except subprocess.TimeoutExpired:
            fail(self, 504, f"claude timed out after {CLAUDE_TIMEOUT_S}s")
            return
        if proc.returncode != 0:
            fail(self, 500, f"claude exited {proc.returncode}: {proc.stderr[:500]}")
            return
        tpath = save_transcript(repo.name, prompt, full_prompt, proc.stdout)
        self.log_message("transcript: %s", tpath)
        ok(self, {"ok": True, "reply": proc.stdout})

    @staticmethod
    def token_fingerprint(token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()[:12]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8787)
    args = ap.parse_args()
    token = os.environ.get("CLAUDE_BRIDGE_TOKEN", "")
    if not token:
        print("error: set CLAUDE_BRIDGE_TOKEN env var", file=sys.stderr)
        sys.exit(1)
    Handler.token = token
    srv = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"claude bridge live on 127.0.0.1:{args.port} "
          f"(token sha256:{Handler.token_fingerprint(token)})", flush=True)
    print("expose with: cloudflared tunnel --url http://127.0.0.1:"
          f"{args.port}", flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
