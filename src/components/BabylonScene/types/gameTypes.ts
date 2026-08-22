import type { TransformNode, Vector3 } from '@babylonjs/core';

export type FriendlyShip = {
  root: TransformNode;
  speed: number;
  direction: Vector3;
};

export type Asteroid = {
  root: TransformNode;
  speed: number;
};
