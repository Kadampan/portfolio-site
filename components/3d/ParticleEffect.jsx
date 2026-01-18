'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function ParticleWave({ count = 5000, color = "#4fc3f7" }) {
    const points = useRef();

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 10;
            positions[i3 + 1] = (Math.random() - 0.5) * 10;
            positions[i3 + 2] = (Math.random() - 0.5) * 10;
        }

        return positions;
    }, [count]);

    useFrame((state) => {
        if (points.current) {
            const positions = points.current.geometry.attributes.position.array;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;

                // Wave effect
                positions[i3 + 1] = Math.sin(state.clock.elapsedTime + positions[i3] / 2) * 0.5;

                // Slight rotation effect
                const angle = state.clock.elapsedTime * 0.1;
                const distance = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
                positions[i3] = Math.cos(angle + i * 0.001) * distance;
                positions[i3 + 2] = Math.sin(angle + i * 0.001) * distance;
            }

            points.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <Points ref={points} positions={particlesPosition} stride={3}>
            <PointMaterial
                transparent
                color={color}
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.8}
            />
        </Points>
    );
}

export default function ParticleEffect({ height = '400px', particleCount = 5000, color = "#4fc3f7" }) {
    return (
        <div style={{
            width: '100%',
            height: height,
            position: 'relative',
        }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <ParticleWave count={particleCount} color={color} />
            </Canvas>
        </div>
    );
}
