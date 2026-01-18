'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

function ScrollResponsiveMesh({ scrollProgress }) {
    const meshRef = useRef();
    const groupRef = useRef();

    useFrame(() => {
        if (meshRef.current && groupRef.current) {
            // Rotation based on scroll
            meshRef.current.rotation.x = scrollProgress * Math.PI * 2;
            meshRef.current.rotation.y = scrollProgress * Math.PI * 3;

            // Position based on scroll
            groupRef.current.position.x = Math.sin(scrollProgress * Math.PI * 2) * 2;

            // Scale effect
            const scale = 1 + Math.sin(scrollProgress * Math.PI) * 0.5;
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group ref={groupRef}>
            <mesh ref={meshRef}>
                <torusKnotGeometry args={[0.8, 0.3, 128, 16]} />
                <meshStandardMaterial
                    color="#4fc3f7"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#4fc3f7"
                    emissiveIntensity={0.4}
                />
            </mesh>
            <pointLight position={[2, 2, 2]} intensity={1} color="#64b5f6" />
        </group>
    );
}

export default function ScrollAnimation() {
    const { scrollYProgress } = useScroll();
    const scrollValue = useRef(0);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            scrollValue.current = latest;
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            right: '5%',
            width: '200px',
            height: '200px',
            zIndex: 10,
            pointerEvents: 'none',
        }}>
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <ScrollResponsiveMesh scrollProgress={scrollValue.current} />
            </Canvas>
        </div>
    );
}
