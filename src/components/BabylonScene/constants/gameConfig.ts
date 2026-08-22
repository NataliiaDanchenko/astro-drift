export const GAME_CONFIG = {
  scene: {
    backgroundColor: '#000000ff',
  },

  camera: {
    alpha: Math.PI / 2,
    beta: Math.PI / 3,
    radius: 10,
  },

  light: {
    direction: {
      x: 0,
      y: 1,
      z: 0,
    },
  },

  spaceship: {
    scale: 0.7,

    rotationY: Math.PI / 2,

    movement: {
      speed: 8,

      limitX: 6,
      limitY: 4,

      rotationZ: 0.18,
      rotationX: 0.12,

      rotationSmoothness: 8,
    },
  },

  asteroids: {
    count: 10,

    minSpeed: 0.35,
    maxSpeed: 0.7,

    minDistance: 100,
    maxDistance: 180,

    horizontalRange: 40,
    verticalRange: 25,

    minScale: 1.2,
    maxScale: 2.5,

    resetDepth: -5,

    rotationSpeed: {
      x: 0.003,
      y: 0.004,
      z: 0.002,
    },

    movement: {
      speedFrameMultiplier: 60,
    },
  },

  friendlyShips: {
    count: 5,

    minSpeed: 0.45,
    maxSpeed: 0.7,

    minDistance: 100,
    maxDistance: 160,

    horizontalRange: 15,
    verticalRange: 10,

    scale: 0.5,

    resetDepth: -10,

    movement: {
      speedFrameMultiplier: 60,
    },
  },

  score: {
    friendlyShip: 10,
    asteroid: -10,
    win: 500,
  },

  collision: {
    boundingSphereScale: 0.65,

    asteroidEffectColor: '#ff0000',
    friendlyShipEffectColor: '#00ff00',
  },

  collisionEffect: {
    diameter: 0.8,
    segments: 16,

    duration: 0.35,

    startScale: 0.2,
    endScale: 3,

    startAlpha: 0.9,
    endAlpha: 0,
  },

  stars: {
    count: 1500,

    diameter: 0.08,
    segments: 4,

    minDistance: 60,
    maxDistance: 160,

    horizontalRange: 120,
    verticalRange: 80,

    minScale: 0.5,
    maxScale: 2,

    speed: 0.5,

    resetDepth: 1,

    colors: [
      {
        threshold: 0.7,
        color: '#ffffff',
      },
      {
        threshold: 0.8,
        color: '#dbeeff',
      },
      {
        threshold: 0.87,
        color: '#ebe0ff',
      },
      {
        threshold: 0.92,
        color: '#ffe8f0',
      },
      {
        threshold: 0.97,
        color: '#fff5de',
      },
      {
        threshold: 1,
        color: '#d1f0ff',
      },
    ],
  },
} as const;
