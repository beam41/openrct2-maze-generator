# OpenRCT2 Maze Generator

Generate Maze of any size quickly*, life is too short to do it manually.

\* *Testing on Ryzen 7700x took around 1 second for 150×150 maze and 1.3 minute for 999×999 maze*

## Installation

1. Download the latest version of the plugin from
   the [Releases page](https://github.com/beam41/openrct2-maze-generator/releases/latest).
2. To install it, put the downloaded `*.js` file into your `/OpenRCT2/plugin` folder.

- Easiest way to find the OpenRCT2-folder is by launching the OpenRCT2 game, click and hold on the red toolbox in the
  main menu, and select "Open custom content folder".
- Otherwise this folder is commonly found in `C:/Users/<YOUR NAME>/Documents/OpenRCT2/plugin` on Windows.
- If you already had this plugin installed before, you can safely overwrite the old file.

3. Once the file is there, it should show up ingame in the dropdown menu under the map icon.

## Usage

0. You might want to backup first.

1. Partially build Maze with entrance and exit.

![step1](https://raw.githubusercontent.com/beam41/openrct2-maze-ganerator/main/resources/step1.png)

2. Build Perimeter around the area that you want your maze to be built, check twice for any leak.

![step2](https://raw.githubusercontent.com/beam41/openrct2-maze-ganerator/main/resources/step2.png)

3. Open maze generator menu and click generate.

4. Now you have complete maze!

![step4](https://raw.githubusercontent.com/beam41/openrct2-maze-ganerator/main/resources/step4.png)

## Thanks

- [wisnia74's Typescript Modding Template](https://github.com/wisnia74/openrct2-typescript-mod-template) - My bundler of
  choice can't bundle to es5, So I learn how to set up rollup from this template.

- [Basssiiie's FlexUI](https://github.com/Basssiiie/OpenRCT2-FlexUI) for easy to use UI library.
