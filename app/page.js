'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Education from '@/components/Education';
import Tools from '@/components/Tools';
import Experience from '@/components/Experience';
import Works from '@/components/Works';
import Contact from '@/components/Contact';

// Dynamically import 3D components to avoid SSR issues
const FloatingBackground = dynamic(() => import('@/components/3d/FloatingBackground'), {
  ssr: false,
  loading: () => <div style={{ position: 'fixed', width: '100%', height: '100vh', background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 100%)', zIndex: -1 }} />
});

const ScrollAnimation = dynamic(() => import('@/components/3d/ScrollAnimation'), {
  ssr: false
});

const Models3DDisplay = dynamic(() => import('@/components/3d/Models3DDisplay'), {
  ssr: false
});

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const portfolioData = await res.json();
      setData(portfolioData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontSize: 'var(--font-size-xl)'
      }}>
        Loading...
      </div>
    );
  }

  if (!data) {
    return <div>Error loading portfolio data</div>;
  }

  return (
    <main>
      {/* 3D Animated Background */}
      <FloatingBackground />

      {/* Your custom 3D models with scroll effects will appear in Hero section */}

      <Navbar />
      <Hero data={data.hero} models3D={data['3dModels']} />
      <About data={data.about} />
      <Education data={data.education} />
      <Tools data={data.tools} />
      <Experience data={data.experience} />
      <Works data={data.works} />
      <Contact data={data.contact} />

      {/* Display uploaded 3D models configured as floating */}
      {data['3dModels'] && data['3dModels'].length > 0 && (
        <Models3DDisplay models={data['3dModels']} section="floating" />
      )}

      <footer style={{
        background: 'var(--color-bg-primary)',
        padding: 'var(--spacing-xl) 0',
        textAlign: 'center',
        borderTop: '1px solid var(--color-glass-border)'
      }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          © Kadampan, My Portfolio
        </p>
      </footer>
    </main>
  );
}
