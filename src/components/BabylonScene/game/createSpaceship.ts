import { ImportMeshAsync, Scene, TransformNode, Vector3 } from '@babylonjs/core';
import spaceshipModel from '@/assets/models/spaceship/source/Spaceship.glb?url';
import { GAME_CONFIG } from '@/components/BabylonScene/constants/gameConfig';

export const createSpaceship = async (scene: Scene) => {
  const spaceshipRoot = new TransformNode('spaceshipRoot', scene);

  const scale = GAME_CONFIG.spaceship.scale;

  spaceshipRoot.scaling = new Vector3(scale, scale, scale);
  spaceshipRoot.rotation = new Vector3(0, GAME_CONFIG.spaceship.rotationY, 0);

  const result = await ImportMeshAsync(spaceshipModel, scene);

  result.meshes.forEach((mesh) => {
    if (!mesh.parent) {
      mesh.parent = spaceshipRoot;
    }
  });

  result.animationGroups.forEach((animationGroup) => {
    animationGroup.play(true);
  });

  return spaceshipRoot;
};
