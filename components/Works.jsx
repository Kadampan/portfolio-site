'use client';

import { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import styles from './Works.module.css';

export default function Works({ data }) {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.reveal').forEach((el, index) => {
                            setTimeout(() => {
                                el.classList.add('active');
                            }, index * 100);
                        });
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    if (!data) return null;

    return (
        <section id="works" className="section" ref={sectionRef}>
            <div className="container-wide">
                <h2 className="section-title reveal">
                    <span className="gradient-text">My Works</span>
                </h2>

                <p className={`${styles.subtitle} reveal`}>
                    A showcase of my recent projects and creative endeavors
                </p>

                <div className={styles.grid}>
                    {data.map((project) => (
                        <div key={project.id} className="reveal">
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
