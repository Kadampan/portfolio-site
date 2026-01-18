'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MeshWobbleMaterial, Float, Text3D, Center } from '@react-three/drei';

function InteractiveCard3D({ isHovered }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = isHovered
                ? Math.sin(state.clock.elapsedTime * 2) * 0.1
                : meshRef.current.rotation.y * 0.95;

            meshRef.current.position.z = isHovered
                ? Math.sin(state.clock.elapsedTime * 3) * 0.2
                : 0;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh ref={meshRef} scale={isHovered ? 1.1 : 1}>
                <boxGeometry args={[2, 2.5, 0.2]} />
                <MeshWobbleMaterial
                    color={isHovered ? "#4fc3f7" : "#7e57c2"}
                    attach="material"
                    factor={0.3}
                    speed={2}
                    roughness={0.3}
                    metalness={0.7}
                    emissive={isHovered ? "#4fc3f7" : "#7e57c2"}
                    emissiveIntensity={isHovered ? 0.6 : 0.3}
                />
            </mesh>
        </Float>
    );
}

export default function Card3DEffect({ children, style }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '350px',
                ...style,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 3D Background */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 0,
            }}>
                <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={0.8} />
                    <pointLight position={[-10, -10, 5]} color="#7e57c2" intensity={0.5} />

                    <InteractiveCard3D isHovered={isHovered} />
                </Canvas>
            </div>

            {/* Content Overlay */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
            }}>
                {children}
            </div>
        </div>
    );
}
