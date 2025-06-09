---
title: Inverted index
date: "2025-06-05T00:00:00+01:00"
draft: false

description: "**Distributed application** that builds an inverted index structure using the **Hadoop** and **Spark** frameworks"

cover:
  alt: Preview of Inverted index
  image: 2025/inverted-index/preview.png

tags:
- Hadoop
- Spark
- Java
- Python
---

---

> **Resources**

- [Code](https://github.com/deluf/inverted-index)
- [Documentation](/2025/inverted-index/documentation.pdf)

---

## Highlights

> **Summary**

{{< space 20 >}}

In this group project, we explored the performance and scalability of three approaches to building an inverted index - a data structure that maps a word to the files in which it appears, widely used in database indexes and search engines.

Our work compared:
- A simple Python non-parallel script
- A Hadoop-based solution
- A Spark-based solution

We evaluated all implementations on a distributed cluster (courtesy of the University of Pisa) using real-world datasets from [Project Gutenberg](https://www.gutenberg.org/) (UTF-8 books), ranging from 500 KB to 5 GB. 

Thanks to the limited RAM, the Hadoop solution showed performance comparable to Spark when tuned properly, while Python excelled in simplicity and low memory usage for smaller datasets.

This project offered hands-on experience with big data tools and showcased the trade-offs between simplicity, scalability, and efficiency in cloud-native applications.

{{< space 40 >}}

> **Pictures**

{{< figure src="/2025/inverted-index/combiners.png" caption="Execution times of different combiner designs for the Hadoop solution as the size of the dataset increases" >}}

{{< space 50 >}}

{{< figure src="/2025/inverted-index/final-chart.png" caption="Execution times of the three different solutions as the size of the dataset increases" >}}

{{< space 50 >}}
