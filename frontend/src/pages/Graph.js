import React, { useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stats, OrbitControls, Html } from '@react-three/drei'
import { TextureLoader, MathUtils } from 'three';
import { create } from 'zustand';
import styled from 'styled-components';

const PageContainer = styled.div`
    background-color: #13144f; 
    display: flex;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 5fr 1fr; // Two equal-width columns
    gap: 200px; // Adjust spacing between columns as needed

    @media (max-width: 768px) {
        grid-template-columns: 1fr; // Single column on smaller screens
    }
`;

const ButtonContainer = styled.div`
    margin-top: 5px;
    display: flex;
    align-items: start;
`;

const LeftSidebarContainer = styled.div`
    padding: 60px;
`;

const GraphicContainer = styled.div`
    height: 100%;
    width: 100%;
    align-items: center;
`;

const RightSidebarContainer = styled.div`
    padding: 60px;
`

const HistoryButton = styled.button`
    background-color: #1DB954;
    border: none;
    padding: 15px 32px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 32px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
`;

const graphVertexShader = `
varying vec2 vUv;
varying float vDisp;

uniform sampler2D u_texture;
uniform float u_intensity;

void main() {
  vUv = uv;
  vDisp = texture2D(u_texture, uv).r;
  vec4 pos = vec4(position, 1.0);
  if(normal.z > 0.0) {
    pos = vec4((position + normal * (vDisp) * u_intensity), 1.0);
  } else if (normal.z < 0.0) {
    pos = vec4(position, 1.0);
  } else {
    pos = vec4(position + vec3(0.0, 0.0, 1.0) * vDisp * u_intensity, 1.0);
  }
  vec4 modelPosition = modelMatrix * pos;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`
const graphFragmentShader = `
varying vec2 vUv;
varying float vDisp;

vec3 colorB = vec3(0.31, 0.90, 0.40);
vec3 colorA = vec3(0.04, 0.02, 0.33);

void main() {
  vec3 color = mix(colorA, colorB, vDisp);

  gl_FragColor = vec4(color,1.0);
}
`
// const useStore = create((set) => ({
//     displacementMapArray: useLoader(TextureLoader, ['/textures/2monthsDemo.png', '/textures/6monthsDemo.png', '/textures/12monthsDemo.png']),
//     texture: state.displacementMapArray[0],
//     updateTexture2Months: () => set({ texture: state.displacementMapArray[0] }),
//     updateTexture6Months: () => set({ texture: state.displacementMapArray[1] }),
//     updateTexture12Months: () => set({ texture: state.displacementMapArray[2] }),
// }))

function Map() {
    const meshRef = React.useRef();
    const [grouped_vertices, setGroupedVertices] = useState([[]]);
    // const displacementMap = useStore((state) => state.texture);
    const displacementMapArray = useLoader(TextureLoader, ['/textures/2monthsDemo.png', '/textures/6monthsDemo.png', '/textures/12monthsDemo.png']);
    const displacementMap = displacementMapArray[0];
    useEffect(() => {
        const geo = meshRef.current.geometry;
        const vertices = geo.attributes.position.array;
        let dummy_vertices = [[]];
        for (let i = 0; i < vertices.length; i += 3) {
            let vertex = [vertices[i], vertices[i + 1], vertices[i + 2]];
            dummy_vertices.push(vertex);
            console.log(vertex)
        }
        dummy_vertices.sort((a, b) => a[1] > b[1]);
        setGroupedVertices(dummy_vertices);
        return () => {
            dummy_vertices = null;
        }
    }, []);
    return (
        <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* <planeGeometry args={[10, 10, 128, 128]} /> */}
            <boxGeometry args={[10, 10, 2, 128, 128, 2]} />
            <TextOnHover position={grouped_vertices[0]} color="red" radius={2} />
            <TextOnHover position={grouped_vertices[1]} color="green" radius={0.2} />
            <TextOnHover position={grouped_vertices[2]} color="green" radius={0.15} />
            <TextOnHover position={grouped_vertices[3]} color="green" radius={0.1} />
            <TextOnHover position={grouped_vertices[4]} color="green" radius={0.05} />
            <shaderMaterial
                fragmentShader={graphFragmentShader}
                vertexShader={graphVertexShader}
                uniforms={{
                    u_texture: { value: displacementMap },
                    u_intensity: { value: 5.0 },
                }}

            />
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
    const mapRef = React.useRef();
    const isTesting = false;
    // const handleRadioChange = (value) => {
    //     if(value == "a") {
    //         updateTexture2Months();
    //     }
    //     if(value == "b") {
    //         updateTexture2Months();
    //     }
    //     if(value == "c") {

    //     }
    // };
    return (
        <PageContainer>
            <LeftSidebarContainer>
                <ButtonContainer>
                    <HistoryButton >

                    </HistoryButton>
                    {/* <Radio
                        checked={selectedValue === '2'}
                        onChange={handleRadioChange(value)}
                        value="a"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': '2mo' }}
                    />
                    <Radio
                        checked={selectedValue === '6'}
                        onChange={handleRadioChange(value)}
                        value="b"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': '6mo' }}
                    />
                    <Radio
                        checked={selectedValue === '12'}
                        onChange={handleRadioChange(value)}
                        value="c"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': '12mo' }}
                    /> */}
                </ButtonContainer>
            </LeftSidebarContainer>
            <GraphicContainer>
                <Canvas style={{ width: '100%', height: '100%' }} camera={
                    {
                        fov: 85,
                        position: [0, 5.0, 0]
                    }
                } shadows>
                    {/*Toggle grid and axes*/}
                    {isTesting ? <axesHelper args={[2]} /> : null}
                    {isTesting ? <gridHelper /> : null}
                    {/*Instantiate rotating box as functional component*/}
                    <Map ref={mapRef} />
                    <PointLight />
                    <OrbitControls
                        enablePan={false}
                        enableDamping={true}
                        dampingFactor={0.035}
                        maxPolarAngle={3 * Math.PI / 8}
                        minPolarAngle={-Math.PI / 4}
                        minDistance={4.0}
                        maxDistance={20.0}
                        zoomSpeed={0.5}
                    />
                    <Stats />
                </Canvas>
            </GraphicContainer>
            <RightSidebarContainer >
            </RightSidebarContainer>
        </PageContainer>
    );
};

export default Graph;