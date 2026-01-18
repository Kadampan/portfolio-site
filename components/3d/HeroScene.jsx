'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef } from 'react';

function AnimatedSphere() {
    const sphereRef = useRef();

    useFrame((state) => {
        if (sphereRef.current) {
            sphereRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            sphereRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere ref={sphereRef} args={[1, 100, 100]} scale={2.5}>
                <MeshDistortMaterial
                    color="#4fc3f7"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    emissive="#4fc3f7"
                    emissiveIntensity={0.5}
                />
            </Sphere>
        </Float>
    );
}

function FloatingCube({ position }) {
    const cubeRef = useRef();

    useFrame((state) => {
        if (cubeRef.current) {
            cubeRef.current.rotation.x += 0.01;
            cubeRef.current.rotation.y += 0.01;
            cubeRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.3;
        }
    });

    return (
        <mesh ref={cubeRef} position={position}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
                color="#7e57c2"
                transparent
                opacity={0.6}
                wireframe
                emissive="#7e57c2"
                emissiveIntensity={0.5}
            />
        </mesh>
    );
}

export default function HeroScene() {
    return (
        <div style={{
            width: '100%',
            height: '500px',
            position: 'relative',
        }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} color="#7e57c2" intensity={0.5} />
                <spotLight position={[0, 5, 10]} angle={0.3} penumbra={1} intensity={1} />

                <AnimatedSphere />

                <FloatingCube position={[-3, 1, 0]} />
                <FloatingCube position={[3, -1, 0]} />
                <FloatingCube position={[0, 2, -2]} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={2}
                />
            </Canvas>
        </div>
    );
}
