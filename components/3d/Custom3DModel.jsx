'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, Center, PresentationControls, Stage, Environment, OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';
import { FBXLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';

// Enhanced Loading fallback with animation
function Loader() {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.02;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#64b5f6" wireframe />
        </mesh>
    );
}

// Custom 3D Model Component with full format support
function Model({ modelPath, scrollProgress, animationType = 'rotate' }) {
    const meshRef = useRef();
    const [model, setModel] = useState(null);
    const [error, setError] = useState(null);

    // Load the model based on file type
    useEffect(() => {
        if (!modelPath) {
            console.warn('⚠️ No model path provided');
            return;
        }

        console.log('🎭 Starting to load 3D model:', modelPath);

        const loadModel = async () => {
            try {
                const fileExt = modelPath.split('.').pop().toLowerCase();
                console.log('📁 File extension:', fileExt);
                let loadedModel = null;

                if (fileExt === 'gltf' || fileExt === 'glb') {
                    console.log('⏳ Loading GLTF/GLB...');
                    // Load GLTF/GLB
                    const gltf = await useGLTF.preload(modelPath);
                    loadedModel = gltf.scene.clone();
                    console.log('✅ GLTF/GLB loaded:', loadedModel);
                } else if (fileExt === 'fbx') {
                    console.log('⏳ Loading FBX with FBXLoader...');
                    // Load FBX
                    const fbxLoader = new FBXLoader();
                    loadedModel = await new Promise((resolve, reject) => {
                        fbxLoader.load(
                            modelPath,
                            (object) => {
                                console.log('✅ FBX loaded successfully:', object);
                                resolve(object);
                            },
                            (progress) => {
                                console.log('📊 Loading progress:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
                            },
                            (err) => {
                                console.error('❌ FBX loading failed:', err);
                                reject(err);
                            }
                        );
                    });
                } else if (fileExt === 'obj') {
                    console.log('⏳ Loading OBJ with OBJLoader...');
                    // Load OBJ
                    const objLoader = new OBJLoader();
                    loadedModel = await new Promise((resolve, reject) => {
                        objLoader.load(
                            modelPath,
                            (object) => {
                                console.log('✅ OBJ loaded successfully:', object);
                                resolve(object);
                            },
                            (progress) => {
                                console.log('📊 Loading progress:', progress);
                            },
                            (err) => {
                                console.error('❌ OBJ loading failed:', err);
                                reject(err);
                            }
                        );
                    });
                }

                if (loadedModel) {
                    console.log('🔧 Normalizing model...');
                    // Normalize the model
                    const box = new THREE.Box3().setFromObject(loadedModel);
                    const center = box.getCenter(new THREE.Vector3());
                    loadedModel.position.sub(center);
                    console.log('✅ Model normalized and ready!');
                    setModel(loadedModel);
                    setError(null);
                } else {
                    console.error('❌ No model loaded - unsupported format?');
                    setError('Unsupported file format: ' + fileExt);
                }
            } catch (err) {
                console.error('❌ Error loading model:', err);
                setError(err.message);
            }
        };

        loadModel();
    }, [modelPath]);

    // Scroll-based animation
    useFrame((state) => {
        if (meshRef.current && model) {
            const progress = scrollProgress || 0;

            switch (animationType) {
                case 'rotate':
                    meshRef.current.rotation.y = progress * Math.PI * 2;
                    break;
                case 'float':
                    meshRef.current.position.y = Math.sin(progress * Math.PI * 2) * 2;
                    break;
                case 'scale':
                    const scale = 1 + Math.sin(progress * Math.PI) * 0.5;
                    meshRef.current.scale.set(scale, scale, scale);
                    break;
                case 'spin':
                    meshRef.current.rotation.x = progress * Math.PI * 4;
                    meshRef.current.rotation.y = progress * Math.PI * 4;
                    break;
                default:
                    meshRef.current.rotation.y += 0.01;
            }
        }
    });

    if (error) {
        console.error('❌ Model loading error:', error);
        return (
            <div style={{ color: '#f44336', textAlign: 'center', padding: '2rem' }}>
                <h3>⚠️ Error Loading Model</h3>
                <p>{error}</p>
                <small>Check console for details</small>
            </div>
        );
    }

    if (!model) {
        console.log('⏳ Loading model...');
        return <Loader />;
    }

    console.log('✅ Model loaded successfully!', model);
    return (
        <primitive ref={meshRef} object={model} />
    );
}

// Main 3D Model Display Component
export default function Custom3DModel({
    modelUrl,
    animationType = 'rotate',
    position = [0, 0, 0],
    scale = 1,
    height = '500px',
    enableScroll = true
}) {
    const { scrollYProgress } = useScroll();
    const [scrollValue, setScrollValue] = useState(0);

    useEffect(() => {
        if (enableScroll) {
            const unsubscribe = scrollYProgress.on('change', (latest) => {
                setScrollValue(latest);
            });
            return () => unsubscribe();
        }
    }, [scrollYProgress, enableScroll]);

    if (!modelUrl) return null;

    return (
        <div style={{
            width: '100%',
            height: height,
            position: 'relative',
        }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ alpha: true, antialias: true }}
            >
                <Suspense fallback={<Loader />}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -5]} color="#7e57c2" intensity={0.5} />
                    <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} />

                    <Center>
                        <group position={position} scale={scale}>
                            <Model
                                modelPath={modelUrl}
                                scrollProgress={enableScroll ? scrollValue : 0}
                                animationType={animationType}
                            />
                        </group>
                    </Center>

                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        autoRotate={false}
                        minDistance={2}
                        maxDistance={10}
                    />

                    <Environment preset="sunset" />
                </Suspense>
            </Canvas>
        </div>
    );
}
