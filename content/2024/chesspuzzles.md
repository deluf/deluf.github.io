---
title: ChessPuzzles
date: "2024-01-08T00:00:00+01:00"
draft: false

description: "**Java 11** **Spring** application which wraps [chess.com's puzzle api](https://www.chess.com/news/view/published-data-api) for a **JavaFX** client"

cover:
  hidden: false
  image: 2024/chesspuzzles/preview.png
  relative: false

tags:
- Java
- Spring
---

---

> **Resources**

- [Code](https://github.com/deluf/chesspuzzles)

---

## Client side

![Authentication screen](/2024/chesspuzzles/auth.png)
![Main screen](/2024/chesspuzzles/main.png)

The board is an image (more on that later), the user writes the move he thinks is best using [algebraic chess notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)), if he can't find it he can ask for a hint (the piece to move) or give up and see the solution

![Play screen](/2024/chesspuzzles/play.png)

Users can also add puzzles to favourites and play them again later

![Favourites screen](/2024/chesspuzzles/favourites.png)


## Server side
    
The **MySQL database** stores users, attempts and favourite puzzles (via JSON serialization) and is automatically created and populated by the **Java Persistence Api** with the values present in the JSON files inside the `resources/init` folder

The endpoints of [chess.com's puzzle api](https://www.chess.com/news/view/published-data-api) used by the spring application are:
- `https://api.chess.com/pub/puzzle/random`
- `https://www.chess.com/dynboard?fen=...&board=...&pieces=...`

There is a **shared** *(kind of)* **package** between the client and the server called `shared` used 
for the json serialization and de-serialization of HTTP requests

The endpoints exposed by the spring application are:

```
    GET  /puzzles/random
    GET  /puzzles/draw?fen=...&board=...&pieces=...

    POST /users/login
    POST /users/register

    GET  /users/{userId}/favourites/all
    POST /users/{userId}/favourites/{favouriteId}/delete
    POST /users/{userId}/favourites/{favouriteId}/mark-as-solved
    POST /users/{userId}/favourites/{favouriteId}/mark-as-to-solve
    
    GET  /users/{userId}/attemps/afer?timestamp=...
    POST /users/{userId}/attemps/add
```
