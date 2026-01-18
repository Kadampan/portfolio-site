'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './Hero.module.css';

// ONLY Custom 3D Models - NO DEFAULT NEON OBJECT!
const Models3DDisplay = dynamic(() => import('@/components/3d/Models3DDisplay'), {
    ssr: false,
    loading: () => <div style={{ height: '500px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64b5f6' }}>
        Loading 3D model...
    </div>
});

export default function Hero({ data, models3D = [] }) {
    const heroRef = useRef(null);

    // Check if there are any models configured for hero section
    const heroModels = models3D?.filter(model => model.displaySection === 'hero') || [];
    const hasCustomModels = heroModels.length > 0;

    // Debug logging
    console.log('🎭 Hero Component Debug:');
    console.log('- Total models received:', models3D);
    console.log('- Hero models filtered:', heroModels);
    console.log('- Has custom models:', hasCustomModels);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const scrollToContact = () => {
        const element = document.getElementById('contact');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!data) return null;

    return (
        <section id="home" className={styles.hero} ref={heroRef}>
            <div className={styles.background}>
                {data.banner && (
                    <div
                        className={styles.bannerImage}
                        style={{ backgroundImage: `url(${data.banner})` }}
                    />
                )}
                <div className={styles.gradient1}></div>
                <div className={styles.gradient2}></div>
                <div className={styles.gradient3}></div>
            </div>

            {/* Floating Artist Logo */}
            <div className={styles.floatingLogo}>
                <span id="hero-artist-logo" className={styles.artistLogoText} data-text={data.logoText || 'KADAMPAN'}>
                    {data.logoText || 'KADAMPAN'}
                </span>
            </div>

            <div className={`${styles.container} reveal`}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        <span className="gradient-text">{data.title}</span>
                        <br />
                        {data.subtitle}
                    </h1>

                    <p className={styles.subtitle}>
                        {data.description}
                    </p>

                    <div className={styles.buttonGroup}>
                        <button className="btn btn-primary" onClick={scrollToContact}>
                            Get in Touch
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            View My Work
                        </button>
                    </div>
                </div>

                <div className={styles.statsContainer}>
                    <div className={styles.stat}>
                        <h3>{data.stats.experience}</h3>
                        <p>Years Experience</p>
                    </div>
                    <div className={styles.stat}>
                        <h3>{data.stats.projects}</h3>
                        <p>Projects Completed</p>
                    </div>
                    <div className={styles.stat}>
                        <h3>{data.stats.clients}</h3>
                        <p>Happy Clients</p>
                    </div>
                </div>

                {/* YOUR CUSTOM 3D MODELS ONLY - NEON OBJECT REMOVED! */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '500px'
                }}>
                    {hasCustomModels ? (
                        <Models3DDisplay models={heroModels} section="hero" />
                    ) : (
                        <div style={{
                            color: '#64b5f6',
                            textAlign: 'center',
                            padding: '2rem'
                        }}>
                            <h3 style={{ marginBottom: '1rem' }}>🎭 No 3D Model Yet</h3>
                            <p>Upload your model in Admin Dashboard</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>3D Models → Upload → Save</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
