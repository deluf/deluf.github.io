---
title: Remote car
date: "2025-08-14T00:00:00+01:00"
draft: false

description: "An **RC car controlled over the internet** (from anywhere in the world) with an arduino, an android phone, and a PS4 controller"

cover:
  alt: Preview of Remote car
  image: 2025/remote-car/after-external.jpeg

tags:
- Embedded
- Android
- Python

weight: 1
---

---
> **Resources**
- [Code](https://gitfront.io/r/deluf/kN8UY6dusMww/remote-car/)
---

## Highlights

> **Introduction**

{{< space 20 >}}

Old android phones are surprisingly capable: sensors, camera, mobile networking, and decent processing power; they are basically Raspberry PIs on steroids with the only downside of having to build a Java/Kotlin android app to program them. When i found out that you can even use them to send serial-over-USB messages to microcontrollers, i immediately got the idea of using one to control a RC car.

---

> **Networking**

{{< figure src="/2025/remote-car/network-diagram.png" caption="Network diagram" >}}

Knowing that:
1. With my computer i can read inputs from any video-game controller
2. Android phones can talk with microcontrollers
Then, if i find a way to make the phone and the computer communicate, i can control anything wired to the microcontroller from everywhere in the world, using a simple video-game controller.

To achieve that, i considered a few options:
- Can't host anything on the phone - With 4G/5G you are behind CGNAT
- Can't host anything on the computer - What if the computer is connected to a 4G/5G hotspot or to a network i cannot control?
- Using a third party relay server is out of the question since it only adds more latency
- **Tailscale** (or similar, e.g., NordVPN Meshnet) is a perfect solution since it creates a VPN between the phone and the computer - Direct communication, no added latency

---

> **Circuit**

The main board is an `Arduino Uno R3`, which i wired to:
- A `L298N` motor driver (old design, if buying new go for MOSFET-based drivers which have lower voltage drop)
- A horn (active buzzer)
- Blue underglow leds (resembling neons)
- Voltage dividers to monitor the voltage of the batteries (arduino's analog pins only support up to 5 volts)

{{< figure src="/2025/remote-car/breadboard.svg" caption="Circuit diagram" >}}

> Why are there two batteries, one for the electronics and one for the motors? Because: 
> - I had two
> - If i don't power the electronics with one of the two batteries then they take the power from the phone's battery (which is already not impressive) via the USB cable used for data transfer
> - I don't think it's good practice to power the electronics with the same battery used by "heavy" components such as DC motors (the electronics require stable voltage and low current, the motors instead can create large instantaneous current draws, potentially creating voltage drops on the supply rail)

{{< space 50 >}}

{{< twocolumns 40 >}}
	{{< figure src="/2025/remote-car/before.jpeg" caption="Original car" >}}
	{{< figure src="/2025/remote-car/after-external.jpeg" caption="Modified car (external view)" >}}
{{< /twocolumns >}}

{{< figure src="/2025/remote-car/after-internal.jpeg" caption="Modified car (internal view)" >}}

{{< space 50 >}}

---

> **Android app**

{{< twocolumns 20 mobile >}}
	{{< column >}}
		The phone is an Alcatel 3 (2019), a low-end device, but good enough.
		<br><br>
		It measures:
		<ul>
			<li> Location (GPS coordinates)
			<li> Heading (degrees)
			<li> Temperature of CPU, GPU, modem and camera
			<li> Battery percentage
			<li> Signal strength
		</ul>
		Each time one of the metrics changes it is sent to the computer via a TCP socket.
		<br>
	{{< /column >}}
	<img src="/2025/remote-car/android-app.jpeg" alt="Android APP" height=400 style="margin-top: 0; border: 1px solid black">

{{< /twocolumns >}}

For the video feed, the phone records a `320x240 @ 30fps` stream and compresses it on-device using hardware H264 encoding. H264 NAL units are sent to the computer via a UDP socket. Resolution can be much higher depending on the network bandwidth and hardware capabilities. You can switch from front to back camera and vice-versa in real time (<i>note: see the limitations section below</i>).

---

> **Controller GUI**

The computer runs a multi-process python back-end. The GUI is organized in tiles, each one rendered by a different process implementing a specific feature:
- The main process reads the controller inputs using `PyGame`, renders the temperature readings an orchestrates all the other processes
- A process implements the TCP socket for receiving the metrics
- An `electron` app executing https://gamepad.e7d.io/ is used to display the controller in a borderless window
- Another `electron` app renders the received locations on a map. The map is implemented as an HTML file which is built (and updated) using `folium` and `OpenStreetMap`
- Another process renders the bandwith chart using `matplotlib` for the graphics and `psutil` for the network counters
- Finally, a process renders the stream using `ffmpeg` and `PyAV` to receive and decode H264 NALs, and `QT5` for displaying the frames with along with the metrics overlay

<img src="/2025/remote-car/controller-gui.jpeg" alt="Controller GUI" style="margin-top: 0; border: 1px solid black">


{{< space 50 >}}

---

> **See it in action**

{{< video "/2025/remote-car/action.mp4" >}}

---

> **Limitations**

- **Latency** is the main limitation of this architecture. You pay the price of being able to control the car from anywhere in the world with a higher latency (50~100 ms) compared to radio control. The main contributor to latency is network latency between the phone and the controller: even with a 5G-capable phone and a controller geographically close to the phone, this kind of latency will never get lower than a few tens of milliseconds, which is enough to comfortably control the car in most situations but not enough for extremely low latency applications such as high speed FPV control

- **Video stabilization** is another limitation of the current architecture. This issue can either be solved in software (requires a buffer of at least a few frames, i.e., more latency) or in hardware (outside the scope of this project). Overall it's not that big of a deal imo

- **Software** i aint no android dev - you can switch cameras but only twice, then it stops working. There probably are other bugs there (and also in the python code, which is not great by any means). Anyway, for a prototype it's more than enough
