import { window, WindowTemplate, store, spinner, twoway, button } from 'openrct2-flexui'

export function mainUI(): WindowTemplate {
  const xCoord = twoway(store(126))
  const yCoord = twoway(store(75))
  const zCoord = twoway(store(7))
  const generateMaze = () => {
    const ride = map.rides.filter((v) => v.object.name === 'Maze')[0]
    const tile = map.getTile(xCoord.twoway.get(), yCoord.twoway.get())
    const ele = tile.getElement(1) as TrackElement
    let entry = 0
    for (let i = 0; i <= 16; i++) {
      console.log(entry)
      context.executeAction(
        'mazeplacetrack',
        {
          x: xCoord.twoway.get() * 32,
          y: (yCoord.twoway.get() - 1 - i * 2) * 32,
          z: zCoord.twoway.get() * 16,
          ride: ride?.id,
          mazeEntry: entry,
        },
        (result) => {
          if (result.errorTitle) console.log(result.errorTitle, result.errorMessage)
        }
      )
      entry += 1 << i
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
      spinner({
        minimum: 0,
        value: xCoord,
        step: 1,
      }),
      spinner({
        minimum: 0,
        value: yCoord,
        step: 1,
      }),
      spinner({
        minimum: 0,
        value: zCoord,
        step: 1,
      }),
      button({
        text: 'gen',
        onClick: generateMaze,
      }),
    ],
  })
}
