Maze Tile ( `|,—` is wall, `x` is tile)
```
    0
   — —
  |x|x|
3  — —  1
  |x|x|
   — —
    2
```

mazeEntry Format = 16 bit unsigned integer

each bit corresponding one wall (or tile) (0 mean no wall/tile, 1 is vice versa)

start with the least significant bit
```
     02    05
  01 04 03 08 06
     15    07
  14 16 11 12 09
     13    10
```
