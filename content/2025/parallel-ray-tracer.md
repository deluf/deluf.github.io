---
title: Parallel ray tracer
date: "2025-05-21T00:00:00+01:00"
draft: false

description: "Multi-threaded ray tracer implemented from scratch in C and then accelerated using CUDA"

cover:
  alt: Preview of Parallel ray tracer
  image: 2025/parallel-ray-tracer/preview.png

tags:
- C
- CUDA
- Linux
---

---

> **Resources**

- [Code](https://github.com/deluf/parallel-ray-tracer)
- [Presentation](/2025/parallel-ray-tracer/presentation.pdf)

---

## Highlights

> **Summary**

{{< space 20 >}}

In this group project, we studied the performance of a parallel ray tracing application, from CPU-based implementations to CUDA-accelerated ones. 

Starting with a naïve CPU renderer, we progressively optimized the application using the right compiler flags, bounding volume hierarchies (BVH) and smarter thread scheduling strategies.

Then, we ported the C code to CUDA, a task that required the conversion of recursive functions and a completely different thread organization. 

Finally, we optimized the CUDA code by introducing a tile-based thread scheduling algorithm and a better data alignment strategy, culminating in a renderer capable of achieving `65 FPS @ 1080p` on a (simple) test scene, roughly 28 times faster than the best CPU implementation.

{{< space 40 >}}

> **Pictures**

{{< figure src="/2025/parallel-ray-tracer/preview.png" caption="An example of rendered scene" >}}

{{< space 50 >}}

{{< figure src="/2025/parallel-ray-tracer/ray-intersection.png" caption="A visualization of the ray-triangle intersection process" >}}

{{< space 50 >}}

{{< figure src="/2025/parallel-ray-tracer/compiler-flags-speedup.png" caption="Speedup of different compiler flags with respect to GCC's default (CPU's naïve version)" >}}

{{< space 50 >}}

{{< figure src="/2025/parallel-ray-tracer/final-recap-speedup.png" caption="Speedup of every improved version we developed with respect to the first one" >}}

{{< space 50 >}}
