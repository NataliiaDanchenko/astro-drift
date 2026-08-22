import { Scene, Vector3, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { GAME_CONFIG } from '@/components/BabylonScene/constants/gameConfig';

export const createCollisionEffect = (scene: Scene, position: Vector3, color: Color3) => {
  const effect = MeshBuilder.CreateSphere(
    'collision-effect',
    {
      diameter: GAME_CONFIG.collisionEffect.diameter,
      segments: GAME_CONFIG.collisionEffect.segments,
    },
    scene,
  );

  effect.position = position.clone();

  const material = new StandardMaterial('collision-effect-material', scene);

  material.diffuseColor = color;
  material.emissiveColor = color;
  material.alpha = GAME_CONFIG.collisionEffect.startAlpha;

  effect.material = material;

  let progress = 0;

  const observer = scene.onBeforeRenderObservable.add(() => {
    const delta = scene.getEngine().getDeltaTime() * 0.001;

    progress += delta / GAME_CONFIG.collisionEffect.duration;

    const scale =
      GAME_CONFIG.collisionEffect.startScale +
      progress * (GAME_CONFIG.collisionEffect.endScale - GAME_CONFIG.collisionEffect.startScale);

    effect.scaling.set(scale, scale, scale);

    material.alpha = Math.max(
      GAME_CONFIG.collisionEffect.endAlpha,

      GAME_CONFIG.collisionEffect.startAlpha -
        progress * (GAME_CONFIG.collisionEffect.startAlpha - GAME_CONFIG.collisionEffect.endAlpha),
    );

    if (progress >= 1) {
      scene.onBeforeRenderObservable.remove(observer);

      effect.dispose();
      material.dispose();
    }
  });
};
