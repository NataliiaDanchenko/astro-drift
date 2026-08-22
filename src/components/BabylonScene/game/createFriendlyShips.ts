import {
  AnimationGroup,
  ImportMeshAsync,
  Scene,
  TransformNode,
  Vector3,
  Camera,
} from '@babylonjs/core';
import friendlyShipModel from '@/assets/models/friendlyShip.glb?url';
import type { FriendlyShip } from '@/components/BabylonScene/types/gameTypes';
import { GAME_CONFIG } from '@/components/BabylonScene/constants/gameConfig';

const stopFriendlyShipAnimations = (animationGroups: AnimationGroup[]) => {
  animationGroups.forEach((animationGroup) => {
    animationGroup.stop();
  });
};

const getRandomValue = (min: number, max: number) => {
  return min + Math.random() * (max - min);
};

const getFriendlyShipPosition = (root: TransformNode, camera: Camera) => {
  const forward = camera.getForwardRay().direction.normalize();
  const right = Vector3.Cross(forward, Vector3.Up()).normalize();
  const up = Vector3.Cross(right, forward).normalize();

  const { minDistance, maxDistance, horizontalRange, verticalRange, scale } =
    GAME_CONFIG.friendlyShips;

  const distance = getRandomValue(minDistance, maxDistance);
  const horizontal = (Math.random() - 0.5) * horizontalRange;
  const vertical = (Math.random() - 0.5) * verticalRange;

  root.position = camera.position
    .add(forward.scale(distance))
    .add(right.scale(horizontal))
    .add(up.scale(vertical));

  root.scaling.set(scale, scale, scale);

  return forward.negate();
};

export const createFriendlyShips = async (
  scene: Scene,
  camera: Camera,
  count: number,
): Promise<FriendlyShip[]> => {
  const result = await ImportMeshAsync(friendlyShipModel, scene);

  stopFriendlyShipAnimations(result.animationGroups);

  const sourceRoot = new TransformNode('friendlyShipSource', scene);
  const modelRoot = new TransformNode('friendlyShipModelRoot', scene);
  modelRoot.rotation.set(0, Math.PI, 0);

  result.meshes.forEach((mesh) => {
    if (!mesh.parent) {
      mesh.parent = modelRoot;
    }
  });

  modelRoot.parent = sourceRoot;

  sourceRoot.setEnabled(false);

  const friendlyShips: FriendlyShip[] = [];

  const { minSpeed, maxSpeed } = GAME_CONFIG.friendlyShips;

  for (let i = 0; i < count; i += 1) {
    const friendlyShipRoot = new TransformNode(`friendlyShip-${i}`, scene);

    sourceRoot.clone(`friendlyShip-model-${i}`, friendlyShipRoot);

    const direction = getFriendlyShipPosition(friendlyShipRoot, camera);

    friendlyShips.push({
      root: friendlyShipRoot,
      speed: getRandomValue(minSpeed, maxSpeed),
      direction,
    });
  }

  return friendlyShips;
};

export const resetFriendlyShip = (friendlyShip: FriendlyShip, camera: Camera) => {
  const forward = camera.getForwardRay().direction.normalize();
  const right = Vector3.Cross(forward, Vector3.Up()).normalize();
  const up = Vector3.Cross(right, forward).normalize();

  const { minDistance, maxDistance, horizontalRange, verticalRange, scale, minSpeed, maxSpeed } =
    GAME_CONFIG.friendlyShips;

  const distance = getRandomValue(minDistance, maxDistance);
  const horizontal = (Math.random() - 0.5) * horizontalRange;
  const vertical = (Math.random() - 0.5) * verticalRange;

  friendlyShip.root.position = camera.position
    .add(forward.scale(distance))
    .add(right.scale(horizontal))
    .add(up.scale(vertical));

  friendlyShip.root.scaling.set(scale, scale, scale);
  friendlyShip.root.rotation.set(0, 0, 0);
  friendlyShip.direction = forward.negate();
  friendlyShip.speed = getRandomValue(minSpeed, maxSpeed);
};
