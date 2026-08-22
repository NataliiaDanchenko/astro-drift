import { TransformNode } from '@babylonjs/core';
import { GAME_CONFIG } from '@/components/BabylonScene/constants/gameConfig';
import { SPACESHIP_KEYS } from '@/components/BabylonScene/constants/controls';
import { MILLISECONDS_TO_SECONDS } from '../constants/timeConversion';

export const setupSpaceshipControls = (spaceshipRoot: TransformNode) => {
  const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    if (SPACESHIP_KEYS.left.includes(key)) {
      keys.left = true;
    }

    if (SPACESHIP_KEYS.right.includes(key)) {
      keys.right = true;
    }

    if (SPACESHIP_KEYS.up.includes(key)) {
      keys.up = true;
    }

    if (SPACESHIP_KEYS.down.includes(key)) {
      keys.down = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    if (SPACESHIP_KEYS.left.includes(key)) {
      keys.left = false;
    }

    if (SPACESHIP_KEYS.right.includes(key)) {
      keys.right = false;
    }

    if (SPACESHIP_KEYS.up.includes(key)) {
      keys.up = false;
    }

    if (SPACESHIP_KEYS.down.includes(key)) {
      keys.down = false;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  const update = (deltaTime: number) => {
    const delta = deltaTime * MILLISECONDS_TO_SECONDS;

    const { speed, limitX, limitY, rotationZ, rotationX, rotationSmoothness } =
      GAME_CONFIG.spaceship.movement;

    if (keys.left) {
      spaceshipRoot.position.x += speed * delta;
    }

    if (keys.right) {
      spaceshipRoot.position.x -= speed * delta;
    }

    if (keys.up) {
      spaceshipRoot.position.y += speed * delta;
    }

    if (keys.down) {
      spaceshipRoot.position.y -= speed * delta;
    }

    spaceshipRoot.position.x = Math.max(-limitX, Math.min(limitX, spaceshipRoot.position.x));
    spaceshipRoot.position.y = Math.max(-limitY, Math.min(limitY, spaceshipRoot.position.y));

    const targetRotationZ = keys.left ? -rotationZ : keys.right ? rotationZ : 0;
    const targetRotationX = keys.up ? -rotationX : keys.down ? rotationX : 0;

    spaceshipRoot.rotation.z +=
      (targetRotationZ - spaceshipRoot.rotation.z) * rotationSmoothness * delta;
    spaceshipRoot.rotation.x +=
      (targetRotationX - spaceshipRoot.rotation.x) * rotationSmoothness * delta;
  };

  const dispose = () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };

  return {
    update,
    dispose,
  };
};
