'use client';

import { useState } from 'react';
import styles from './AdminSection.module.css';

export default function ContactSection({ data, onSave }) {
    const [formData, setFormData] = useState(data || {});

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.section}>
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Contact Information</h3>

                <div className={styles.formGroup}>
                    <label>Recipient Email (For Contact Form)</label>
                    <input
                        type="email"
                        value={formData.recipientEmail || formData.email || ''}
                        onChange={(e) => handleChange('recipientEmail', e.target.value)}
                        placeholder="email@example.com"
                        className={styles.input}
                    />
                    <small style={{ color: '#888', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        This email will receive messages from the contact form. If not set, the Email field below will be used.
                    </small>
                </div>

                <div className={styles.formGroup}>
                    <label>Email (Display)</label>
                    <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className={styles.input}
                    />
                    <small style={{ color: '#888', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        This email is displayed publicly on your contact page.
                    </small>
                </div>

                <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+123 456 7890"
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Location</label>
                    <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="Your City, Country"
                        className={styles.input}
                    />
                </div>
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Social Links</h3>

                <div className={styles.formGroup}>
                    <label>LinkedIn URL</label>
                    <input
                        type="url"
                        value={formData.linkedin || ''}
                        onChange={(e) => handleChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>ArtStation URL</label>
                    <input
                        type="url"
                        value={formData.artstation || ''}
                        onChange={(e) => handleChange('artstation', e.target.value)}
                        placeholder="https://www.artstation.com/yourprofile"
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>GitHub URL</label>
                    <input
                        type="url"
                        value={formData.github || ''}
                        onChange={(e) => handleChange('github', e.target.value)}
                        placeholder="https://github.com/yourusername"
                        className={styles.input}
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-primary">
                Save Changes
            </button>
        </form>
    );
}
