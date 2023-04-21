import { mainUI } from '@/src/ui/main'

// const timers: Record<string, number> = {}
//
// console.time = function (name?: string) {
//   if (name) {
//     timers[name] = performance.now()
//   }
// }
//
// console.timeEnd = function (name?: string) {
//   if (name && timers[name]) {
//     const end = performance.now() - timers[name]
//     const mill = Math.round((end % 1000) * 1000) / 1000
//     const secc = Math.trunc((end / 1000) % 60)
//     const minn = Math.trunc((end / (60 * 1000)) % 60)
//     const hour = Math.trunc(end / (60 * 60 * 1000))
//     let tStr = ''
//     if (hour) {
//       tStr += `${hour}h`
//     }
//     if (minn) {
//       if (tStr) tStr += ' '
//       tStr += `${minn}m`
//     }
//     if (secc) {
//       if (tStr) tStr += ' '
//       tStr += `${secc}s`
//     }
//     if (mill) {
//       if (tStr) tStr += ' '
//       tStr += `${mill}ms`
//     }
//     console.log(`${name}: ${tStr}`)
//     delete timers[name]
//   }
// }

export function main(): void {
  ui.registerMenuItem('Maze generator', () => {
    mainUI().open()
  })
}
