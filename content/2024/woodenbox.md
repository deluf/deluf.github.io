---
title: Woodenbox
date: "2024-03-06T00:00:00+01:00"
draft: false

description: "**Home server** running Proxmox VE on an **old laptop** moved inside of a custom wooden case, booted up remotely by a **telegram bot** hosted on an **ESP32** and accessed via a **WireGuard VPN**"

cover:
  alt: Preview of Woodenbox
  image: 2024/woodenbox/preview.jpeg

tags:
- Arduino
- Linux
- Python

weight: 1
---

---

> **Resources**

- [ESP32's code](/code/esp32-telegram-bot/) (Arduino/C++)
- [Server's code](/code/woodenbox-flask-api/) (Python)

---

## About

> **Network configuration**

{{< figure src="/2024/woodenbox/network-diagram.png" >}}

The old laptop rocks an AMD A8 6410 @2.0GHz with 8GB DDR3 RAM and a 512GB SATAIII SSD. Software side, it runs **Proxmox Virtual Environment**, a hosted hypervisor on which i configured two separate containers: one for a **samba share** (of the entire disk) and one for a wireguard **VPN** (PiVPN)

The laptop is suspended most of the time, and only gets turned on when i want to use it. To accomplish this, an always-on ESP32 microcontroller in the same local networks hosts a telegram bot and is instructed to send a WakeOnLan packet to the laptop if it receives the message `/boot`

The ESP32 also handles more complex commands that directly interact with the server, such as starting a proxmox container/vm `/start container-id` or putting the server back to a suspended state `/suspend`. To accomplish this, commands of such type are forwarded from the ESP32 to the server through a flask API (the ESP32 basically acts as a relay node here)

{{< space 50 >}}

{{< twocolumns 40 >}}

  {{< figure src="/2024/woodenbox/telegram.png" >}}
  {{< figure src="/2024/woodenbox/esp32.jpeg" >}}

{{< /twocolumns >}}

> **Hardware**

{{< twocolumns 40 >}}

  {{< figure src="/2024/woodenbox/woodenbox-side.jpeg" >}}
  {{< figure src="/2024/woodenbox/woodenbox-slide.jpeg" >}}
  {{< figure src="/2024/woodenbox/woodenbox-behind.jpeg" >}}
  {{< figure src="/2024/woodenbox/woodenbox-open.jpeg" >}}

{{< /twocolumns >}}

> **Flask API**

Note that the flask API is not running as root, but can still run root commands such as `poweroff` and `systemctl suspend`, this is because i gave the user running the API the permission to only run specific root commands with specific parameters. Maximum security!

```bash
# In: /etc/sudoers.d/flask

# ...
flask ALL=NOPASSWD: \
  /usr/bin/systemctl suspend, \
  /usr/sbin/reboot, \
  /usr/sbin/poweroff, \
  /usr/sbin/pct start 201, \  # Proxmox command to start the vpn container
  /usr/sbin/pct shutdown 201  # Proxmox command to stop the vpn container
# ...
```

{{< space 50 >}}

> **Power consumption**

{{< twocolumns 40 mobile >}}

  {{< column >}}
    The power consumption of the ESP32 is negligible and the server only uses about 20W on full load, 8W idle, and 2W while suspended <i>(i have to suspend it instead of completely turning it off otherwise the WakeOnLan procedure doesn't always work)</i>. This results in an average cost (@ 0.15 €/kWh) of <b>0.1 € per week</b>. That's really low!
  {{< /column >}}

  {{< figure src="/2024/woodenbox/power.jpg" >}}

{{< /twocolumns >}}
