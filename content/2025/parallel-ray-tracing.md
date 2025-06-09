---
title: Parallel ray tracing
date: "2025-05-21T00:00:00+01:00"
draft: false

description: "**Fine tuning** and **profiling** of a **parallel ray tracing application** on both **CPU** and **GPU** hardware"

cover:
  alt: Preview of Parallel ray tracing
  image: 2025/parallel-ray-tracing/preview.png

tags:
- C
- CUDA
- Linux
---

---

> **Resources**

- [Presentation](/2025/parallel-ray-tracing/presentation.pdf)

---

## About

> **Summary**

{{< space 20 >}}

In this group project, we studied the performance of a parallel ray tracing application, from CPU-based implementations to CUDA-accelerated ones. 

Starting with a naïve CPU renderer, we progressively optimized the application using the right compiler flags, bounding volume hierarchies (BVH) and smarter thread scheduling strategies.

Then, we ported the C code to CUDA, a task that required the conversion of recursive functions and a completely different thread organization. 

Finally, we optimized the CUDA code by introducing a tile-based thread scheduling and better data alignment, culminating in a renderer capable of achieving 65 FPS at 1080p, roughly 28 times faster than the best CPU implementation.

{{< space 40 >}}

> **A few charts picked from the documentation**

{{< figure src="/2025/parallel-ray-tracing/preview.png" caption="An example of rendered scene" >}}

{{< space 50 >}}

{{< figure src="/2025/parallel-ray-tracing/ray-intersection.png" caption="A visualization of the ray-triangle intersection process" >}}

{{< space 50 >}}

{{< figure src="/2025/parallel-ray-tracing/compiler-flags-speedup.png" caption="Speedup of different compiler flags with respect to GCC's default (CPU's naïve version)" >}}

{{< space 50 >}}

{{< figure src="/2025/parallel-ray-tracing/final-recap-speedup.png" caption="Speedup of every improved version we developed with respect to the first one" >}}

{{< space 50 >}}
