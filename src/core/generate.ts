import { WALL, INVALID } from '@/src/core/reference'

export function genMatrix<T>(xSize: number, ySize: number, initialValue: T): T[][] {
  const matX = Array<T[]>(xSize)
  for (let i = 0; i < xSize; i++) {
    const matY = Array<T>(ySize)
    for (let j = 0; j < ySize; j++) {
      matY[j] = initialValue
    }
    matX[i] = matY
  }
  return matX
}

export function copyMatrix<T>(matrix: T[][]): T[][] {
  return matrix.map((arr) => arr.slice())
}

export function validTileToMazeGenTile(validTile: boolean[][]): number[][] {
  const mazeTile = genMatrix(validTile.length * 4 - 1, validTile[0].length * 4 - 1, WALL)
  for (let x = 0; x < validTile.length; x++) {
    for (let y = 0; y < validTile[0].length; y++) {
      if (!validTile[x][y]) {
        for (
          let xx = Math.max(x * 4 - 1, 0);
          xx <= Math.min(x * 4 + 3, mazeTile.length - 1);
          xx++
        ) {
          for (
            let yy = Math.max(y * 4 - 1, 0);
            yy <= Math.min(y * 4 + 3, mazeTile[0].length - 1);
            yy++
          ) {
            mazeTile[xx][yy] = INVALID
          }
        }
      }
    }
  }
  return mazeTile
}

export function getMazeTileConnectedToGate(gateCoords: CoordsXYZD): CoordsXYZ {
  switch (gateCoords.direction) {
    case 0:
      return {
        x: gateCoords.x - 32,
        y: gateCoords.y,
        z: gateCoords.z,
      }
    case 1:
      return {
        x: gateCoords.x,
        y: gateCoords.y + 32,
        z: gateCoords.z,
      }
    case 2:
      return {
        x: gateCoords.x + 32,
        y: gateCoords.y,
        z: gateCoords.z,
      }
    case 3:
      return {
        x: gateCoords.x,
        y: gateCoords.y - 32,
        z: gateCoords.z,
      }
  }
}

function checkValidTile(x: number, y: number, z: number, rideId: number): boolean {
  let valid = true
  context.queryAction(
    'mazeplacetrack',
    {
      x: x,
      y: y,
      z: z,
      ride: rideId,
      mazeEntry: 0,
    },
    (result) => {
      if (result.error) valid = false
    },
  )
  return valid
}

export function getAllValidTile(
  startTile: CoordsXYZ,
  rideId: number,
): [boolean[][], number, number] {
  const visited: boolean[][] = genMatrix(map.size.x, map.size.y, false)
  const valid: boolean[][] = genMatrix(map.size.x, map.size.y, false)

  let validMinX = Infinity
  let validMaxX = 0
  let validMinY = Infinity
  let validMaxY = 0
  let first = true
  const stack: [number, number][] = []
  stack.push([startTile.x / 32, startTile.y / 32])
  while (stack.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [x, y] = stack.pop()!

    if (visited[x][y]) continue
    visited[x][y] = true

    if (!first && !checkValidTile(x * 32, y * 32, startTile.z, rideId)) continue
    valid[x][y] = true
    validMinX = Math.min(validMinX, x)
    validMaxX = Math.max(validMaxX, x)
    validMinY = Math.min(validMinY, y)
    validMaxY = Math.max(validMaxY, y)
    first = false

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }
  const newValid = valid
    .slice(validMinX, validMaxX + 1)
    .map((arr) => arr.slice(validMinY, validMaxY + 1))
  return [newValid, validMinX, validMinY]
}
