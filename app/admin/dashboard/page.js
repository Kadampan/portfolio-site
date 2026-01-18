'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import HeroSection from '@/components/admin/HeroSection';
import AboutSection from '@/components/admin/AboutSection';
import EducationSection from '@/components/admin/EducationSection';
import ToolsSection from '@/components/admin/ToolsSection';
import ExperienceSection from '@/components/admin/ExperienceSection';
import WorksSection from '@/components/admin/WorksSection';
import ContactSection from '@/components/admin/ContactSection';
import Models3DSection from '@/components/admin/Models3DSection';
import SettingsSection from '@/components/admin/SettingsSection';
import ThemeSection from '@/components/admin/ThemeSection';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('home');
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        fetchPortfolioData();
    }, []);

    const fetchPortfolioData = async () => {
        try {
            const res = await fetch('/api/portfolio');
            const data = await res.json();
            setPortfolioData(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch portfolio data:', error);
            setLoading(false);
        }
    };

    const savePortfolioData = async (updatedData) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/portfolio', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(updatedData)
            });

            if (res.ok) {
                setPortfolioData(updatedData);
                alert('Changes saved successfully!');
            } else {
                alert('Failed to save changes');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('An error occurred while saving');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading admin dashboard...</p>
            </div>
        );
    }

    const tabs = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'about', label: 'About', icon: '👤' },
        { id: 'education', label: 'Education', icon: '🎓' },
        { id: 'tools', label: 'Tools', icon: '🛠️' },
        { id: 'experience', label: 'Experience', icon: '💼' },
        { id: 'works', label: 'Works', icon: '🎨' },
        { id: '3dmodels', label: '3D Models', icon: '🎭' },
        { id: 'contact', label: 'Contact', icon: '📧' },
        { id: 'theme', label: 'Theme', icon: '🎨' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <div className={styles.dashboard}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className="gradient-text">Admin Panel</h2>
                    <p>Portfolio Manager</p>
                </div>

                <nav className={styles.nav}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className={styles.icon}>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <button className={`btn btn-outline ${styles.logoutBtn}`} onClick={handleLogout}>
                        Logout
                    </button>
                    <a href="/" target="_blank" className={styles.viewSite}>
                        View Portfolio →
                    </a>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <div className={styles.contentHeader}>
                    <h1>{tabs.find(t => t.id === activeTab)?.label} Settings</h1>
                    {isSaving && <span className={styles.savingIndicator}>Saving...</span>}
                </div>

                <div className={styles.contentBody}>
                    {activeTab === 'home' && (
                        <HeroSection data={portfolioData?.hero} onSave={(data) => savePortfolioData({ ...portfolioData, hero: data })} />
                    )}
                    {activeTab === 'about' && (
                        <AboutSection data={portfolioData?.about} onSave={(data) => savePortfolioData({ ...portfolioData, about: data })} />
                    )}
                    {activeTab === 'education' && (
                        <EducationSection data={portfolioData?.education} onSave={(data) => savePortfolioData({ ...portfolioData, education: data })} />
                    )}
                    {activeTab === 'tools' && (
                        <ToolsSection data={portfolioData?.tools} onSave={(data) => savePortfolioData({ ...portfolioData, tools: data })} />
                    )}
                    {activeTab === 'experience' && (
                        <ExperienceSection data={portfolioData?.experience} onSave={(data) => savePortfolioData({ ...portfolioData, experience: data })} />
                    )}
                    {activeTab === 'works' && (
                        <WorksSection data={portfolioData?.works} onSave={(data) => savePortfolioData({ ...portfolioData, works: data })} />
                    )}
                    {activeTab === '3dmodels' && (
                        <Models3DSection data={portfolioData?.['3dModels']} onUpdate={(data) => savePortfolioData({ ...portfolioData, '3dModels': data })} />
                    )}
                    {activeTab === 'contact' && (
                        <ContactSection data={portfolioData?.contact} onSave={(data) => savePortfolioData({ ...portfolioData, contact: data })} />
                    )}
                    {activeTab === 'theme' && (
                        <ThemeSection />
                    )}
                    {activeTab === 'settings' && (
                        <SettingsSection />
                    )}
                </div>
            </main>
        </div>
    );
}
