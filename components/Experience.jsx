'use client';

import { useEffect, useRef } from 'react';
import styles from './Experience.module.css';

export default function Experience({ data }) {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.reveal').forEach((el, index) => {
                            setTimeout(() => {
                                el.classList.add('active');
                            }, index * 150);
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
        <section id="experience" className="section" ref={sectionRef} style={{ background: 'var(--color-bg-secondary)' }}>
            <div className="container">
                <h2 className="section-title reveal">
                    <span className="gradient-text">Experience</span>
                </h2>

                <div className={styles.timeline}>
                    {data.map((exp) => (
                        <div key={exp.id} className={`${styles.card} reveal glass hover-lift`}>
                            <div className={styles.header}>
                                <div>
                                    <h3>{exp.title}</h3>
                                    <h4>{exp.company}</h4>
                                </div>
                                <div className={styles.duration}>{exp.year}</div>
                            </div>

                            <ul className={styles.responsibilities}>
                                {exp.works.split('\n').map((work, i) => (
                                    work.trim() && <li key={i}>{work.trim()}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
