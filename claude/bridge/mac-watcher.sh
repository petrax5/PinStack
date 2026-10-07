#!/bin/bash
# Muse<->Claude bridge: Mac-side watcher.
# Each run: pull the repo, feed new claude/inbox/*.task.md files to Claude Code
# (headless print mode), write replies to claude/outbox/, push.
# Intended to run every 5 minutes via the launchd plist next to this script.
set -u

REPO_DIR="${CLAUDE_BRIDGE_REPO:-$HOME/Documents/PinStack}"
INBOX="$REPO_DIR/claude/inbox"
OUTBOX="$REPO_DIR/claude/outbox"
DONE="$INBOX/done"

mkdir -p "$OUTBOX" "$DONE"
cd "$REPO_DIR" || exit 1

# Quiet pull; skip the run if the network is down.
git pull --rebase --quiet origin main 2>/dev/null || exit 0

shopt -s nullglob
for task in "$INBOX"/*.task.md; do
  slug="$(basename "$task" .task.md)"
  # Already answered (or being answered): skip.
  [ -f "$OUTBOX/$slug.reply.md" ] && continue
  # Claim it so a concurrent run doesn't double-process.
  mv "$task" "$DONE/$slug.task.md" 2>/dev/null || continue

  project_name="$(basename "$REPO_DIR")"
  prompt="You are collaborating in the $project_name repo at $REPO_DIR. First read claude/README.md for the protocol, project context, and any hard rules, and follow them. Then do the task below. Output your full result (file contents, not diffs). Task:"
  reply="$(claude -p "$prompt $(cat "$DONE/$slug.task.md")" 2>/dev/null)"
  if [ -n "$reply" ]; then
    printf '%s\n' "$reply" > "$OUTBOX/$slug.reply.md"
    git add -A
    git commit -qm "Claude bridge reply: $slug" && git push -q origin main
  else
    # Claude failed: put the task back for the next run.
    mv "$DONE/$slug.task.md" "$task"
  fi
done
