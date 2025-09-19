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

In this group project, we developed a real-time football analysis system using a **fine-tuned `YOLOv11`** object detection model, capable of identifying players, goalkeepers, referees, and the ball directly from live match footage.

To achieve this, we built two separate components:

- **Object detector**: A `YOLOv11` model fine-tuned on a dataset of 400 labeled football frames. Using 5-fold cross-validation, we selected the ‘m’ variant for its balanced accuracy and efficiency. Despite great performance on most classes, ball detection remained a challenge due to its small size and visual ambiguity (e.g., penalty spots, players’ heads)

- **Team classificator**: `K-means` clustering applied to the color features (hue and saturation) of the upper half of each bounding box (where the player's shirt is most likely located)

The system achieves a mean Average Precision (`mAP@50`) of \(0.827\) across the main object classes and runs at `30 FPS` on a consumer-grade `RTX 2060 Super GPU`.

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
