'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, MeshReflectorMaterial } from '@react-three/drei';
import { useRef } from 'react';

function Animated3DText({ text, color = "#4fc3f7" }) {
    const textRef = useRef();

    useFrame((state) => {
        if (textRef.current) {
            textRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
                ref={textRef}
                font="/fonts/Inter-Bold.woff"
                fontSize={0.8}
                color={color}
                anchorX="center"
                anchorY="middle"
                maxWidth={10}
            >
                {text}
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    metalness={0.8}
                    roughness={0.2}
                />
            </Text>
        </Float>
    );
}

function ReflectivePlane() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[10, 10]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={2048}
                mixBlur={1}
                mixStrength={40}
                roughness={1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#1a1f3a"
                metalness={0.5}
            />
        </mesh>
    );
}

export default function Text3DComponent({ text, height = '300px', showReflection = false }) {
    return (
        <div style={{
            width: '100%',
            height: height,
            position: 'relative',
        }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, 5, 5]} color="#7e57c2" intensity={0.8} />
                <spotLight
                    position={[0, 10, 0]}
                    angle={0.3}
                    penumbra={1}
                    intensity={1}
                    castShadow
                />

                <Animated3DText text={text} />

                {showReflection && <ReflectivePlane />}
            </Canvas>
        </div>
    );
}
