import { TransformNode, Vector3 } from '@babylonjs/core';
import { GAME_CONFIG } from '@/components/BabylonScene/constants/gameConfig';

const getBoundingSphere = (root: TransformNode) => {
  const bounds = root.getHierarchyBoundingVectors();

  const center = bounds.min.add(bounds.max).scale(0.5);
  const size = bounds.max.subtract(bounds.min);

  const radius = size.length() * 0.5;

  return {
    center,
    radius,
  };
};

export const checkSpaceshipCollision = (
  spaceshipRoot: TransformNode,
  obstacleRoot: TransformNode,
) => {
  const spaceship = getBoundingSphere(spaceshipRoot);

  const obstacle = getBoundingSphere(obstacleRoot);

  const distance = Vector3.Distance(spaceship.center, obstacle.center);

  const collisionDistance =
    (spaceship.radius + obstacle.radius) * GAME_CONFIG.collision.boundingSphereScale;

  return distance <= collisionDistance;
};
