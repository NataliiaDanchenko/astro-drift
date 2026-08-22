import {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    Engine,
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    Color4,
    Color3,
} from '@babylonjs/core';

import '@babylonjs/loaders/glTF';

import { GAME_CONFIG } from '@/components/BabylonScene/constants/gameConfig';

import { createSpaceship } from '@/components/BabylonScene/game/createSpaceship';
import { createStars } from '@/components/BabylonScene/game/createStars';
import {
    createAsteroids,
    resetAsteroid,
} from '@/components/BabylonScene/game/createAsteroids';
import {
    createFriendlyShips,
    resetFriendlyShip,
} from '@/components/BabylonScene/game/createFriendlyShips';
import { setupSpaceshipControls } from '@/components/BabylonScene/game/controlSpaceship';
import { checkSpaceshipCollision } from '@/components/BabylonScene/game/collision';
import { createCollisionEffect } from '@/components/BabylonScene/game/collisionEffect';
import { Score } from '@/components/BabylonScene/ui/score';

import { MILLISECONDS_TO_SECONDS } from './constants/timeConversion';

import './BabylonScene.scss';

const BabylonScene = () => {
    const [score, setScore] = useState(0); 

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const engine = new Engine(canvas, true);

        const scene = new Scene(engine);

        scene.clearColor = Color4.FromHexString(
            GAME_CONFIG.scene.backgroundColor,
        );

        const {
            alpha,
            beta,
            radius,
        } = GAME_CONFIG.camera;

        const camera = new ArcRotateCamera(
            'camera',
            alpha,
            beta,
            radius,
            Vector3.Zero(),
            scene,
        );

        camera.attachControl(canvas, false);
        camera.inputs.clear();

        const { direction } = GAME_CONFIG.light;

        new HemisphericLight(
            'light',
            new Vector3(
                direction.x,
                direction.y,
                direction.z,
            ),
            scene,
        );

        const starSystem = createStars(
            scene,
            camera,
        );

        let spaceshipRoot:
            Awaited<
                ReturnType<typeof createSpaceship>
            > | null = null;

        let spaceshipControls:
            ReturnType<
                typeof setupSpaceshipControls
            > | null = null;

        let asteroids:
            Awaited<
                ReturnType<typeof createAsteroids>
            > = [];

        let friendlyShips:
            Awaited<
                ReturnType<typeof createFriendlyShips>
            > = [];

        createSpaceship(scene).then((root) => {
            spaceshipRoot = root;

            spaceshipControls =
                setupSpaceshipControls(root);
        });

        createAsteroids(
            scene,
            camera,
            GAME_CONFIG.asteroids.count,
        ).then((result) => {
            asteroids = result;
        });

        createFriendlyShips(
            scene,
            camera,
            GAME_CONFIG.friendlyShips.count,
        ).then((result) => {
            friendlyShips = result;
        });

        engine.runRenderLoop(() => {
            const deltaTime =
                engine.getDeltaTime();

            const delta =
                deltaTime *
                MILLISECONDS_TO_SECONDS;

            if (spaceshipControls) {
                spaceshipControls.update(
                    deltaTime,
                );
            }

            const forward =
                camera
                    .getForwardRay()
                    .direction
                    .normalize();

            const {
                rotationSpeed,
                movement,
            } = GAME_CONFIG.asteroids;

            asteroids.forEach((asteroid) => {
                asteroid.root.position.subtractInPlace(
                    forward.scale(
                        asteroid.speed *
                            delta *
                            movement.speedFrameMultiplier,
                    ),
                );

                asteroid.root.rotation.x +=
                    rotationSpeed.x;

                asteroid.root.rotation.y +=
                    rotationSpeed.y;

                asteroid.root.rotation.z +=
                    rotationSpeed.z;

                if (
                    spaceshipRoot &&
                    checkSpaceshipCollision(
                        spaceshipRoot,
                        asteroid.root,
                    )
                ) {
                    createCollisionEffect(
                        scene,
                        asteroid.root.position,
                        Color3.FromHexString(
                            GAME_CONFIG.collision
                                .asteroidEffectColor,
                        ),
                    );

                    setScore((currentScore) => // ИЗМЕНЕНО
                        currentScore +
                        GAME_CONFIG.score.asteroid,
                    );

                    resetAsteroid(
                        asteroid,
                        camera,
                    );

                    return;
                }

                const toAsteroid =
                    asteroid.root.position.subtract(
                        camera.position,
                    );

                const depth =
                    Vector3.Dot(
                        toAsteroid,
                        forward,
                    );

                if (
                    depth <
                    GAME_CONFIG.asteroids.resetDepth
                ) {
                    resetAsteroid(
                        asteroid,
                        camera,
                    );
                }
            });

            friendlyShips.forEach(
                (friendlyShip) => {
                    friendlyShip.root.position.addInPlace(
                        friendlyShip.direction.scale(
                            friendlyShip.speed *
                                delta *
                                GAME_CONFIG
                                    .friendlyShips
                                    .movement
                                    .speedFrameMultiplier,
                        ),
                    );

                    if (
                        spaceshipRoot &&
                        checkSpaceshipCollision(
                            spaceshipRoot,
                            friendlyShip.root,
                        )
                    ) {
                        createCollisionEffect(
                            scene,
                            friendlyShip.root.position,
                            Color3.FromHexString(
                                GAME_CONFIG
                                    .collision
                                    .friendlyShipEffectColor,
                            ),
                        );

                        setScore((currentScore) => 
                            currentScore +
                            GAME_CONFIG.score
                                .friendlyShip,
                        );

                        resetFriendlyShip(
                            friendlyShip,
                            camera,
                        );

                        return;
                    }

                    const toFriendlyShip =
                        friendlyShip.root.position.subtract(
                            camera.position,
                        );

                    const depth =
                        Vector3.Dot(
                            toFriendlyShip,
                            forward,
                        );

                    if (
                        depth <
                        GAME_CONFIG
                            .friendlyShips
                            .resetDepth
                    ) {
                        resetFriendlyShip(
                            friendlyShip,
                            camera,
                        );
                    }
                },
            );

            starSystem.setParticles();

            scene.render();
        });

        const handleResize = () => {
            engine.resize();

            camera.rebuildAnglesAndRadius();
        };

        window.addEventListener(
            'resize',
            handleResize,
        );

        return () => {
            window.removeEventListener(
                'resize',
                handleResize,
            );

            spaceshipControls?.dispose();

            scene.dispose();
            engine.dispose();
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className='babylon-scene'
            />

            <Score score={score} /> 
        </>
    );
};

export default BabylonScene;

