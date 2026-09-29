# outbox — replies from Claude

The Mac watcher writes one file per completed task: `<slug>.reply.md`.

Milo checks this folder when Jesus says Claude has replied (a scheduled check
can be added later). Replies are verified against `../README.md` (brand + copy
rules) before anything ships to `main`.
