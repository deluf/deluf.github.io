---
title: Collaborative text editor 
date: "2026-04-24T00:00:00+01:00"
draft: false
description: "**Distributed system** written in **Erlang** that allows users to concurrently edit an ascii-only shared document in **real time**"

cover:
  alt: Preview of collaborative text editor 
  image: /2026/collaborative-text-editor/preview.png

tags:
- Erlang
- Javascript

weight: 2
---

---

> **Resources**

- [Code](https://github.com/deluf/collaborative-text-editor)
- [Documentation](/2026/collaborative-text-editor/documentation.pdf)

---

## Highlights

> **Summary**

{{< space 20 >}}

This project implements a distributed, collaborative text editor (similar to a simplified Google Docs or Overleaf) that allows multiple users to concurrently view, edit, and share plain acii-only text documents in real-time.

---

> **Technical implementation**

{{< space 20 >}}

To address the core challenge of real-time collaborative editing without locking the document, we utilized a **Conflict-free Replicated Data Type (CRDT)** model based on fractional indexing: rather than using string indices (e.g., to delete the second character of the document a user issues the `{ "action": "DELETE", "index": 1 }` command), which easily cause merge conflicts - the final state of the document depends on the order of arrival of the requests; every character is assigned a **unique, globally ordered identifier**. This guarantees the eventual consistency of the operations!

The front-end resolves index collision risks using the [jittered fractional indexing library](https://github.com/nathanhleung/jittered-fractional-indexing), achieving a collision rate of less than `0.0005%` even under concurrent inputs by 100 users.

---

> **Distributed architecture**

{{< space 20 >}}

{{< figure src="/2026/collaborative-text-editor/distributed-setup.png" caption="Schema of the software architecture and multi-node cluster configuration" >}}

{{< space 30 >}}

The backend is built as a distributed, fault-tolerant cluster of **Erlang** nodes running behind an Nginx load balancer.

To persist data, the application embeds the **Mnesia** database configured with `disc_copies` to survive reboots. Because writing every single keystroke to disk would cause severe I/O bottlenecks, `doc_server` acts as an **intelligent write-back cache**, flushing the in-memory CRDT state to Mnesia only when:
1. **Operation volume threshold:** 50 distinct operations (`save_every = 50`) are accumulated.
2. **Temporal interval:** A repeating timer fires, checking if unsaved edits exist.
3. **Session termination:** The last active user disconnects, triggering a final `dirty_write` before the server process exits.

---

> **Performance benchmarks**

{{< space 20 >}}

#### Concurrency limits
{{< figure src="/2026/collaborative-text-editor/concurrent_users.png" caption="SYNCREQ response times as the document size and number of concurrent users increase" >}}

{{< space 30 >}}

To find the optimal active user limit, we simulated clients typing continuously at `600 edits per minute` (roughly 100 WPM):
* With **5** and **10** concurrent users, response times grow slowly and linearly, remaining well within real-time bounds
* With **15** concurrent users, performance degrades non-linearly because the broadcast of every keystroke to all clients rapidly fills the Erlang processes' mailboxes
* Consequently, we established a limit of **10 active concurrent editors**, putting subsequent users into a FIFO waiting queue

#### Write-back cache tuning
{{< figure src="/2026/collaborative-text-editor/10k_inserts.png" caption="Processing time for 10,000 sequential inserts under different Mnesia write-back frequencies" >}}

{{< space 30 >}}

We measured the processing time of `10,000` sequential keystrokes under various flush thresholds:
* Writing to Mnesia on every single keystroke (`save_every = 1`) takes **24.408 seconds** due to severe disk I/O saturation
* Batching edits drastically improves response times: `save_every = 10` drops processing time by over 90% to **2.046 seconds**
* Setting `save_every = 50` reduces processing time to **0.744 seconds**
* While larger thresholds (e.g., 100 or 200) offer minor speedups, they dangerously expand the volatility window. Thus, we selected `save_every = 50` as the optimal architectural tradeoff

---

> **See it in action**

{{< video "/2026/collaborative-text-editor/action.mp4" >}}
