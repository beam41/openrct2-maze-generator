import { mainUI } from '@/src/ui/main'

export function main(): void {
  ui.registerMenuItem('Maze generator', () => {
    mainUI().open()
  })
}
