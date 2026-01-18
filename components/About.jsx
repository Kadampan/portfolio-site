'use client';

import { useEffect, useRef } from 'react';
import styles from './About.module.css';

export default function About({ data }) {
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
        <section id="about" className="section" ref={sectionRef}>
            <div className="container">
                <h2 className="section-title reveal">
                    <span className="gradient-text">About Me</span>
                </h2>

                <div className={styles.content}>
                    <div className={`${styles.imageContainer} reveal`}>
                        {data.image ? (
                            <img src={data.image} alt="Profile" className={styles.profileImage} />
                        ) : (
                            <div className={styles.imagePlaceholder}>
                                <span className="gradient-text">3D</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.textContent}>
                        {data.description.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="reveal">{paragraph}</p>
                        ))}

                        <div className={`${styles.highlights} reveal`}>
                            <div className={styles.highlight}>
                                <span className={styles.icon}>🎨</span>
                                <div>
                                    <h4>Creative Vision</h4>
                                    <p>Bringing artistic concepts to life with technical precision</p>
                                </div>
                            </div>

                            <div className={styles.highlight}>
                                <span className={styles.icon}>⚡</span>
                                <div>
                                    <h4>Performance Focused</h4>
                                    <p>Optimizing 3D assets for maximum efficiency</p>
                                </div>
                            </div>

                            <div className={styles.highlight}>
                                <span className={styles.icon}>🚀</span>
                                <div>
                                    <h4>Innovation Driven</h4>
                                    <p>Constantly exploring new technologies and techniques</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
