'use client';

import { useEffect, useRef } from 'react';
import styles from './Education.module.css';

export default function Education({ data }) {
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
        <section id="education" className="section" ref={sectionRef} style={{ background: 'var(--color-bg-secondary)' }}>
            <div className="container">
                <h2 className="section-title reveal">
                    <span className="gradient-text">Education</span>
                </h2>

                <div className={styles.timeline}>
                    {data.map((edu) => (
                        <div key={edu.id} className={`${styles.card} reveal glass hover-lift`}>
                            <div className={styles.duration}>{edu.year}</div>
                            <h3>{edu.degree}</h3>
                            <h4>{edu.institution}</h4>
                            <ul className={styles.highlights}>
                                {edu.specialization.split('\n').map((item, i) => (
                                    item.trim() && <li key={i}>{item.trim()}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
