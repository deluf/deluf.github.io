---
title: SmartBuildings
date: "2023-04-21T00:00:00+01:00"
draft: false

description: "**MySQL** database which stores buildings equipped with sensors and provides data analytics functions such as damage estimates following earthquakes"

cover:
  alt: Preview of SmartBuildings
  image: 2023/smartbuildings/preview.png

tags:
- Mysql

weight: 3
---

---

> **Resources**

- Check out the code on [github](https://github.com/deluf/smartbuildings) (:it:)
- Full project documentation is available [here](/2023/smartbuildings/documentation.pdf) (:it:)
- Restructured ER diagram is available is available [here](/2023/smartbuildings/er-diagram.pdf) (:it:)
- ER diagram is available is available [here](/2023/smartbuildings/restructured-er-diagram.pdf) (:it:)

---

## About

SmartBuildings is the database of a company wihch deals with construction and renovation of buildings with the purpose of improving their security

The database stores the internal structure of buildings, the jobs carried out on them and their cost, the staff and the work shifts, the materials used and the warehouse, the sensors installed in the buildings and their measurements and finally the possible calamitous events and the their effect on surrounding buildings

## Highlights

> **Calculate the area of any given building**

The walls of the buildings are stored as segments in the Euclidean plane {(X{{< subscript 1>}}, Y{{< subscript 1>}}), (X{{< subscript 2>}}, Y{{< subscript 2>}})}, this means that using the [shoelace formula](https://en.wikipedia.org/wiki/Shoelace_formula) we can calculate the area of any given building, and in the database there is a function which does just that:

![Shoelace formula animation](/2023/smartbuildings/shoelace.gif)

In order for this to work we must: 
1. Only consider the polygon formed by the external walls of the building
2. **Order the vertices of that polygon in either a clockwise or counterclockwise order**

The first one is trivial; to achieve the second one, we can simply start from a random vertex of the polygon and then query the walls' table to get (one of) the two adjacent vertices. If we keep track of which vertices we have already visited, we will end up with either a clockwise or a counterclockwise ordering, depending on the random choice made at the first vertex (the only one in which we could have gone to either adjacent vertex since neither of them was already visited)

{{< space 50 >}}

> **Create an SVG plan of any building floor**

{{< twocolumns 20 >}}
    {{< column >}}
        The database contains a function which outputs a string representing the SVG plan of any given building floor:
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

> **Approximate earthquakes magnitude using accelerometers data**

The database contains a stored procedure which approximates the magnitude of an earthquake using data collected form accelerometers in nearby buildings

To **calculate the perceived magnitude of the earthquake by a given building** we can use the following table:

![PGA to Mercalli table](/2023/smartbuildings/pga-table.png)

We can then use the perceived magnitude \(Mercalli(r)\) of a building distant \(r\) km from the epicenter to approximate the intensity of the earthquake in its epicenter \(Mercalli_0\) using the following formula:

\[ Mercalli(r) = \frac{Mercalli_0}{\left(\frac{r}{\mu} + 1\right)^2} \]

- \(\mu\) is the attenuation coefficient of the mechanical waves coming from the earthquake, by default 600
- \(+ 1\) stops the function from going to \(+\infty\) for \(r\to0\)
- The exponent 2 at the denominator accounts for the fact that the energy carried in mechanical waves attenuates quadratically with the distance from the epicenter
