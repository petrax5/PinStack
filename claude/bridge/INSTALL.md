# Bridge install (Jesus's Mac)

One-time setup, about 10 minutes. After this, tasks flow Milo -> Claude -> Milo
with no copy-paste.

## 1. Install Claude Code

Open Terminal and run:

```
npm install -g @anthropic-ai/claude-code
```

(No Node? Install it first from nodejs.org, then re-run the line above.)

Then log in with your Pro account:

```
claude login
```

Follow the browser login it opens.

## 2. Clone the repo

```
git clone https://github.com/petrax5/PinStack.git ~/Documents/PinStack
```

If git asks for credentials, run `gh auth login` first (or use your usual method).

Make the watcher executable:

```
chmod +x ~/Documents/PinStack/claude/bridge/mac-watcher.sh
```

## 3. Install the watcher

Copy the plist into LaunchAgents, fixing the username path first:

```
sed 's/REPLACE_ME/YOUR_MAC_USERNAME/' ~/Documents/PinStack/claude/bridge/com.muse.claude-bridge.plist > ~/Library/LaunchAgents/com.muse.claude-bridge.plist
launchctl load ~/Library/LaunchAgents/com.muse.claude-bridge.plist
```

(Find your username in Terminal with `whoami`.)

## 4. Test it

Tell Milo: "send Claude a test task." Within about 5 minutes a reply should appear
at `claude/outbox/` in the repo.

## Notes

- The watcher runs every 5 minutes while you're logged in. Your Mac needs to be
  awake and online; a sleeping Mac just processes the backlog when it wakes.
- Logs live at `/tmp/claude-bridge.log` if something looks stuck.
- To pause the bridge: `launchctl unload ~/Library/LaunchAgents/com.muse.claude-bridge.plist`.
- To remove it entirely: unload, then delete the plist file.
