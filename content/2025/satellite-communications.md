---
title: Satellite communications
date: "2025-01-20T00:00:00+01:00"
draft: false

description: "**Simulation** of a satellite-based communication system using the **OMNeT++ framework** and **statistical analysis** of the obtained results"

cover:
  alt: Preview of Satellite communications
  image: 2025/satellite-communications/preview.gif

tags:
- Cpp
- OMNeTpp
---

---

> **Resources**

- [Code](https://github.com/deluf/satellite-communications)
- [Documentation](/2025/satellite-communications/documentation.pdf)

---

## Highlights

> **Summary**

{{< space 20 >}}

![OMNeTT++ animation of the system](/2025/satellite-communications/preview.gif)

{{< space 20 >}}

In this group project, we studied the effectiveness of a maximum-coding-rate scheduling algorithm for a satellite-based communication system, by means of the throughput, the mean packet delay, and the mean frame utilization.

The simulator was developed with the `OMNeT++` framework, and was thoughtfully validated using: detailed debugging statements, runtime error handling, memory leak analysis, code profiling, and both intuitive and mathematical proofs for a wide range of behavioral tests.

Finally, using the simulator we just built, we tested the system under light, normal, and heavy working conditions. The obtained results were thoroughly analyzed using statistically sound methods, leading to well-founded conclusions about the system.

{{< space 40 >}}

> **Pictures**

{{< figure src="/2025/satellite-communications/calibration.png" caption="Calibration of the warmup period of the system under normal operating conditions" >}}

{{< space 50 >}}

{{< figure src="/2025/satellite-communications/throughput.png" caption="Throughput of the system as the number of terminals, the number of blocks per frame (M, expressed as a percentage of the number of terminals), and the distribution of the coding rates vary" >}}

{{< space 50 >}}

{{< figure src="/2025/satellite-communications/ecdf-delays.png" caption="Empirical CDF of the mean delays experienced by the terminals when the coding rates are binomially distributed, with a qualitative threshold of `250 ms` as a reference point" >}}

{{< space 50 >}}
