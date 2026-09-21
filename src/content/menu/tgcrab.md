---
title: tgcrab
tagline: Crawl rooms, aggregate buys. A resumable Telegram archiver that keeps only what matches your rules.
order: 2
status: fresh
bakers: both
ingredients:
  - Go, as a single static binary
  - gotd/td, a pure Go MTProto client, so no TDLib build
  - A YAML file of groups, topics, and rules
  - JSONL and image files on disk, staged for another process
  - Docker, for the loop-forever mode
---

## Method

The name stands for Cursor-Resumable Archiver of Buys. It signs in as a Telegram user account, syncs
the groups and forum topics you choose, keeps only the messages that match your rules, downloads
their images, and writes everything out as append-only JSONL plus files for another process to consume.

Log in once. List your groups and topics to get their ids. Write rules. Then sync. Every stream keeps
its own cursor, so you can run it again at any time and it picks up where it stopped. Run it once and
exit, or give it an interval and let it loop inside a container.

A dry run prints what it would keep and writes nothing. A keep-all mode saves everything and still
marks which rules matched, which is how you tune the rules.

## Baker's notes

Exit codes mean something: zero is fine, one means a stream failed, two means the session is no
longer valid and you need to log in again, three means the config is wrong. That makes it easy for
the next process in line to know what happened.

Records carry a schema version from day one. Future Us will be grateful.
