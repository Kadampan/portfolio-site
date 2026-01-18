'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project }) {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const toolsArray = typeof project.tools === 'string'
        ? project.tools.split(',').map(t => t.trim())
        : project.tools;

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateXValue = ((y - centerY) / centerY) * -10;
        const rotateYValue = ((x - centerX) / centerX) * 10;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            className={`${styles.card} glass`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
            }}
            animate={{
                rotateX: rotateX,
                rotateY: rotateY,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
            }}
            whileHover={{
                scale: 1.05,
                z: 50,
                boxShadow: '0 20px 60px rgba(100, 181, 246, 0.4)',
            }}
        >
            <div className={styles.imageContainer} style={{ transform: 'translateZ(20px)' }}>
                {project.image && (
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                )}
                <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                        <h4>{project.title}</h4>
                        <p>{project.description}</p>
                    </div>
                </div>
            </div>

            <div className={styles.content} style={{ transform: 'translateZ(40px)' }}>
                <h3>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>

                <div className={styles.tools}>
                    {toolsArray.map((tool, index) => (
                        <motion.span
                            key={index}
                            className={styles.tool}
                            style={{ transform: 'translateZ(60px)' }}
                            whileHover={{
                                scale: 1.1,
                                backgroundColor: '#8b5cf6',
                                color: '#ffffff',
                            }}
                        >
                            {tool}
                        </motion.span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
