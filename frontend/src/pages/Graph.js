import React, { useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stats, OrbitControls, Html } from '@react-three/drei'
import { TextureLoader } from 'three';
function Map() {
    const meshRef = React.useRef();
    const [testDisplacementMap, testColorMap] = useLoader(TextureLoader, ['/textures/noiseTexture.png', '/textures/noiseTexture.png']);
    useFrame(({ clock }) => {
        //meshRef.current.rotation.y = clock.getElapsedTime();
    });
    return (
        <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10, 128, 128]} />
            <meshToonMaterial v
                wireframe={false}
                flatShading={true}
                //map={testColorMap}
                color="white"
                displacementMap={testDisplacementMap}
                displacementScale={4.5}
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
            intensity={15.0}
            visible={true}
            position={[0.0, 5.0, 0.0]}
            castShadow={true}
        />
    );
};
function TextOnHover(props) {
    const [isHovered, setIsHovered] = useState(false);
    const meshRef = React.useRef();
    const textRef = React.useRef();
    useFrame(({ clock }) => {
        textRef.visible = isHovered;
    });
    return (
        <mesh ref={meshRef} position={props.position} onPointerEnter={() => setIsHovered(true)} onPointerLeave={() => setIsHovered(false)}>
            <sphereGeometry
                args={[props.radius, 10, 10]}
                color="green"
            />
            <meshToonMaterial
                color={props.color}
                flatShading={false}
            />
            {isHovered && (
                <Html>
                    <div className='VertexPopup'>
                        <p>DISPLAY STYLED COMPONENT WITH GENRE NAME AND HOURS LISTENED</p>
                    </div>
                </Html>
            )}

        </mesh>

    );
};
const Graph = () => {
    const isTesting = false;
    return (
        <div>
            <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>
                <Canvas camera={
                    {
                        fov: 85,
                        position: [0, 5.0, 0]
                    }
                } shadows>
                    {/*Toggle grid and axes*/}
                    {isTesting ? <axesHelper args={[2]} /> : null}
                    {isTesting ? <gridHelper /> : null}
                    {/*Instantiate rotating box as functional component*/}
                    <Map />
                    <PointLight />
                    <TextOnHover position={[0.1, 3.5, 0.3]} color="green" radius={0.1} />
                    <TextOnHover position={[1.5, 3.5, 4]} color="red" radius={0.2} />
                    <OrbitControls
                        enablePan={false}
                        enableDamping={true}
                        dampingFactor={0.035}
                        maxPolarAngle={3 * Math.PI / 8}
                        minPolarAngle={-Math.PI / 4}
                        minDistance={4.0}
                        maxDistance={10.0}
                        zoomSpeed={0.5}
                    />
                    <Stats />
                </Canvas>
            </div>
        </div>
    );
};


const getTokenFromURL = ()=> {
    return window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial, item)=>{
            let parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);

            return initial
        }, {});
}

export const sendTokenToBackend = async () => {
    const tokenData = getTokenFromURL();
    if (tokenData.access_token) {
        try {
            const response = await fetch("http://localhost:5050/api/save-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tokenData)
            });

            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error("Error sending token to backend:", error);
        }
    } else {
        console.error("Access token is missing from the URL.");
    }
};

export default Graph;