import React, { useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stats, OrbitControls, Html } from '@react-three/drei'
import { TextureLoader, MathUtils } from 'three';
import { create } from 'zustand';
import styled from 'styled-components';

const PageContainer = styled.div`
    background-color: #F7CAC9; 
    display: flex;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 4fr 1fr; // Two equal-width columns
    gap: 200px; // Adjust spacing between columns as needed

    @media (max-width: 768px) {
        grid-template-columns: 1fr; // Single column on smaller screens
        grid-template-rows: auto auto; // Stack rows on smaller screens
    }
`;

const DataContainer = styled.div`
    display: grid;
    grid-template-rows: 5fr 1fr; // Two equal-width columns
`;

const DetailContainer = styled.div`
    padding: 60px;
`;

const DetailBox = styled.div`
    width: 300px; /* Adjust width as needed */
    height: 450px; /* Adjust height as needed */
    border-radius: 15px; /* Rounded corners */
    box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.6); /* Subtle shadow */
    padding: 25px; /* Padding inside the box */
    display: flex;
    flex-direction: column;
    gap: 20px; /* Space between items */
    background-color: #e97451;
    font-family: 'Neue Haas Grotesk', sans-serif;
    font-size: 32px;
`;

const ButtonContainer = styled.div`
    margin-top: 5px;
    display: flex;
    align-items: start;
`;

const GraphicContainer = styled.div`
    height: 100%;
    width: 100%;
    align-items: center;
`;

const BlurbContainer = styled.div`
    //marginLeft:50px;
    margin: 30px;
    padding-left: 20px;
`;

const BlurbBox = styled.div`
    color: white;
    opacity: 0.8;
    font-family: 'Neue Haas Grotesk', sans-serif;
    font-size: 48px;
`;

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
  vDisp = texture2D(u_texture, uv).b;
  vec4 pos = vec4((position + normal * (vDisp) * u_intensity), 1.0);
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

const pointVertexShader = `
varying vec2 vUv;
varying float vDisp;

uniform sampler2D u_texture;
uniform float u_intensity;

void main() {
  vUv = uv;
  vDisp = texture2D(u_texture, uv).b;
  vec4 pos = vec4((position + vec3(0.0, 0.1, 0.0) * (vDisp) * u_intensity), 1.0);
  vec4 modelPosition = modelMatrix * pos;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
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
    const acoustic_energy_map = {
        "0.10,0.23": 12.5,
        "0.87,0.45": 30.0,
        "0.05,0.90": 45.3,
        "0.42,0.31": 22.1,
        "0.99,0.02": 10.0,
        "0.56,0.77": 35.7,
        "0.33,0.11": 18.2,
        "0.25,0.60": 40.5,
        "0.47,0.88": 50.0,
        "0.63,0.14": 5.9,
        "0.11,0.55": 26.4,
        "0.78,0.34": 15.3,
        "0.09,0.81": 55.2,
        "0.66,0.66": 29.0,
        "0.84,0.19": 7.7,
        "0.23,0.93": 42.1,
        "0.45,0.45": 33.0,
        "0.12,0.37": 14.8,
        "0.59,0.99": 58.0,
        "0.71,0.27": 16.6,
        "0.05,0.50": 20.5,
        "0.95,0.95": 60.0,
        "0.30,0.24": 9.9,
        "0.48,0.53": 34.2,
        "0.20,0.85": 48.3,
        "0.77,0.59": 27.7,
        "0.04,0.44": 12.1,
        "0.38,0.72": 36.4,
        "0.89,0.10": 11.5,
        "0.15,0.15": 8.0,
        "0.53,0.38": 25.0,
        "0.28,0.91": 45.8,
        "0.64,0.05": 6.3,
        "0.86,0.47": 31.1,
        "0.19,0.75": 40.9,
        "0.02,0.28": 10.2,
        "0.50,0.50": 23.5,
        "0.61,0.17": 13.4,
        "0.90,0.90": 59.9,
        "0.35,0.62": 21.2,
        "0.08,0.33": 17.5,
        "0.22,0.07": 4.8,
        "0.44,0.99": 52.3,
        "0.83,0.53": 39.0,
        "0.16,0.40": 19.7,
        "0.75,0.25": 29.9,
        "0.68,0.83": 46.1,
        "0.92,0.66": 32.6,
        "0.57,0.04": 6.8,
        "0.29,0.58": 24.9
    };
    const [grouped_vertices, setGroupedVertices] = useState([[]]);
    // const displacementMap = useStore((state) => state.texture);
    const displacementMapArray = useLoader(TextureLoader, ['/textures/genre_map_output.png', '/textures/6monthsDemo.png', '/textures/12monthsDemo.png']);
    const displacementMap = displacementMapArray[0];
    // let history = 0;
    useEffect(() => {
        let dummy_vertices = [[]];
        const vertices = meshRef.current.geometry.attributes.position.array;
        Object.entries(acoustic_energy_map).map(([key, value]) => {
            const xy = key.split(',');
            const x = MathUtils.mapLinear(Number(xy[0]), 0.0, 1.0, -5.0, 5.0);
            const y = MathUtils.mapLinear(Number(xy[1]), 0.0, 1.0, -5.0, 5.0);
            const val = Number(value);
            const pt = [x, y, val];
            dummy_vertices.push(pt);
        })
        setGroupedVertices(dummy_vertices);
        console.log(grouped_vertices[0][0])
        return () => {
            dummy_vertices = null;
        }
    }, []);
    // const changeTexture = () => {
    //     history += 1;
    //     history = history % 3;
    //     setDisplacementMap(displacementMapArray[history]);
    // };
    return (
        <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10, 128, 128]} />
            {/* <boxGeometry args={[10, 10, 2, 128, 128, 2]} /> */}
            {/* <TextOnHover position={[-5, 5, 0]} radius={2} u_texture={displacementMap} u_intensity={3.0} /> */}
            {/* <TextOnHover position={[grouped_vertices[1][0], grouped_vertices[1][1], 0]} radius={2} u_texture={displacementMap} u_intensity={3.0} />
            <TextOnHover position={[grouped_vertices[2][0], grouped_vertices[2][1], 0]} radius={2} u_texture={displacementMap} u_intensity={3.0} />
            <TextOnHover position={[grouped_vertices[3][0], grouped_vertices[3][1], 0]} radius={2} u_texture={displacementMap} u_intensity={3.0} /> */}
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
function TextOnHover(props) {
    const [isHovered, setIsHovered] = useState(false);
    const meshRef = React.useRef();
    const textRef = React.useRef();
    useFrame(({ clock }) => {
        textRef.visible = isHovered;
    });
    const uniforms = useMemo(
        () => ({
            u_texture: { value: props.u_texture },
            u_intensity: { value: props.u_intensity },
        }),
        []
    );
    return (
        <mesh ref={meshRef} position={props.position} onPointerEnter={() => setIsHovered(true)} onPointerLeave={() => setIsHovered(false)}>
            <sphereGeometry
                args={[props.radius, 10, 10]}
            />
            <shaderMaterial
                fragmentShader={graphFragmentShader}
                vertexShader={pointVertexShader}
                uniforms={uniforms}
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
    const canvasRef = React.useRef();
    const isTesting = false;
    // const [history, setHistory] = useState(0);
    // const handleClick = () => {
    //     if (history == 0) {
    //         setHistory(1);
    //     } else {
    //         setHistory(0);
    //     }
    // }
    return (
        <PageContainer>
            <DataContainer>
                <GraphicContainer>
                    <Canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} camera={
                        {
                            fov: 65,
                            position: [0.0, 5.5, 15.0],
                        }
                    } shadows>
                        {/*Toggle grid and axes*/}
                        {isTesting ? <axesHelper args={[2]} /> : null}
                        {isTesting ? <gridHelper /> : null}
                        {/*Instantiate rotating box as functional component*/}
                        <OrbitControls
                            enablePan={false}
                            enableDamping={true}
                            dampingFactor={0.035}
                            maxPolarAngle={3 * Math.PI / 8}
                            minPolarAngle={-Math.PI / 4}
                            minDistance={10.0}
                            maxDistance={20.0}

                            zoomSpeed={0.5}
                        />
                        <Map ref={mapRef} />
                    </Canvas>
                </GraphicContainer>
                <BlurbContainer>
                    <BlurbBox>
                        Acoustic & Energy Map.
                    </BlurbBox>
                </BlurbContainer>
            </DataContainer>
            
            <DetailContainer>
                <DetailBox>
                    Genre Data
                </DetailBox>
                
            </DetailContainer>
        </PageContainer>
    );
};

export default Graph;