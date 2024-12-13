import React, { useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stats, OrbitControls, Html } from '@react-three/drei'
import { TextureLoader, MathUtils } from 'three';
import useAuthStore from '../stores/authStore';
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
    //grid-template-rows: 5fr 1fr; // Two equal-width columns
`;

const DetailContainer = styled.div`
    padding: 60px;
    position: absolute;
    top: 30px;
    right: 20px;
    z-index: 2;
`;

const DetailBox = styled.div`
    width: 250px;
    height: 250px;
    border-radius: 15px;
    box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.6);
    padding: 25px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    //background-color: #e97451;
    background-color: #FFFDD0;
    font-family: 'Neue Haas Grotesk', sans-serif;
    font-size: 32px;
    user-select: none;
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
    position:absolute;
    left: -200px;
    width: calc(100vw + 200px);
    z-index:1;
`;

const BlurbContainer = styled.div`
    //marginLeft:50px;
    margin: 30px;
    padding-left: 20px;
    position: absolute;
    top: 30px;
    left: 20px;
    z-index: 2;
`;

const BlurbBox = styled.div`
    color: white;
    opacity: 0.8;
    font-family: 'Neue Haas Grotesk', sans-serif;
    font-size: 48px;
    user-select: none;
`;

const DescriptionContainer = styled.div`
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: 300px;
    padding: 10px;
    border-radius: 8px;
    background-color: #FFFDD0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-family: 'Neue Haas Grotesk', sans-serif;
    font-size: 16px;
    z-index: 3;
    color: #333;
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

vec3 acoustic_high = vec3(0.52, 0.05, 0.05);
vec3 acoustic_low = vec3(0.08, 0.05, 0.52);
vec3 acoustic_high_intense = vec3(1.00, 0.60, 0.60);
vec3 acoustic_low_intense = vec3(0.69, 0.73, 1.00);
vec3 intensity_high = vec3(0.96, 0.99, 0.98);

void main() {
  vec3 a_color = mix(acoustic_low, acoustic_low_intense, vDisp);
  vec3 b_color = mix(acoustic_high, acoustic_high_intense, vDisp);

  vec3 i_color = mix(a_color, b_color, vUv.x);

  gl_FragColor = vec4(i_color,1.0);
}
`

const pointVertexShader = `
uniform float u_value;

void main() {
  vec4 pos = vec4(position, 1.0);
  vec4 modelPosition = modelMatrix * pos;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`

const pointFragmentShader = `
    uniform float u_value;

    vec3 acoustic_high = vec3(1.00, 0.14, 0.14);
    vec3 acoustic_low = vec3(0.15, 0.09, 0.98);

    void main() {
        vec3 color = mix(acoustic_low, acoustic_high, u_value);
        gl_FragColor = vec4(color,1.0);
}
`
function vertexSort(a, b) {
    if (a[2] === b[2]) {
        return 0;
    }
    else {
        return (a[2] < b[2]) ? 1 : -1;
    }
}

function Map({onHover}) {
    const meshRef = React.useRef();  
    const genreMapURL = useAuthStore(state => (state.genreMap));
    const genreDict = useAuthStore(state => (state.genreDurations));
    const [grouped_vertices, setGroupedVertices] = useState([]);
    const [max_weight, setMaxWeight] = useState(0);
    const displacementMapArray = useLoader(TextureLoader, [genreMapURL]);
    const displacementMap = displacementMapArray[0];

    useEffect(() => {
        let dummy_vertices = [[]];
        let count = 0;
        Object.entries(genreDict).map(([key, value]) => {
            if (value > max_weight) {
                setMaxWeight(value);
            }
            const xy = key.split(',');
            const x = MathUtils.mapLinear(Number(xy[0]), 0.0, 1.0, -5.0, 5.0);
            const y = MathUtils.mapLinear(Number(xy[1]), 0.0, 1.0, 5.0, -5.0);
            const pt = [x, y, value, xy[0], xy[1]];
            count += 1;
            dummy_vertices.push(pt);
        });
        dummy_vertices.sort(vertexSort);
        const top_entries = dummy_vertices.slice(0, 5);
        setGroupedVertices(top_entries);
    }, []);

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10, 128, 128]} />
            {grouped_vertices.length > 0 && grouped_vertices.map(([x, y, value, ox, oy]) => (
                <TextOnHover
                    key={`${ox}-${oy}`}
                    position={[x, y, 6]}
                    radius={0.15}
                    x={ox}
                    y={oy}
                    color_val={ox}
                    onHover={onHover}
                />
            ))}
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
}

function TextOnHover({ position, radius, x, y, onHover, color_val }) {
    const [isHovered, setIsHovered] = useState(false);
    const meshRef = React.useRef();

    const handleHover = (hovered) => {
        setIsHovered(hovered);
        if (hovered) {
            onHover(x, y); // Pass data to parent
        }
    };

    const uniforms = useMemo(
        () => ({
            u_value: {value: color_val}
        }),
        []
    );

    return (
        <mesh
            ref={meshRef}
            position={position}
            onPointerEnter={() => handleHover(true)}
            onPointerLeave={() => handleHover(false)}
        >
            <sphereGeometry args={[radius, 10, 10]} />
            <shaderMaterial 
                fragmentShader={pointFragmentShader}
                vertexShader={pointVertexShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

/*
{isHovered && (
                <Html>
                    <div className='VertexPopup'>
                        <p>Acousticness: {x}</p>
                        <p>Energy: {y}</p>
                    </div>
                </Html>
            )}

*/

const Graph = () => {
    const [selectedData, setSelectedData] = useState({ acousticness: null, energy: null });

    const handleHover = (acousticness, energy) => {
        setSelectedData({ acousticness, energy });
    };

    return (
        <PageContainer>
            <DataContainer>
                <GraphicContainer>
                    <Canvas
                        style={{ width: '100%', height: '100%' }}
                        camera={{
                            fov: 65,
                            position: [0.0, 5.5, 15.0],
                        }}
                        shadows
                    >
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
                        <Map onHover={handleHover} />
                    </Canvas>
                </GraphicContainer>
                <BlurbContainer>
                    <BlurbBox>Your Music Style.</BlurbBox>
                </BlurbContainer>
            </DataContainer>
            <DetailContainer>
                <DetailBox>
                    <p>Acoustic: {Number(selectedData.acousticness).toFixed(2) ?? 'N/A'}</p>
                    <p>Energy: {Number(selectedData.energy).toFixed(2) ?? 'N/A'}</p>
                </DetailBox>
            </DetailContainer>
            <DescriptionContainer>
                <p>Acousticness is shown from Blue to Red.</p>
            </DescriptionContainer>
        </PageContainer>
    );
};

export default Graph;