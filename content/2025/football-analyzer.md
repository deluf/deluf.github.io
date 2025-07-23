---
title: Football analyzer
date: "2025-07-23T00:00:00+01:00"
draft: false

description: "Computer vision model based on **YOLOv11** that analyzes football matches"

cover:
  alt: Preview of Football analyzer
  image: 2025/football-analyzer/preview.jpg

tags:
- ComputerVision
- Python
---

---

> **Resources**

- [Code](https://github.com/deluf/football-analyzer)
- [Paper](/2025/football-analyzer/paper.pdf)
- [Presentation](/2025/football-analyzer/presentation.pdf)

---

## Highlights

> **Summary**

{{< space 20 >}}

In this group project, we developed a real-time vision-based football analysis system using a fine-tuned YOLOv11 object detection model, capable of identifying players, goalkeepers, referees, and the ball directly from high-resolution match footage.

The system achieves a mean Average Precision (mAP@50) of 0.827 across the main object classes and runs at 30 FPS on a consumer-grade RTX 2060 Super GPU, demonstrating the feasibility of low-cost, real-time sports analytics.

Two core components were built:

- **Object detector**: A YOLOv11 model was fine-tuned using a manually cleaned and augmented dataset of 400 labeled football frames. Using 5-fold cross-validation, the ‘m’ variant was selected for its balanced accuracy and efficiency. Despite excellent performance on most classes, ball detection remained a challenge due to its small size and visual ambiguity.

- **Team classificator**: An unsupervised pipeline was designed to assign detected players to teams using K-means clustering on torso color features. Without prior knowledge of jersey styles, the system achieved visually coherent team groupings, generalizable across matches.

The project highlights the potential computer vision-driven sports intelligence in accessible environments such as local clubs or amateur leagues, and lays the groundwork for more advanced features like event detection and spatial reasoning in future versions.


{{< space 40 >}}

> **Pictures**

{{< figure src="/2025/football-analyzer/aps.png" caption="Mean ± standard deviation of AP@50 per class, for each candidate model" >}}

{{< space 50 >}}

{{< figure src="/2025/football-analyzer/confusion-matrix.png" caption="Normalized confusion matrix for the selected model 'm', indicating class-wise accuracy and common misclassifications" >}}

{{< space 50 >}}

{{< figure src="/2025/football-analyzer/curves.png" caption="Precision–Recall curves for the selected model 'm'. A confidence threshold near 0.2 offers a good trade-off between precision and recall" >}}

{{< space 50 >}}

{{< figure src="/2025/football-analyzer/prediction.jpg" caption="Sample prediction made by the selected model 'm'" >}}

{{< space 50 >}}

> **See it in action**

{{< video "/2025/football-analyzer/action.mp4" >}}
