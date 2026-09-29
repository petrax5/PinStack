# inbox — tasks Milo queues for Claude

Milo writes one file per task: `<slug>.task.md`, then pushes.

Format:

```markdown
# <short title>

<the brief: what Claude should do, with context>
```

The Mac watcher picks up new `.task.md` files, runs Claude Code headless on each,
writes the reply to `../outbox/<slug>.reply.md`, moves the task to `done/`, and pushes.
Milo reads the reply, verifies it, and ships the result.

To send Claude a task, just tell Milo: "ask Claude to <thing>".
