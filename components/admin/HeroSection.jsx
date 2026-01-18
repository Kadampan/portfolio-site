'use client';

import { useState } from 'react';
import styles from './AdminSection.module.css';

export default function HeroSection({ data, onSave }) {
    const [formData, setFormData] = useState(data || {});
    const [uploadingBanner, setUploadingBanner] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleStatsChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                [field]: value
            }
        }));
    };

    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingBanner(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'banner');

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                handleChange('banner', data.path);
                alert('Banner uploaded successfully!');
            } else {
                alert('Failed to upload banner');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('An error occurred during upload');
        } finally {
            setUploadingBanner(false);
        }
    };

    const handleRemoveBanner = () => {
        if (window.confirm('Are you sure you want to remove the banner?')) {
            const updatedData = { ...formData, banner: '' };
            setFormData(updatedData);
            // Auto-save after removal
            setTimeout(() => {
                onSave(updatedData);
            }, 100);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.section}>
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Banner Image</h3>

                {formData.banner && (
                    <div className={styles.imagePreview}>
                        <img src={formData.banner} alt="Banner" />
                        <button
                            type="button"
                            onClick={handleRemoveBanner}
                            className={`btn btn-outline ${styles.removeBtn}`}
                        >
                            Remove Banner
                        </button>
                    </div>
                )}

                <div className={styles.uploadSection}>
                    <label className={`btn ${formData.banner ? 'btn-outline' : 'btn-primary'}`}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            style={{ display: 'none' }}
                            disabled={uploadingBanner}
                        />
                        {uploadingBanner ? 'Uploading...' : (formData.banner ? 'Replace Banner' : 'Add Banner')}
                    </label>
                    <p className={styles.hint}>Recommended size: 1920x1080px</p>
                </div>
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Hero Content</h3>

                <div className={styles.formGroup}>
                    <label>Title</label>
                    <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="e.g., 3D Developer"
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Subtitle</label>
                    <input
                        type="text"
                        value={formData.subtitle || ''}
                        onChange={(e) => handleChange('subtitle', e.target.value)}
                        placeholder="e.g., Bringing Ideas to Life"
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Brief description about you..."
                        className={styles.textarea}
                        rows={3}
                    />
                </div>
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Statistics</h3>

                <div className={styles.statsGrid}>
                    <div className={styles.formGroup}>
                        <label>Years of Experience</label>
                        <input
                            type="text"
                            value={formData.stats?.experience || ''}
                            onChange={(e) => handleStatsChange('experience', e.target.value)}
                            placeholder="e.g., 5+"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Projects Completed</label>
                        <input
                            type="text"
                            value={formData.stats?.projects || ''}
                            onChange={(e) => handleStatsChange('projects', e.target.value)}
                            placeholder="e.g., 50+"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Happy Clients</label>
                        <input
                            type="text"
                            value={formData.stats?.clients || ''}
                            onChange={(e) => handleStatsChange('clients', e.target.value)}
                            placeholder="e.g., 30+"
                            className={styles.input}
                        />
                    </div>
                </div>
            </div>

            <button type="submit" className="btn btn-primary">
                Save Changes
            </button>
        </form>
    );
}
