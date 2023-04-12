import { genMatrix } from '@/src/core/generate'
import { INVALID, PATH } from '@/src/core/reference'
import { tileMapToMazeEntry } from '@/src/core/maze'

const fill = [1, 1, 1, 1, 1]

export function convertToFullTile(mazeTile: number[][]) {
  const fullTile = genMatrix((mazeTile.length + 1) / 4, (mazeTile[0].length + 1) / 4, -1)
  for (let x = 0; x < mazeTile.length; x += 4) {
    for (let y = 0; y < mazeTile[x].length; y += 4) {
      if (mazeTile[x][y] === INVALID) {
        fullTile[x / 4][y / 4] = -1
        continue
      }
      const tileMap = []
      let ixx = -1
      let xxMax = 3
      let iyy = -1
      let yyMax = 3
      if (x === 0) {
        tileMap.push(fill)
        ixx = 0
      }
      if (x + 3 === mazeTile.length) {
        xxMax = 2
      }
      if (y === 0) {
        iyy = 0
      }
      if (y + 3 === mazeTile[x].length) {
        yyMax = 2
      }
      for (let xx = ixx; xx <= xxMax; xx++) {
        const row = []
        if (y === 0) {
          row.push(1)
        }
        for (let yy = iyy; yy <= yyMax; yy++) {
          row.push(mazeTile[x + xx][y + yy] === PATH ? 0 : 1)
        }
        if (y + 3 === mazeTile[x].length) {
          row.push(1)
        }
        tileMap.push(row)
      }

      if (x + 3 === mazeTile.length) tileMap.push(fill)

      const mazeEntry = tileMapToMazeEntry(tileMap)
      fullTile[x / 4][y / 4] = mazeEntry
    }
  }
  return fullTile
}

export function cleanOldMaze(rideId: number): { [x: number]: { [y: number]: number } } {
  const removedTile: { [x: number]: { [y: number]: number } } = {}
  for (let x = 0; x < map.size.x; x++) {
    for (let y = 0; y < map.size.y; y++) {
      const tileEles = map.getTile(x, y).elements
      for (let i = 0; i < tileEles.length; i++) {
        const ele = tileEles[i]
        if (ele.type === 'track' && ele.mazeEntry !== null && ele.ride === rideId) {
          map.getTile(x, y).removeElement(i)
          if (removedTile[x]) {
            removedTile[x][y] = ele.mazeEntry
          } else {
            removedTile[x] = { [y]: ele.mazeEntry }
          }
        }
      }
    }
  }
  return removedTile
}

function executeMazePlace(
  rideId: number,
  x: number,
  y: number,
  rideZ: number,
  mazeEntry: number,
  test: boolean,
  free: boolean,
): [boolean, number, string] {
  const args = {
    x: x * 32,
    y: y * 32,
    z: rideZ,
    ride: rideId,
    mazeEntry: mazeEntry,
  }
  let pass = true
  let cost = 0
  let errMsg = ''
  if (test) {
    context.queryAction('mazeplacetrack', args, (result) => {
      if (result.error) {
        pass = false
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        errMsg = result.errorMessage!
      }
      if (result.cost) {
        cost = result.cost
      }
    })
  } else {
    context.executeAction('mazeplacetrack', args, (result) => {
      if (result.error) {
        pass = false
      }
      if (result.cost && free) {
        park.cash += result.cost
      }
    })
  }

  return [pass, cost, errMsg]
}

export function buildNewMaze(
  rideId: number,
  fullTile: number[][],
  startX: number,
  startY: number,
  rideZ: number,
  cleanedMazeTile: { [x: number]: { [y: number]: number } },
  test: boolean,
): [boolean, boolean, boolean, string] {
  let sumCost = 0
  for (let x = 0; x < fullTile.length; x++) {
    for (let y = 0; y < fullTile[0].length; y++) {
      if (fullTile[x][y] !== -1) {
        const [pass, cost, errMsg] = executeMazePlace(
          rideId,
          startX + x,
          startY + y,
          rideZ,
          fullTile[x][y],
          test,
          !!cleanedMazeTile[startX + x]?.[startY + y],
        )
        if (!pass) {
          return [false, false, true, errMsg]
        }
        sumCost += cost
      }
    }
  }
  return [
    !(test && !park.getFlag('noMoney') && park.cash < sumCost),
    park.cash < sumCost,
    false,
    '',
  ]
}

export function restoreMaze(
  rideId: number,
  rideZ: number,
  cleanedMazeTile: { [x: number]: { [y: number]: number } },
) {
  for (const x of Object.keys(cleanedMazeTile) as any as number[]) {
    for (const y of Object.keys(cleanedMazeTile[x]) as any as number[]) {
      executeMazePlace(rideId, x, y, rideZ, cleanedMazeTile[x][y], false, true)
    }
  }
}
