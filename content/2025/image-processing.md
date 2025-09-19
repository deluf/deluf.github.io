---
title: Image processing
date: "2025-02-05T00:00:00+01:00"
draft: false

description: "**VHDL digital circuit** implementing an image processing algorithm on the **FPGA** module of a Zynq-7000 development board"

cover:
  alt: Preview of Image processing
  image: 2025/image-processing/preview.png

tags:
- VHDL
- Modelsim
- Vivado
- Python

weight: 3
---

---

> **Resources**

- [Code](https://github.com/deluf/image-processing)
- [Documentation](/2025/image-processing/documentation.pdf)

---

## Highlights

> **Introduction**

In this project, I implemented a digital circuit capable of performing a common image-processing task: **combining adjacent pixels with different weights**.

{{< space 40 >}}

> **Implementation**

The work began with an exploration of potential applications and architectural options for the circuit. Then, the circuit was designed and implemented using **VHDL**, employing a bottom-up approach, i.e., creating basic building blocks (e.g., flip-flops, adders, counters, ...) and progressively integrating them to construct a more complex circuit.

{{< figure src="/2025/image-processing/circuit-block-diagram.png" caption="Block diagram of the implemented circuit" >}}

{{< space 40 >}}

> **Verification**

Once the design was completed, the circuit was validated through the **analysis of the simulated waveforms** of every component (done using `ModelSim-Intel© FPGAs Standard Edition 2020.1`).

{{< figure src="/2025/image-processing/verification-main-circuit.png" caption="Waveform of the input and output ports of the circuit using a simple 2x3 test ROM" >}}

{{< space 40 >}}

Moreover, the circuit was tested using real images. This was achieved by:
1. Converting the selected image into a VHDL ROM
2. Simulating the circuit
3. Exporting the waveform of the output port
4. Parsing the pixels and constructing the output image

{{< twocolumns 20 >}}

	{{< figure src="/2025/image-processing/input-332.png" caption="Input image (`3-3-2` bitmap)" >}}

	{{< figure src="/2025/image-processing/output-332.png" caption="Output image (`3-3-2` bitmap, `α = 0.500`)" >}}

	{{< figure src="/2025/image-processing/input-grayscale.png" caption="Input image (grayscale)" >}}

	{{< figure src="/2025/image-processing/output-grayscale.png" caption="Output image (grayscale, `α = 0.500`)" >}}

{{< /twocolumns >}}

{{< space 40 >}}

> **Synthesis**

Finally, the circuit was synthesized using `Vivado 2024.1`, and its **timing**, **power consumption**, and **resource utilization** statistics were analyzed, also considering slightly different variations of the circuit’s parameters (e.g., ROM size, precision of `α`, number of bits per pixel, ...).

{{< figure src="/2025/image-processing/timings.png" caption="Timings" >}}

{{< figure src="/2025/image-processing/power.png" caption="Power consumption" >}}

{{< figure src="/2025/image-processing/utilization.png" caption="Resource utilization" >}}
