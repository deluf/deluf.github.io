---
title: Codfish 2000
date: "2023-06-30T00:00:00+01:00"
draft: false

description: "**Javascript** chess engine written from scratch, with a nice ui and a simple **PHP**-**MySQL** back-end"

cover:
  alt: Preview of Codfish 2000
  image: 2023/codfish-2000/preview.png

editPost:
  Text: Suggest Changes
  URL: https://github.com/deluf/deluf.github.io/content
  appendFilePath: true

tags:
- Html
- Css
- Javascript
- Php
---

---

> **Resources**

- Check out the code on [github](https://github.com/deluf/codfish-2000)
- [Play against the engine!](/2023/codfish-2000/demo/)

---

## About

Codfish 2000 is a javascript chess engine:                
- The name *'Codfish'* is inspired by the famous chess engine [stockfish](https://stockfishchess.org/)
- The *'2000'* is the approximate rating

For the first few moves, the engine will randomly choose one of the three most popular lines played by grandmasters in over-the-board games. If the user plays an unknown opening move or the opening book ends, then the engine will start playing moves by itself, using a basic [minimax algorithm](https://en.wikipedia.org/wiki/Minimax) with [alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) optimization
        
All the [rules of chess](https://en.wikipedia.org/wiki/Rules_of_chess) are implemented except for the repetition rule (if the same board appears three times, then the game ends in a draw)

The [algebraic notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)) used (the standard method for describing moves) is also slightly simplified and does not consider checks (+) and checkmates (#)
        
The website offers the possibility to use Codfish 2000 to analyze any chess position, specified via the standard [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) notation, and also offers the possibility to watch the engine play against itself
    
Registered users can save the result of each analysis to a database and can also, during a match against the engine, create a bookmark of a particular position to analyze later
        

## See it in action

{{< video "/2023/codfish-2000/play.mp4" >}}

{{< space 2 >}}

{{< video "/2023/codfish-2000/analyze.mp4" >}}

{{< space 2 >}}

> Note: *Security was NOT a priority in this project (at least passwords are hashed)*
