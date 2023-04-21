import { INVALID, PATH, PREBUILTPATH, WALL } from '@/src/core/reference'
import { getMazeTileConnectedToGate } from '@/src/core/generate'

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
    tileMap[1][0] |
    (tileMap[0][1] << 1) |
    (tileMap[1][2] << 2) |
    (tileMap[1][1] << 3) |
    (tileMap[0][3] << 4) |
    (tileMap[1][4] << 5) |
    (tileMap[2][3] << 6) |
    (tileMap[1][3] << 7) |
    (tileMap[3][4] << 8) |
    (tileMap[4][3] << 9) |
    (tileMap[3][2] << 10) |
    (tileMap[3][3] << 11) |
    (tileMap[4][1] << 12) |
    (tileMap[3][0] << 13) |
    (tileMap[2][1] << 14) |
    (tileMap[3][1] << 15)
  )
}

export function prefillTileAfterGate(
  mazeTile: number[][],
  minX: number,
  minY: number,
  coords: CoordsXYZD[],
) {
  for (const coord of coords) {
    const mazeCoord = getMazeTileConnectedToGate(coord)
    const posX = (mazeCoord.x / 32 - minX) * 4
    const posY = (mazeCoord.y / 32 - minY) * 4
    switch (coord.direction) {
      case 0:
        mazeTile[posX + 2][posY] = PREBUILTPATH
        mazeTile[posX + 2][posY + 1] = PREBUILTPATH
        mazeTile[posX + 2][posY + 2] = PREBUILTPATH
        break
      case 1:
        mazeTile[posX][posY] = PREBUILTPATH
        mazeTile[posX + 1][posY] = PREBUILTPATH
        mazeTile[posX + 2][posY] = PREBUILTPATH
        break
      case 2:
        mazeTile[posX][posY] = PREBUILTPATH
        mazeTile[posX][posY + 1] = PREBUILTPATH
        mazeTile[posX][posY + 2] = PREBUILTPATH
        break
      case 3:
        mazeTile[posX][posY + 2] = PREBUILTPATH
        mazeTile[posX + 1][posY + 2] = PREBUILTPATH
        mazeTile[posX + 2][posY + 2] = PREBUILTPATH
        break
    }
  }
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

export function generateMaze(mazeTile: number[][]) {
  const stack: [number, number][] = []
  let currTile = selectStart(mazeTile)
  stack.push(currTile)
  while (stack.length > 0) {
    let [currX, currY] = currTile

    if (mazeTile[currX][currY] === PREBUILTPATH) {
      mazeTile[currX][currY] = PATH
      if (mazeTile[currX + 2]?.[currY] === PREBUILTPATH) {
        mazeTile[currX + 1][currY] = PATH
        currX = currX + 2
      } else if (mazeTile[currX - 2]?.[currY] === PREBUILTPATH) {
        mazeTile[currX - 1][currY] = PATH
        currX = currX - 2
      } else if (mazeTile[currX]?.[currY + 2] === PREBUILTPATH) {
        mazeTile[currX][currY + 1] = PATH
        currY = currY + 2
      } else if (mazeTile[currX]?.[currY - 2] === PREBUILTPATH) {
        mazeTile[currX][currY - 1] = PATH
        currY = currY - 2
      }
    }

    mazeTile[currX][currY] = PATH

    const validNext: [number, number, Direction][] = []
    for (let dir = 0; dir <= 3; dir++) {
      let nextX: number, nextY: number
      switch (dir as Direction) {
        case 0:
          nextX = currX + 2
          nextY = currY
          break
        case 1:
          nextX = currX - 2
          nextY = currY
          break
        case 2:
          nextX = currX
          nextY = currY + 2
          break
        case 3:
          nextX = currX
          nextY = currY - 2
          break
      }
      if (mazeTile[nextX]?.[nextY] === WALL || mazeTile[nextX]?.[nextY] === PREBUILTPATH) {
        validNext.push([nextX, nextY, dir as Direction])
      }
    }

    if (validNext.length > 0) {
      const [nextX, nextY, dir] = validNext[Math.trunc(Math.random() * validNext.length)]
      let wallX: number, wallY: number
      switch (dir) {
        case 0:
          wallX = currX + 1
          wallY = currY
          break
        case 1:
          wallX = currX - 1
          wallY = currY
          break
        case 2:
          wallX = currX
          wallY = currY + 1
          break
        case 3:
          wallX = currX
          wallY = currY - 1
          break
      }
      mazeTile[wallX][wallY] = PATH
      currTile = [nextX, nextY]
      stack.push(currTile)
      continue
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    currTile = stack.pop()!
  }
}

export function removeWallNextToGate(
  fullTile: number[][],
  minX: number,
  minY: number,
  coords: CoordsXYZD[],
) {
  for (const coord of coords) {
    const mazeCoord = getMazeTileConnectedToGate(coord)
    const posX = mazeCoord.x / 32 - minX
    const posY = mazeCoord.y / 32 - minY
    switch (coord.direction) {
      case 0:
        fullTile[posX][posY] ^= (1 << 9) | (1 << 12)
        break
      case 1:
        fullTile[posX][posY] ^= 1 | (1 << 13)
        break
      case 2:
        fullTile[posX][posY] ^= (1 << 1) | (1 << 4)
        break
      case 3:
        fullTile[posX][posY] ^= (1 << 5) | (1 << 8)
        break
    }
  }
  return fullTile
}
