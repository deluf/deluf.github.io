---
title: BGP traffic engineering 
date: "2026-02-27T00:00:00+01:00"
draft: false
description: "Implementation of a case study network in **ContainerLab** with automated router configuration and **traffic engineering** via **BGP** attribute manipulation"

cover:
  alt: Preview of BGP traffic engineering 
  image: /2026/bgp-traffic-engineering/network-implementation.png

tags:
- ContainerLab
---

---

> **Resources**

- [Code](https://github.com/deluf/bgp-traffic-engineering)
- [Documentation](/2026/bgp-traffic-engineering/documentation.pdf)

---

## Highlights

> **Summary**

{{< space 20 >}}

This project implements a complete multi-AS network simulation in **ContainerLab** using **FRRouting (FRR)** routers, combined with a centralized network automation system running on an **Alpine Linux** manager node. 

By analyzing traffic prediction matrices, the manager dynamically calculates the optimal distribution of outbound traffic across multiple upstream internet links, enforcing the distribution programmatically using **BGP attribute manipulation** (`LOCAL_PREF`).

---

> **Network implementation**

{{< space 20 >}}

{{< figure src="/2026/bgp-traffic-engineering/network-implementation.png" caption="Complete network topology" >}}

{{< space 30 >}}

The network topology consists of three primary areas:
* **Customer networks (`AS 65001` & `AS 65002`):** Represented by customer edge routers (`CE1` and `CE2`) and Alpine test nodes, hosting subnets `1.0.0.0/24` and `2.0.0.0/24` respectively
* **Core transit network (`AS 65020`):** Contains provider edge routers (`PE1`, `PE2`), gateway routers (`GW1`, `GW2`), and a centralized manager node, connected together via a Linux bridge for simplicity
* **Upstream providers (`AS 65004` & `AS 65005`):** Represented by upstream routers (`UP1`, `UP2`) serving as gateways to the simulated internet (advertised prefixes: `131.114.0.0/16`, `192.0.2.0/24`, `198.51.100.0/24`, and `203.0.113.0/24`)

To avoid manual errors and improve scalability, all routers are configured via a **Jinja2** template (AS numbers, router IDs, BGP neighbors, ...).

---

> **Centralized traffic engineering**

{{< space 20 >}}

Standard BGP routing lacks global coordination. Outbound traffic to the internet from the core AS default-routes through a single gateway (`GW1`) due to BGP's last tie-breaker rule (lower router ID). 

While BGP Multipath (`bgp bestpath as-path multipath-relax`) can balance traffic, it operates blindly without considering traffic predictions and fails to coordinate between separate PE routers.

To solve this, our centralized traffic engineering system operates as follows:
1. The manager parses a JSON file containing **destination traffic predictions** from each customer, e.g.:
   ```json
   {
     "C1": { "198.51.100.0/24": 150, "203.0.113.0/24": 35 },
     "C2": { "131.114.0.0/16": 20, "192.0.2.0/24": 50, "203.0.113.0/24": 40 }
   }
   ```
2. The system **sums predictions by destination prefix**
   * `198.51.100.0/24` \(\rightarrow\) 150
   * `203.0.113.0/24` \(\rightarrow\) 75
   * `192.0.2.0/24` \(\rightarrow\) 50
   * `131.114.0.0/16` \(\rightarrow\) 20
   > Total Load: 295
3. To distribute \(N\) destination paths across two upstream links (`GW1-UP1` and `GW2-UP2`) while minimizing the link utilization imbalance, the problem is solved as a binary knapsack problem where:
   * \(\text{Capacity} = \sum_{i=1}^N \text{Load}_i / 2 = 147.5\)
   * \(\text{Weight}_i = \text{Load}_i\)
   * \(\text{Value}_i = \text{Load}_i\)
   
Using a dynamic programming algorithm with \(\mathcal{O}(N \cdot \text{Capacity})\) time and space complexity, the manager selects a subset of paths to assign to `GW1` that maximizes load without exceeding capacity (145), leaving the remaining paths (150) to `GW2`.

Once the optimal path distribution is calculated, the manager node  programmatically enforces it by connecting via SSH into `GW1` and `GW2` and increasing the `LOCAL_PREF` attribute of the assigned routes.
