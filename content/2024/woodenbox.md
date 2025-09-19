---
title: Woodenbox
date: "2024-03-06T00:00:00+01:00"
draft: false

description: "**Home server** running Proxmox VE on an **old laptop** moved inside of a custom wooden case. The server is booted up remotely by **telegram bot** hosted on an **ESP32** and is accessed via a **WireGuard VPN**"

cover:
  alt: Preview of Woodenbox
  image: 2024/woodenbox/preview.jpeg

tags:
- Embedded
- Linux
- Cpp
- Python

weight: 1
---

---

> **Resources**

- [ESP32's code](/code/esp32-telegram-bot/) (C++)
- [Server's code](/code/woodenbox-flask-api/) (Python)

---

## Highlights

> **Hardware & software configuration**

The old laptop rocks an `AMD A8 6410 @2.0GHz` CPU with `8GB DDR3` RAM and a `512GB SATAIII` SSD. Software side, it runs **Proxmox Virtual Environment**, a hosted hypervisor on which i configured two separate containers: one for a **samba share** (of the entire disk) and one for a wireguard **VPN** (PiVPN).

> **Network configuration**

The laptop is suspended most of the time, and only gets turned on when i want to use it. To accomplish this, an always-on ESP32 microcontroller in the same local networks hosts a telegram bot and is instructed to send a WakeOnLan packet to the laptop if it receives the message `/boot`.

The ESP32 also handles more complex commands that directly interact with the server, such as starting a proxmox container or vm `/start container-id` or putting the server back to a suspended state `/suspend`. To accomplish this, commands of such type are forwarded from the ESP32 to the server through a flask API (the ESP32 basically acts as a trusted relay node).

{{< figure src="/2024/woodenbox/network-diagram.png" >}}

{{< space 50 >}}

{{< twocolumns 40 >}}

  {{< figure src="/2024/woodenbox/telegram.png" >}}
  {{< figure src="/2024/woodenbox/esp32.jpeg" >}}

{{< /twocolumns >}}

> **Pictures**

{{< twocolumns 40 >}}

  {{< figure src="/2024/woodenbox/woodenbox-side.jpeg" >}}
  {{< figure src="/2024/woodenbox/woodenbox-slide.jpeg" >}}
  {{< figure src="/2024/woodenbox/woodenbox-behind.jpeg" >}}
  {{< figure src="/2024/woodenbox/woodenbox-open.jpeg" >}}

{{< /twocolumns >}}

{{< space 50 >}}

> **Power consumption**

{{< twocolumns 40 mobile >}}

  {{< column >}}
    The power consumption of the ESP32 is negligible and the server only uses about 20W on full load, 8W idle, and 2W while suspended. This results in a very low average cost (@ 0.15 €/kWh) of <b>0.1 € per week</b>.
  {{< /column >}}

  {{< figure src="/2024/woodenbox/power.jpg" >}}

{{< /twocolumns >}}
