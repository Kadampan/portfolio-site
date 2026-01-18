'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Stars() {
    const ref = useRef();

    // Generate random positions for stars (increased count for more impact)
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 3000; i++) {
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50;
            temp.push(x, y, z);
        }
        return new Float32Array(temp);
    }, []);

    // Smooth rotation animation
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={particles} stride={3} frustumCulled>
                <PointMaterial
                    transparent
                    color="#64b5f6"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

export default function FloatingBackground() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: -1,
            background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 100%)',
        }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.3} />
                <Stars />
            </Canvas>
        </div>
    );
}
