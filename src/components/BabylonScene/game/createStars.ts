import {
  Camera,
  Color4,
  MeshBuilder,
  Scene,
  SolidParticle,
  SolidParticleSystem,
  Vector3,
} from '@babylonjs/core';
import { GAME_CONFIG } from '@/components/BabylonScene/constants/gameConfig';

const getStarColor = () => {
  const random = Math.random();
  const starColor = GAME_CONFIG.stars.colors.find(({ threshold }) => random < threshold);
  return Color4.FromHexString(starColor?.color ?? GAME_CONFIG.stars.colors.at(-1)!.color);
};

export const createStars = (scene: Scene, camera: Camera) => {
  const config = GAME_CONFIG.stars;
  const starSystem = new SolidParticleSystem('stars', scene, {
    updatable: true,
  });

  const star = MeshBuilder.CreateSphere(
    'star',
    {
      diameter: config.diameter,
      segments: config.segments,
    },
    scene,
  );

  starSystem.addShape(star, config.count);
  star.dispose();

  const createStar = (particle: SolidParticle) => {
    const forward = camera.getForwardRay().direction.normalize();
    const right = Vector3.Cross(forward, Vector3.Up()).normalize();
    const up = Vector3.Cross(right, forward).normalize();
    const distance = config.minDistance + Math.random() * (config.maxDistance - config.minDistance);
    const horizontal = (Math.random() - 0.5) * config.horizontalRange;
    const vertical = (Math.random() - 0.5) * config.verticalRange;

    particle.position = camera.position
      .add(forward.scale(distance))
      .add(right.scale(horizontal))
      .add(up.scale(vertical));

    const scale = config.minScale + Math.random() * (config.maxScale - config.minScale);

    particle.scaling.x = scale;
    particle.scaling.y = scale;
    particle.scaling.z = scale;
    particle.color = getStarColor();
  };

  starSystem.initParticles = () => {
    for (let i = 0; i < starSystem.nbParticles; i += 1) {
      createStar(starSystem.particles[i]);
    }
  };

  starSystem.updateParticle = (particle) => {
    const forward = camera.getForwardRay().direction.normalize();
    particle.position.subtractInPlace(forward.scale(config.speed));
    const toStar = particle.position.subtract(camera.position);
    const depth = Vector3.Dot(toStar, forward);

    if (depth < GAME_CONFIG.stars.resetDepth) {
      createStar(particle);
    }
    return particle;
  };

  starSystem.initParticles();
  starSystem.setParticles();
  starSystem.buildMesh();

  return starSystem;
};
