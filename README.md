# Astro Drift

A space game built with **React**, **TypeScript**, **Vite**, and **Babylon.js**.

The player controls a spaceship, navigates through space, avoids asteroids, and interacts with friendly ships.

## Tech Stack

* React
* TypeScript
* Vite
* Babylon.js
* SCSS
* ESLint
* Prettier

## Features

* 3D spaceship movement
* Procedurally generated star field
* Asteroids with random positions, speeds, and rotation
* Friendly spaceships
* Collision detection
* Collision effects
* Score system
* Configurable game parameters

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Code Quality

Run ESLint:

```bash
npm run lint
```

Run ESLint without allowing warnings:

```bash
npm run lint:strict
```

Check formatting:

```bash
npm run format:check
```

Format the project with Prettier:

```bash
npm run format
```

## Project Structure

```text
src/
├── assets/
│   └── models/
├── components/
│   └── BabylonScene/
│       ├── constants/
│       ├── game/
│       ├── types/
│       ├── BabylonScene.tsx
│       └── BabylonScene.scss
├── App.tsx
├── App.scss
├── index.css
└── main.tsx
```

## Game Configuration

Game parameters are centralized in `GAME_CONFIG`.

This includes:

* spaceship movement
* asteroid parameters
* friendly ship parameters
* star field settings
* collision settings
* score values

Technical constants that are not game settings are kept separately in `constants`.

## License

This project is intended for educational and portfolio purposes.
