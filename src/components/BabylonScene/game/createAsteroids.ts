import { ImportMeshAsync, Scene, TransformNode, Vector3, Camera } from '@babylonjs/core';
import asteroidModel from '@/assets/models/asteroid.glb?url';
import { GAME_CONFIG } from '@/components/BabylonScene/constants/gameConfig';
import type { Asteroid } from '@/components/BabylonScene/types/gameTypes';

const getRandomValue = (min: number, max: number) => {
  return min + Math.random() * (max - min);
};

const getAsteroidPosition = (root: TransformNode, camera: Camera) => {
  const forward = camera.getForwardRay().direction.normalize();

  const right = Vector3.Cross(forward, Vector3.Up()).normalize();
  const up = Vector3.Cross(right, forward).normalize();

  const { minDistance, maxDistance, horizontalRange, verticalRange, minScale, maxScale } =
    GAME_CONFIG.asteroids;

  const distance = getRandomValue(minDistance, maxDistance);

  const horizontal = (Math.random() - 0.5) * horizontalRange;
  const vertical = (Math.random() - 0.5) * verticalRange;

  root.position = camera.position
    .add(forward.scale(distance))
    .add(right.scale(horizontal))
    .add(up.scale(vertical));

  const scale = getRandomValue(minScale, maxScale);

  root.scaling = new Vector3(scale, scale, scale);

  root.rotation = new Vector3(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI,
  );
};

export const createAsteroids = async (
  scene: Scene,
  camera: Camera,
  count: number,
): Promise<Asteroid[]> => {
  const result = await ImportMeshAsync(asteroidModel, scene);

  const sourceRoot = new TransformNode('asteroidSource', scene);

  result.meshes.forEach((mesh) => {
    if (!mesh.parent) {
      mesh.parent = sourceRoot;
    }
  });

  sourceRoot.setEnabled(false);

  const asteroids: Asteroid[] = [];

  const { minSpeed, maxSpeed } = GAME_CONFIG.asteroids;

  for (let i = 0; i < count; i += 1) {
    const asteroidRoot = new TransformNode(`asteroid-${i}`, scene);

    sourceRoot.clone(`asteroid-model-${i}`, asteroidRoot);

    getAsteroidPosition(asteroidRoot, camera);

    asteroids.push({
      root: asteroidRoot,
      speed: getRandomValue(minSpeed, maxSpeed),
    });
  }

  return asteroids;
};

export const resetAsteroid = (asteroid: Asteroid, camera: Camera) => {
  const forward = camera.getForwardRay().direction.normalize();
  const right = Vector3.Cross(forward, Vector3.Up()).normalize();
  const up = Vector3.Cross(right, forward).normalize();

  const {
    minDistance,
    maxDistance,
    horizontalRange,
    verticalRange,
    minScale,
    maxScale,
    minSpeed,
    maxSpeed,
  } = GAME_CONFIG.asteroids;

  const distance = getRandomValue(minDistance, maxDistance);
  const horizontal = (Math.random() - 0.5) * horizontalRange;
  const vertical = (Math.random() - 0.5) * verticalRange;

  asteroid.root.position = camera.position
    .add(forward.scale(distance))
    .add(right.scale(horizontal))
    .add(up.scale(vertical));

  const scale = getRandomValue(minScale, maxScale);

  asteroid.root.scaling.set(scale, scale, scale);
  asteroid.speed = getRandomValue(minSpeed, maxSpeed);
  asteroid.root.rotation = new Vector3(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI,
  );
};
