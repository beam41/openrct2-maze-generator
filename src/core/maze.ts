import { INVALID, PATH, PREBUILTPATH, WALL } from '@/src/core/reference'
import { genMatrix, getMazeTileConnectedToGate } from '@/src/core/generate'

export function mazeEntryToTileMap(mazeEntry: number): (number | null)[][] {
  const pos = Array<number>(16)
  for (let i = 0; i < 16; i++) {
    pos[i] = (mazeEntry & (1 << i)) >> i
  }
  // prettier-ignore
  return ([
    [    null,  pos[1],    null,  pos[4],   null ],
    [  pos[0],  pos[3],  pos[2],  pos[7], pos[5] ],
    [    null, pos[14],    null,  pos[6],   null ],
    [ pos[13], pos[15], pos[10], pos[11], pos[8] ],
    [    null, pos[12],    null,  pos[9],   null ],
  ])
}

export function tileMapToMazeEntry(tileMap: number[][]): number {
  return (
    tileMap[1][0] +
    (tileMap[0][1] << 1) +
    (tileMap[1][2] << 2) +
    (tileMap[1][1] << 3) +
    (tileMap[0][3] << 4) +
    (tileMap[1][4] << 5) +
    (tileMap[2][3] << 6) +
    (tileMap[1][3] << 7) +
    (tileMap[3][4] << 8) +
    (tileMap[4][3] << 9) +
    (tileMap[3][2] << 10) +
    (tileMap[3][3] << 11) +
    (tileMap[4][1] << 12) +
    (tileMap[3][0] << 13) +
    (tileMap[2][1] << 14) +
    (tileMap[3][1] << 15)
  )
}

function copyMazeTile(mazeTile: number[][]) {
  const mazeTileCpy = genMatrix(mazeTile.length, mazeTile[0].length, 0)
  for (let x = 0; x < mazeTile.length; x++) {
    for (let y = 0; y < mazeTile[0].length; y++) {
      mazeTileCpy[x][y] = mazeTile[x][y]
    }
  }
  return mazeTileCpy
}

export function prefillTileAfterGate(
  mazeTile: number[][],
  minX: number,
  minY: number,
  entranceCoords: CoordsXYZD,
  exitCoords: CoordsXYZD,
): number[][] {
  const mazeTileCpy = copyMazeTile(mazeTile)
  const enterMazeCoords = getMazeTileConnectedToGate(entranceCoords)
  const exitMazeCoords = getMazeTileConnectedToGate(exitCoords)
  const prefillList = [
    [enterMazeCoords.x, enterMazeCoords.y, entranceCoords.direction],
    [exitMazeCoords.x, exitMazeCoords.y, exitCoords.direction],
  ]

  for (const [x, y, d] of prefillList) {
    const posX = (x / 32 - minX) * 4
    const posY = (y / 32 - minY) * 4
    switch (d) {
      case 0:
        mazeTileCpy[posX + 2][posY] = PREBUILTPATH
        mazeTileCpy[posX + 2][posY + 1] = PREBUILTPATH
        mazeTileCpy[posX + 2][posY + 2] = PREBUILTPATH
        break
      case 1:
        mazeTileCpy[posX][posY] = PREBUILTPATH
        mazeTileCpy[posX + 1][posY] = PREBUILTPATH
        mazeTileCpy[posX + 2][posY] = PREBUILTPATH
        break
      case 2:
        mazeTileCpy[posX][posY] = PREBUILTPATH
        mazeTileCpy[posX][posY + 1] = PREBUILTPATH
        mazeTileCpy[posX][posY + 2] = PREBUILTPATH
        break
      case 3:
        mazeTileCpy[posX][posY + 2] = PREBUILTPATH
        mazeTileCpy[posX + 1][posY + 2] = PREBUILTPATH
        mazeTileCpy[posX + 2][posY + 2] = PREBUILTPATH
        break
    }
  }

  return mazeTileCpy
}

function selectStart(mazeTile: number[][]): [number, number] {
  let start: [number, number] | null = null
  while (start === null) {
    const x = Math.trunc((Math.random() * mazeTile.length) / 2) * 2
    const y = Math.trunc((Math.random() * mazeTile[0].length) / 2) * 2
    if (mazeTile[x]?.[y] !== INVALID) {
      start = [x, y]
    }
  }
  return start
}

const Direction = 0 | 1 | 2 | 3

function directionToPos(x: number, y: number, dir: Direction): [number, number] {
  switch (dir) {
    case 0:
      return [x + 2, y]
    case 1:
      return [x - 2, y]
    case 2:
      return [x, y + 2]
    case 3:
      return [x, y - 2]
  }
}

function directionToPosWall(x: number, y: number, dir: Direction): [number, number] {
  switch (dir) {
    case 0:
      return [x + 1, y]
    case 1:
      return [x - 1, y]
    case 2:
      return [x, y + 1]
    case 3:
      return [x, y - 1]
  }
}

export function generateMaze(mazeTile: number[][]): number[][] {
  const mazeTileCpy = copyMazeTile(mazeTile)
  const stack: [number, number][] = []
  let currTile = selectStart(mazeTileCpy)
  stack.push(currTile)
  loopTile: while (stack.length > 0) {
    let [currX, currY] = currTile

    if (mazeTileCpy[currX][currY] === PREBUILTPATH) {
      mazeTileCpy[currX][currY] = PATH
      if (mazeTileCpy[currX + 2][currY] === PREBUILTPATH) {
        mazeTileCpy[currX + 1][currY] = PATH
        currX = currX + 2
      } else if (mazeTileCpy[currX - 2][currY] === PREBUILTPATH) {
        mazeTileCpy[currX - 1][currY] = PATH
        currX = currX - 2
      } else if (mazeTileCpy[currX][currY + 2] === PREBUILTPATH) {
        mazeTileCpy[currX][currY + 1] = PATH
        currY = currY + 2
      } else if (mazeTileCpy[currX][currY - 2] === PREBUILTPATH) {
        mazeTileCpy[currX][currY - 1] = PATH
        currY = currY - 2
      }
    }

    mazeTileCpy[currX][currY] = PATH

    const directions: Direction[] = [0, 1, 2, 3]
    while (directions.length > 0) {
      const dir = directions.splice(Math.trunc(Math.random() * directions.length), 1)[0]
      const [nextX, nextY] = directionToPos(currX, currY, dir)
      if (mazeTileCpy[nextX]?.[nextY] === WALL || mazeTileCpy[nextX]?.[nextY] === PREBUILTPATH) {
        const [wallX, wallY] = directionToPosWall(currX, currY, dir)
        mazeTileCpy[wallX][wallY] = PATH
        currTile = [nextX, nextY]
        stack.push(currTile)
        continue loopTile
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    currTile = stack.pop()!
  }
  return mazeTileCpy
}
