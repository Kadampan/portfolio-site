'use client';

import { useEffect, useRef } from 'react';
import styles from './Tools.module.css';

export default function Tools({ data }) {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.reveal').forEach((el, index) => {
                            setTimeout(() => {
                                el.classList.add('active');
                            }, index * 50);
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
        <section id="tools" className="section" ref={sectionRef}>
            <div className="container">
                <h2 className="section-title reveal">
                    <span className="gradient-text">Tools & Technologies</span>
                </h2>

                <div className={styles.toolsGrid}>
                    {data.map((toolCategory) => (
                        <div key={toolCategory.id} className={`${styles.category} reveal`}>
                            <h3 className={styles.categoryTitle}>{toolCategory.category}</h3>
                            <div className={styles.toolsList}>
                                {toolCategory.items.map((tool, toolIndex) => (
                                    <div key={toolIndex} className={`${styles.tool} glass hover-scale`}>
                                        {tool}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
