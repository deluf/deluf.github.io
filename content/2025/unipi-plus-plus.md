---
title: UniPi++
date: "2025-09-25T00:00:00+01:00"
draft: false
description: "**Browser extension** that adds detailed statistics to the University of Pisa's student transcript page; reviewed and accepted by both **Chorme Web Store** and **Mozilla Addons**"

cover:
  alt: Preview of UniPi++
  image: /2025/unipi-plus-plus/home.png

tags:
- Javascript
- Python
---

---
> **Resources**
- [Code](https://github.com/deluf/unipi-plus-plus)

<!-- [![Stars history chart](https://api.star-history.com/svg?repos=deluf/unipi-plus-plus&type=Date)](https://www.star-history.com/#deluf/unipi-plus-plus&Date) -->

---

<div style="display: flex; justify-content: center; flex-direction: row; flex-wrap: wrap;">
    <img src="/2025/unipi-plus-plus/preview.png" alt="icon" width="120">
    <img src="/2025/unipi-plus-plus/text.png" alt="title" width="400">
</div>

<div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 20px;">
    <div style="display: flex; justify-content: center; align-items:center; flex-direction: column;">
        <a href="https://chromewebstore.google.com/detail/unipi++/iblkplielknafpegjacgjbpgjgdcnkij">
            <img src="/2025/unipi-plus-plus/chrome.png" height="55" alt="Chrome web store banner">
        </a>
        <img src="https://img.shields.io/chrome-web-store/users/iblkplielknafpegjacgjbpgjgdcnkij?logo=google-chrome&logoColor=white&label=Active%20students&color=green" alt="Chrome users" height="25">
    </div>
    <div style="display: flex; justify-content: center; align-items:center; flex-direction: column;">
        <a href="https://addons.mozilla.org/addon/unipi/">
            <img src="/2025/unipi-plus-plus/firefox.webp" height="55" alt="Mozilla add-on banner">
        </a>
        <img src="https://img.shields.io/amo/users/unipi?logo=firefox&logoColor=white&label=Active%20students&color=orange" alt="Firefox users" height="25">
    </div>
</div>

---

## Highlights

---

A dashboard shows the weighted average, the arithmetic average, the predicted final grade, the grade distribution chart and the grade progression chart

<img src="/2025/unipi-plus-plus/home.png" alt="home" height=400>

- Specifically:
    
    - Metrics can be calculated per academic year or across all exams
    
    - Individual exams can be excluded with simple checkboxes
    
    <img src="/2025/unipi-plus-plus/checkbox.png" alt="checkbox" height=250>
    
    - All parameters (e.g., honors grade value, credit exclusions) and even visual settings (e.g., color map) can be fully customized via the extension’s popup menu
    
    <img src="/2025/unipi-plus-plus/popup.png" alt="popup" height=300>

---

A dropdown menu allows you to compare your metrics with the average results of any degree program offered by the University of Pisa

<img src="/2025/unipi-plus-plus/almalaurea.png" alt="almalaurea" height=250>

> The reference data comes from publicly available statistics on [www.almalaurea.it](https://www.almalaurea.it)

---

An exam forecast section simulates how your average could change depending on the grades you think you will get on your upcoming exams

<img src="/2025/unipi-plus-plus/forecast.png" alt="forecast" height=250>

> How is the final grade predicted ? A quadratic regression model is applied, trained on the relationship between average exam grade and average final grade across all degree programs offered by the University of Pisa in the years 2022, 2023, and 2024 <img src="/2025/unipi-plus-plus/predictor.png" alt="predictor" height=350>

---

> **Privacy**

- The extension is only active on https://www.studenti.unipi.it/auth/studente/Libretto. It can not physically read data from any other websites
- The extension only reads the exam table (exam names, grades and credits) and nothing else
- All data is processed locally on the user's computer. Nothing is ever transmitted to or stored on any external server
