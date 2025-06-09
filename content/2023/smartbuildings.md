---
title: SmartBuildings
date: "2023-04-21T00:00:00+01:00"
draft: false

description: "**MySQL** database which handles buildings equipped with sensors and provides data analytics functions such as damage estimation following earthquakes"

cover:
  alt: Preview of SmartBuildings
  image: 2023/smartbuildings/preview.png

tags:
- Mysql
---

---

> **Resources**

- [Code](https://github.com/deluf/smartbuildings) (:it:)
- [Documentation](/2023/smartbuildings/documentation.pdf) (:it:)
- [Restructured ER diagram](/2023/smartbuildings/er-diagram.pdf) (:it:)
- [ER diagram](/2023/smartbuildings/restructured-er-diagram.pdf) (:it:)

---

## Highlights

SmartBuildings is the database of a company wihch deals with the construction and renovation of buildings with the purpose of improving their structural health and overall safety

> **Calculate the area of any given building**

Walls are stored as segments in the Euclidean plane {(X{{< subscript 1>}}, Y{{< subscript 1>}}), (X{{< subscript 2>}}, Y{{< subscript 2>}})}, this means that using the [shoelace formula](https://en.wikipedia.org/wiki/Shoelace_formula) it is possible to calculate the area of any given building, and in the database there is a function which does just that

![Shoelace formula animation](/2023/smartbuildings/shoelace.gif)

In order to apply the shoelace formula we must: 
1. Only consider the polygon formed by the external walls of the building (trivial: an external wall is a wall that delimits one and only one room)
2. **Order the vertices of that polygon in either a clockwise or counterclockwise order**

To achieve the second point, one can simply start from a random vertex of the polygon and then query the table containing the walls to get (one of) the two adjacent vertices. By keeping track of which vertices have already been visited, one will end up with either a clockwise or a counterclockwise ordering, depending on the random choice made at the first vertex

{{< space 50 >}}

> **Create an SVG plan of any given floor**

{{< twocolumns 20 mobile >}}
    {{< column >}}
        The database contains a function which outputs a string representing the SVG plan of any given floor:
        <ul>
            <li><span style="color: #4aa1ff;">Blue</span> segments are windows</li>
            <li><span style="color: #3cc961;">Green</span> segments are doors</li>
            <li><span style="color: #aa6c49;">Brown</span> segments are generic openings</li>
            <li><span style="color: #c33232;">Red</span> dots are sensors</li>
        </ul>
    {{< /column >}}
    {{< column >}}
        <img width="300" style="margin: 0" src="/2023/smartbuildings/floor.png" alt="Floor plan">
    {{< /column >}}
{{< /twocolumns >}}

{{< space 50 >}}

> **Estimate the magnitude of an earthquake**

In case of an earthquake, a database administrator can launch a stored procedure that estimates its magnitude using data gathered from the accelerometers of nearby buildings

First, every (nearby) building computes a rough estimate of the magnitude by mapping the average measured acceleration to a magnitude value of the following table:

![PGA to Mercalli table](/2023/smartbuildings/pga-table.png)

Then, all the perceived magnitudes are used to approximate the intensity of the earthquake in its epicenter \(Mercalli_0\) by inverting the following (heuristic) formula:

\[ Mercalli(r) = \frac{Mercalli_0}{\left(\frac{r}{\mu} + 1\right)^2} \]

- \(Mercalli(r)\) is the perceived magnitude of a building distant \(r\) km from the epicenter
- \(\mu\) is the attenuation coefficient of the mechanical waves coming from the earthquake, by default 600
- \(+ 1\) stops the function from going to \(+\infty\) for \(r\to0\)
- The exponent 2 at the denominator accounts for the fact that the energy carried in mechanical waves attenuates quadratically with the distance from the epicenter
