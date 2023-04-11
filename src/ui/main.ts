import { window, WindowTemplate, button } from 'openrct2-flexui'
import {
  getAllValidTile,
  getMazeTileConnectedToGate,
  validTileToMazeGenTile,
} from '@/src/core/generate'
import { generateMaze, prefillTileAfterGate } from '@/src/core/maze'
import { buildNewMaze, cleanOldMaze, convertToFullTile, restoreMaze } from '@/src/core/build'

export function mainUI(): WindowTemplate {
  const genMazeOnCLick = () => {
    const ride = map.rides.filter((v) => v.object.name === 'Maze')[0]
    const cleanedMazeTile = cleanOldMaze(ride.id)
    const [valid, minX, minY] = getAllValidTile(
      getMazeTileConnectedToGate(ride.stations[0].entrance),
      ride?.id,
    )
    let mazeTile = validTileToMazeGenTile(valid)
    mazeTile = prefillTileAfterGate(
      mazeTile,
      minX,
      minY,
      ride.stations[0].entrance,
      ride.stations[0].exit,
    )
    for (const x of mazeTile) {
      const str = x.join(' ')
      console.log(str)
    }
    mazeTile = generateMaze(mazeTile)
    const fullTile = convertToFullTile(mazeTile)
    const testPass = buildNewMaze(
      ride.id,
      fullTile,
      minX,
      minY,
      ride.stations[0].entrance.z,
      true,
      cleanedMazeTile,
    )
    if (testPass) {
      buildNewMaze(
        ride.id,
        fullTile,
        minX,
        minY,
        ride.stations[0].entrance.z,
        false,
        cleanedMazeTile,
      )
    } else {
      restoreMaze(ride.id, ride.stations[0].entrance.z, cleanedMazeTile)
    }
  }

  return window({
    title: 'Maze Generator',
    width: 475,
    height: 250,
    minWidth: 400,
    minHeight: 200,
    maxWidth: 550,
    maxHeight: 500,
    padding: 5,
    content: [
      button({
        text: 'gen',
        onClick: genMazeOnCLick,
      }),
    ],
  })
}
