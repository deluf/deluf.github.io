---
title: UniPi++
date: "2025-09-25T00:00:00+01:00"
draft: false
description: "Browser extension that enhances the University of Pisa students portal, published on both Chorme Web Store and Mozilla Addons"

cover:
  alt: Preview of UniPi++
  image: /2025/unipi-plus-plus/almalaurea.png

tags:
- Python
- Javascript
---

---
> **Resources**
- [Code](https://github.com/deluf/unipi-plus-plus)
<a href="https://chromewebstore.google.com/detail/unipi++/iblkplielknafpegjacgjbpgjgdcnkij"><img src="/2025/unipi-plus-plus/chrome.png" alt="Chrome web store banner"></a>
<a href="https://addons.mozilla.org/addon/unipi/"><img src="/2025/unipi-plus-plus/firefox.webp" alt="Mozilla add-on banner"></a>

[![Stars history chart](https://api.star-history.com/svg?repos=deluf/unipi-plus-plus&type=Date)](https://www.star-history.com/#deluf/unipi-plus-plus&Date)

---

## Highlights

> **Overview**

**UniPi++** is a browser extension (Chromium-based & Firefox) that enhances the University of Pisa student portal by adding detailed statistics and insights about both completed and future exams

---

> **Features**

i. **Comprehensive dashboard**

A visually pleasing dashboard that shows your weighted average, arithmetic average, predicted final grade, grade distribution chart (histogram) and grade progression chart (scatterplot)

![home](/2025/unipi-plus-plus/home.png)

- In particular:
    
    - Metrics can be calculated per academic year or across all exams
    
    - Individual exams can be excluded with simple checkboxes
    
    ![home](/2025/unipi-plus-plus/checkbox.png)
    
    - All parameters (e.g., honors grade value, credit exclusions) and even visual settings (e.g., color map) can be fully customized via the extension’s popup menu
    
    ![home](/2025/unipi-plus-plus/popup.png)

ii. **Metrics comparison**

A dropdown menu wich allows you to compare your metrics with the average results of any degree program offered by the University of Pisa

![home](/2025/unipi-plus-plus/almalaurea.png)

> The reference data comes from publicly available statistics on [www.almalaurea.it](https://www.almalaurea.it)

iii. **Exam forecast**

Simulate how your average would change depending on the grades of your upcoming exams

![home](/2025/unipi-plus-plus/forecast.png)

> How is the final grade predicted ? A quadratic regression model is applied, trained on the relationship between average exam grade and average final grade across all degree programs offered by the University of Pisa in the years 2022, 2023, and 2024 ![home](/2025/unipi-plus-plus/predictor.png)

---

> **Privacy**

- The extension is only active on https://www.studenti.unipi.it/auth/studente/Libretto. It can not physically read data from any other websites
- The extension only reads the exam table (exam names, grades and credits) and nothing else
- All data is processed locally on the user's computer. Nothing is ever transmitted to or stored on any external server
