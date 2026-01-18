'use client';

import { useState } from 'react';
import styles from './AdminSection.module.css';

export default function ExperienceSection({ data, onSave }) {
    const [experienceList, setExperienceList] = useState(data || []);

    const handleAdd = () => {
        const newExperience = {
            id: `exp${Date.now()}`,
            title: '',
            company: '',
            year: '',
            works: ''
        };
        setExperienceList([...experienceList, newExperience]);
    };

    const handleRemove = (id) => {
        if (window.confirm('Are you sure you want to remove this experience entry?')) {
            const updatedList = experienceList.filter(item => item.id !== id);
            setExperienceList(updatedList);
            // Auto-save after removal
            setTimeout(() => {
                onSave(updatedList);
            }, 100);
        }
    };

    const handleChange = (id, field, value) => {
        setExperienceList(experienceList.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(experienceList);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.section}>
            <div className={styles.addSection}>
                <button type="button" onClick={handleAdd} className="btn btn-primary">
                    + Add Experience
                </button>
            </div>

            {experienceList.map((exp, index) => (
                <div key={exp.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Experience #{index + 1}</h3>
                        <button
                            type="button"
                            onClick={() => handleRemove(exp.id)}
                            className={`btn btn-outline ${styles.removeBtn}`}
                        >
                            Remove
                        </button>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Job Title</label>
                        <input
                            type="text"
                            value={exp.title || ''}
                            onChange={(e) => handleChange(exp.id, 'title', e.target.value)}
                            placeholder="e.g., Senior 3D Developer"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Company</label>
                        <input
                            type="text"
                            value={exp.company || ''}
                            onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                            placeholder="e.g., Tech Studios Inc."
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Year / Period</label>
                        <input
                            type="text"
                            value={exp.year || ''}
                            onChange={(e) => handleChange(exp.id, 'year', e.target.value)}
                            placeholder="e.g., 2022 - Present or 2020 - 2022"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Work Description</label>
                        <textarea
                            value={exp.works || ''}
                            onChange={(e) => handleChange(exp.id, 'works', e.target.value)}
                            placeholder="Describe your responsibilities and achievements... Use \n for line breaks"
                            className={styles.textarea}
                            rows={6}
                        />
                        <p className={styles.hint}>Use \n for line breaks to create bullet points</p>
                    </div>
                </div>
            ))}

            {experienceList.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No experience entries yet. Click "Add Experience" to get started.</p>
                </div>
            )}

            <button type="submit" className="btn btn-primary">
                Save Changes
            </button>
        </form>
    );
}
