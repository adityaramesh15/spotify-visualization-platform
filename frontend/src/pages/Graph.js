import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'
function RotatingBox() {
    const meshRef = React.useRef();
    {/*Updates every frame, pass in clock object for time */ }
    useFrame(({ clock }) => {
        meshRef.current.rotation.x = clock.getElapsedTime();
        meshRef.current.rotation.y = 4 * clock.getElapsedTime();
    });
    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 3, 1]} />
            <meshPhongMaterial color="green" />
        </mesh>
    );
};
const Graph = () => {
    const isTesting = true;
    return (
        <div>
            <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>
                <Canvas camera={
                    { fov: 85 }
                }>
                    {/*Toggle grid and axes*/}
                    {isTesting ? <axesHelper args={[2]} /> : null}
                    {isTesting ? <gridHelper /> : null}
                    {/*Instantiate rotating box as functional component*/}
                    <RotatingBox />
                    <OrbitControls />
                    <ambientLight intensity={0.3} />
                    <directionalLight />
                </Canvas>
            </div>
        </div>
    );
};

export default Graph;