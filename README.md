# Scratch starter project

A small Scratch-like starter project that lets you build simple programs
by snapping together blocks that control one or more cat sprites on a
stage. It is built with React, Tailwind CSS, and Webpack.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [How to run the project](#how-to-run-the-project)
- [How it works (high level)](#how-it-works-high-level)
- [How the block engine works](#how-the-block-engine-works)

## Features

- Visual block palette for Events, Motion, Looks, and Control blocks.
- Script editor where you compose a list of blocks for the selected sprite.
- Stage preview that shows one or more cat sprites moving and turning.
- Play / Stop controls to run or stop all scripts.
- Ability to add multiple sprites; each sprite can have its own script.

## Tech stack

- React 17 (`react`, `react-dom`)
- Tailwind CSS (utility-first styling, imported in `src/index.js`)
- Webpack 5 (bundling, dev server, production build)
- Babel (ESNext + JSX via `@babel/preset-env` and `@babel/preset-react`)

The bundled assets are written to the `public` directory (see `webpack.common.js`).

## Project structure

- `src/index.js` — React entry point, renders `App` into the `root` element.
- `src/App.js` — top-level component that owns:
  - the list of sprites and their position / direction;
  - the list of blocks attached to each sprite;
  - the play/stop state and the block interpreter (`runSpriteScript`).
- `src/components/Sidebar.js` — block palette on the left:
  - click or drag blocks to add them to the current sprite.
- `src/components/MidArea.js` — script editor in the middle:
  - shows the block sequence for the selected sprite;
  - lets you edit numeric/text arguments for blocks and remove blocks.
- `src/components/PreviewArea.js` — stage + sprite list on the right:
  - shows sprites on a 480×360 stage, with their current rotation;
  - lets you select sprites, add new ones, and Play/Stop the project.
- `src/components/CatSprite.js` — SVG for the cat sprite costume.

## How to run the project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm start
   ```

3. Open the app in your browser:

   - Go to `http://localhost:3000`

4. Build for production (outputs to `public/`):

   ```bash
   npm run build
   ```

## How it works (high level)

- The **sidebar** exposes block types (Events, Motion, Looks, Control).
- When you **click or drag** a block from the sidebar, it is added to the
  script of the currently selected sprite in `App` state.
- The **middle area** renders these blocks and lets you:
  - change their arguments (steps, degrees, x/y, message, seconds);
  - remove blocks from the sequence.
- The **preview area** shows all sprites on the stage and lets you:
  - select which sprite you are editing;
  - add new sprites;
  - start (`Play`) or stop (`Stop`) all scripts.

## How the block engine works

- Each sprite has:
  - `x`, `y`, and `direction` (position and rotation);
  - `initialX`, `initialY`, `initialDirection` (used when you press Play);
  - an array of `blocks` describing its script;
  - optional `say` / `think` text for speech/thought bubbles.
- When you press **Play**:
  - sprites are reset back to their initial position/direction;
  - for every sprite that has at least one block, `runSpriteScript` is
    called with the sprite’s block list.
- `runSpriteScript` walks through the blocks in order and executes them:
  - **Motion**:
    - `MOTION_MOVE_STEPS` animates the sprite forward for the given number
      of steps, updating `x`/`y` over several frames.
    - `MOTION_TURN_RIGHT` / `MOTION_TURN_LEFT` rotate the sprite gradually
      by the configured degrees.
    - `MOTION_GOTO_XY` jumps the sprite instantly to `(x, y)`.
  - **Looks**:
    - `LOOKS_SAY_FOR_SECS` shows a speech bubble for N seconds.
    - `LOOKS_THINK_FOR_SECS` shows a “thought” bubble for N seconds.
  - **Control**:
    - `CONTROL_REPEAT_ANIMATION` replays the previous blocks in the script
      over and over while the project is still playing.
- A shared `playRunIdRef` is used so that changing runs (pressing Stop or
  pressing Play again) cancels any animations from the previous run.
- Basic **collision behavior**:
  - sprites are considered to “collide” when their centers get within a
    certain radius of each other;
  - when a new collision between two sprites is detected, their block lists
    are swapped and their scripts are restarted using the new blocks.

This README is meant as a quick guide to how the project is put together
and what is happening when you interact with the UI.
