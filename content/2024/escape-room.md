---
title: Escape room
date: "2024-09-10T00:00:00+01:00"
draft: false

description: "**Plain C89** client-server escape-room-inspired **CLI game**"

cover:
  alt: Preview of Escape room
  image: 2024/escape-room/preview.png

tags:
- C
- Linux
---

---

> **Resources**

- [Code](https://github.com/deluf/escape-room) (:it:)
- [Documentation](/2024/escape-room/documentation.pdf) (:it:)

---

## Highlights

> **Communication protocol**

The communication between the client and the server operates at the lowest level: plain sockets. This required me to design a custom communication protocol from scratch

Let’s say the client wants to send the command `USE cavo router`, **the message is divided into two segments, sent sequentially**:
1. The first segment contains the **size** of the second segment. It is always encoded as a **2-byte big-endian integer**
2. The second segment contains the actual message:  
   - The **first byte** represents an **action**, in this case `USE`, which is translated to `8`
   - From the **second byte onward**, the **parameters** are listed, separated by tildes `~`, with the final parameter ending in a null character `\0`

For example, the command above would be translated as `8cavo~router\0`

Let's check that using **wireshark**:

- The first TCP segment tells us that the expected length of the next segment is `13`:
![First segment](/2024/escape-room/segment1.png)
- In the second TCP segment, the message is encoded in the expected way:
![Second segment](/2024/escape-room/segment2.png)
![Data relative to the second segment](/2024/escape-room/data2.png)

{{< space 25 >}}

A question may come naturally: why do i need to split a message and its size?

It is a very common newbie error to assume that every write() or send() on a TCP socket on the sending side will be matched by a read() or recv() from a TCP socket on the receiving side. This is not true. The sender might write() 200 bytes, and the first read() or recv() will return the first 50 bytes, only, and the next call returns the remaining 150 bytes. *(Source : [this](https://stackoverflow.com/questions/77208393/how-can-i-get-the-exact-size-of-incoming-packet-for-a-tcp-server-in-c) stackoweflow answer)*

Therefore, you can either:
1. Send messages of fixed size, so that the receiver knows exatcly how many bytes to wait for
2. First send the size, then send the message 

{{< space 50 >}}

## See it in action

{{< video "/2024/escape-room/action.mp4" >}}