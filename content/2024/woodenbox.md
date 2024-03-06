---
title: Woodenbox
date: "2024-03-06T00:00:00+01:00"
draft: false

description: "**Home server** running Proxmox VE on an **old laptop** moved inside of a custom wooden case, booted up remotely by a **telegram bot** hosted on an **ESP32** and accessed via **WireGuard VPN**"

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

- Excel budget analysis sheet is available [here](/2024/innovatec/analysis.xlsx) (:it:)
- PDF version of the presentation is available [here](/2024/innovatec/presentation.pdf) (:it:)

---

## About

> **Why ?**

{{< space 25 >}}

I needed to **store video recordings of university's lectures**, but my laptop's disk size was only 256GB (and was already almost full). I didn't want to carry around a portable hard drive, and i also wanted a place with some kind of redundancy to **store my backups**. I had an old laptop lying around and using it as a server seemed the perfect solution. The hardware is an AMD A8 6410 @2.0GHz with 8GB DDR3 RAM and the data is stored in a **RAID 1 (mirror) ZFS pool** consisting of two identical 500GB USB hard drives. Software side, the laptop runs **Proxmox Virtual Environment**, a hosted hypervisor on which i configured two separate containers: one for a **samba share** (of the whole ZFS pool) and one for a VPN *(more on that later)*.

{{< twocolumns 40 >}}

  {{< figure src="/2024/woodenbox/woodenbox-side.jpeg" >}}
  {{< figure src="/2024/woodenbox/woodenbox-slide.jpeg" >}}
  {{< figure src="/2024/woodenbox/woodenbox-behind.jpeg" >}}
  {{< figure src="/2024/woodenbox/woodenbox-open.jpeg" >}}

{{< /twocolumns >}}

> **Turning the server on remotely**

I could have kept the server running 24/7, since it only consumes an average of 10W *(more on that later)*, but, since i sleep in the same room, i wanted to have a fast and easy way of turning it on and off when needed, so that i don't constanlty have the fan noise in the background. The solution i chose was to have an **ESP32 microcontroller always running** in the same network as the server, **receiving commands through a telegram bot** (the `/boot` command sends a **WakOnLAN** packet to the server). Maximum efficiency!

{{< twocolumns 40 >}}

  {{< figure src="/2024/woodenbox/telegram.png" >}}
  {{< figure src="/2024/woodenbox/esp32.jpeg" >}}

{{< /twocolumns >}}

Note that in order for the WakeOnLAN packet to work the server's network card must support it and must be properly configured:
```bash
# In: /etc/network/interfaces
# After: iface enp3s0 inet manual

# Every time the server boots, set the WakeOnLAN to 
# magic packet activity (g) for the enp3s0 interface
pre-up /usr/sbin/ethtool -s enp3s0 wol g  
```

{{< space 50 >}}

> **Turning the server off remotely**

**The same telegram bot is also running on the server**, both the ESP32 and the server see all the messages, but they only reply to specific ones (see the picture above). To automatically start the telegram bot every time the server boots i simply added a `crontab` rule for a shell script:

```bash
echo "/home/telegram/bot/.venv/bin/python /home/telegram/bot/bot.py" > start.sh

# In: crontab -e
@reboot /usr/bin/sh /home/telegram/bot/start.sh&
# The & at the end is crucial! Otherwise the boot process stops in
# the infinite loop that the telegram bot uses to fetch messages
```

{{< space 25 >}}

Note that the telegram bot is not running as root (as it should be), but can still run root commands such as `poweroff` and `systemctl suspend`, this is because i gave the user running the bot the permission to only run specific root commands with specific parameters. Maximum security!

```bash
# In: /etc/sudoers.d/telegram

# ...
telegram ALL=NOPASSWD: \
  /usr/bin/systemctl suspend, \
  /usr/sbin/reboot, \
  /usr/sbin/poweroff, \
  /usr/sbin/pct start 202, \  # Proxmox command to start the vpn container
  /usr/sbin/pct shutdown 202  # Proxmox command to stop the vpn container
# ...
```

{{< space 50 >}}

> **Accessing the server remotely**

Here i could have either opened up a port for each service or a single port for a VPN and then use that to access each service, as if i were on my local network. The obvious choice was the second one because:
1. **It adds another layer of security**: outside my local network, i must go through the VPN before even having the chance of trying to access the services
2. **It reduces the attack surface**: only one service (**WireGuard**, the VPN) is exposed, instead of multiple ones
3. **I can enable and disable it whenever i need to**, reducing even further the attack surface: with the telegram commands `/startvpn` and `/stopvpn` i can expose the VPN only when i really need it, leaving it off while i am at home

{{< space 50 >}}

> **Power consumption**

{{< twocolumns 40 >}}

  {{< column >}}
    The power consumption of the ESP32 is negligible and the server only uses about 20W on full load, 8W idle, and 2W while suspended <i>(i have to suspend it instead of completely turning it off otherwise the WakeOnLan procedure doesn't always work)</i>. This results in an average cost (@ 0.15 €/kWh) of <b>0.1 € per week</b>. That's really low!
  {{< /column >}}

  {{< figure src="/2024/woodenbox/power.jpg" >}}

{{< /twocolumns >}}






