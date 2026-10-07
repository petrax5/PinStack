# Adding a project to the Claude bridge

The watcher isn't PinStack-specific. It works on whichever repo `CLAUDE_BRIDGE_REPO`
points at (default: `~/Documents/PinStack`).

## What each project needs

1. A repo containing a `claude/README.md` — the protocol and project context Claude
   reads before every task (repo map, brand tokens, hard rules). Copy the PinStack
   one as a template and rewrite the project-specific sections.
2. That's it for the repo itself — the watcher creates `claude/inbox/`,
   `claude/outbox/`, and `claude/inbox/done/` on its first run.

## Add a watcher for the project

Copy the launchd plist with a new label and point it at the project repo:

```bash
cp ~/Library/LaunchAgents/com.muse.claude-bridge.plist \
   ~/Library/LaunchAgents/com.muse.claude-bridge.oasis.plist
```

Edit the copy: change the `Label` to `com.muse.claude-bridge.oasis` and add an
`EnvironmentVariables` section so the watcher targets the new repo:

```xml
<key>EnvironmentVariables</key>
<dict>
  <key>CLAUDE_BRIDGE_REPO</key>
  <string>/Users/jesusmanuel/Documents/ThatProject</string>
</dict>
```

`ProgramArguments` keeps pointing at the one `mac-watcher.sh` — the script
`cd`s into `CLAUDE_BRIDGE_REPO` and pulls/pushes there, so a single script
serves every project. Then:

```bash
launchctl load ~/Library/LaunchAgents/com.muse.claude-bridge.oasis.plist
```

Each project's watcher runs every 5 minutes and claims its own tasks, so nothing
double-processes. To pause one project: `launchctl unload` its plist.
