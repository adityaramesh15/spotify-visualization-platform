import React from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stats, OrbitControls, PointsBuffer } from '@react-three/drei'
import { TextureLoader } from 'three';
function Map() {
    const meshRef = React.useRef();
    const [testDisplacementMap, testColorMap] = useLoader(TextureLoader, ['/textures/noiseTexture.png', '/textures/noiseTexture.png']);
    useFrame(({ clock }) => {
        //meshRef.current.rotation.y = clock.getElapsedTime();
    });
    return (
        <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10, 64, 64]} />
            <meshStandardMaterial v
                wireframe={false}
                flatShading={true}
                //map={testColorMap}
                color="white"
                displacementMap={testDisplacementMap}
                displacementScale={2.5}
                displacementBias={0.5} />
        </mesh>
    );
};
function PointLight() {
    const pointLightRef = React.useRef();
    var t = 0;
    useFrame(({ clock }) => {
        t += 0.005;
        pointLightRef.current.position.x = 2 * Math.cos(t) + 0;
        pointLightRef.current.position.z = 2 * Math.sin(t) + 0;
    });
    return (
        <pointLight
            ref={pointLightRef}
            intensity={10.0}
            visible={true}
            position={[0.0, 3.0, 0.0]}
            castShadow={true}
        />
    )
}
const Graph = () => {
    const isTesting = true;
    return (
        <div>
            <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>
                <Canvas camera={
                    { fov: 85 }
                } shadows>
                    {/*Toggle grid and axes*/}
                    {isTesting ? <axesHelper args={[2]} /> : null}
                    {isTesting ? <gridHelper /> : null}
                    {/*Instantiate rotating box as functional component*/}
                    <Map />
                    <PointLight />
                    <OrbitControls
                        enablePan={false}
                        enableDamping={true}
                        dampingFactor={0.035}
                        maxPolarAngle={Math.PI / 2}
                        minPolarAngle={-Math.PI / 4}
                    />
                    <Stats />
                </Canvas>
            </div>
        </div>
    );
};

export default Graph;