import React, { useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, MathUtils } from 'three';
import { loginUrl } from './spotify'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useControls } from 'leva'
import { Texture } from '@react-three/drei';

const PageContainer = styled.div`
    background-color: #e97451; 
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 2fr; // Two equal-width columns
    gap: 200px; // Adjust spacing between columns as needed

    @media (max-width: 768px) {
        grid-template-columns: 1fr; // Single column on smaller screens
    }
`;

const MainContainer = styled.div`
    padding: 60px;

`;

const TitleContainer = styled.div`
    padding: 15px 32px;
    text-align: center;
    font-size: 128px;
    font-weight: bold;
    text-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const ButtonContainer = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LoginButton = styled.button`
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


const GraphicContainer = styled.div`
    height: 100%;
    width: 100%;
`;

//vertex shader calculates displacement based on noise computation
//noise computation is classic 3D perlin noise from Stefan Gustavson
const loginVertexShader = `
varying vec2 vUv;
varying float vDisp;

uniform float u_time;
uniform float u_scale;

vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}

void main() {
  vUv = uv;
  vDisp = cnoise(position + vec3(u_time * 2.0));
  vec4 modelPosition = modelMatrix * vec4((position + normal * (vDisp) * u_scale), 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`

const loginFragmentShader = `
varying vec2 vUv;
varying float vDisp;

uniform float u_time;
uniform float u_scale;

vec3 colorB = vec3(0.31, 0.90, 0.40);
vec3 colorA = vec3(0.04, 0.02, 0.33);

void main() {
  vec3 color = mix(colorA, colorB, vDisp);

  gl_FragColor = vec4(color,1.0);
}
`



function RotatingGraph() {
    const meshRef = React.useRef();
    const [dispMap] = useLoader(TextureLoader, ['/textures/noiseTexture.png']);
    //prevent rerendering using useMemo
    const uniforms = useMemo(
        () => ({
            u_time: { value: 0.0 },
            u_scale: { value: 1.0 },
        }),
        []
    );
    useFrame(({ clock }) => {
        meshRef.current.rotation.z = 0.5 * clock.getElapsedTime();
        meshRef.current.material.uniforms.u_time.value = 0.4 * clock.getElapsedTime();
    });
    const graphCtrl = useControls('Login Graph', {
        position: {
            x: -0.3,
            y: 0.0,
            z: 0.50,
        },
        rotation: {
            x: 4.75,
            y: 0.0,
            z: 0.0,
        },
    })

    return (
        <mesh ref={meshRef}
            position={[graphCtrl.position.x, graphCtrl.position.y, graphCtrl.position.z]}
            rotation={[graphCtrl.rotation.x, graphCtrl.rotation.y, graphCtrl.rotation.z]}>
            <planeGeometry args={[2.5, 2.5, 128, 128]} />
            <shaderMaterial
                fragmentShader={loginFragmentShader}
                vertexShader={loginVertexShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

const Login = () => {

    //This navigation is a temp patch to help with development. change to commented out code to get routing working correctly.
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/graph');
    };
    /*const handleLogin = () => {
        window.location.href = 'http://localhost:5050/login';
    }; */
    const cameraCtrl = useControls('Camera', {
        fov: 60,
        position: {
            x: 0,
            y: 0,
            z: 0,
        }
    })
    return (
        <PageContainer>
            <MainContainer>
                <TitleContainer>Mapify</TitleContainer>
                <ButtonContainer>
                    <LoginButton onClick={handleLogin}>Login with Spotify</LoginButton>
                </ButtonContainer>
            </MainContainer>

            <GraphicContainer>
                <Canvas style={{ width: '100%', height: '100%' }}
                    shadows
                    camera={
                        {
                            fov: 40,
                            position: [0.0, 3.5, 6.0]
                        }
                    }>
                    <pointLight
                        intensity={15.0}
                        visible={true}
                        position={[0.0, 4.0, 0.0]}
                        shadows
                        castShadow={true}
                    />
                    <RotatingGraph />
                </Canvas>
            </GraphicContainer>

        </PageContainer>
    );
};

export default Login;