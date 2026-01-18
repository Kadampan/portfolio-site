'use client';

import { useState } from 'react';
import styles from './AdminSection.module.css';

export default function EducationSection({ data, onSave }) {
    const [educationList, setEducationList] = useState(data || []);

    const handleAdd = () => {
        const newEducation = {
            id: `edu${Date.now()}`,
            degree: '',
            institution: '',
            year: '',
            specialization: ''
        };
        setEducationList([...educationList, newEducation]);
    };

    const handleRemove = (id) => {
        if (window.confirm('Are you sure you want to remove this education entry?')) {
            const updatedList = educationList.filter(item => item.id !== id);
            setEducationList(updatedList);
            // Auto-save after removal
            setTimeout(() => {
                onSave(updatedList);
            }, 100);
        }
    };

    const handleChange = (id, field, value) => {
        setEducationList(educationList.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(educationList);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.section}>
            <div className={styles.addSection}>
                <button type="button" onClick={handleAdd} className="btn btn-primary">
                    + Add Education
                </button>
            </div>

            {educationList.map((edu, index) => (
                <div key={edu.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Education #{index + 1}</h3>
                        <button
                            type="button"
                            onClick={() => handleRemove(edu.id)}
                            className={`btn btn-outline ${styles.removeBtn}`}
                        >
                            Remove
                        </button>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Degree / Certificate</label>
                        <input
                            type="text"
                            value={edu.degree || ''}
                            onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                            placeholder="e.g., Bachelor of Computer Science"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>University / Institution</label>
                        <input
                            type="text"
                            value={edu.institution || ''}
                            onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
                            placeholder="e.g., Tech University"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Year</label>
                        <input
                            type="text"
                            value={edu.year || ''}
                            onChange={(e) => handleChange(edu.id, 'year', e.target.value)}
                            placeholder="e.g., 2016 - 2020 or 2019"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Specialization / Details</label>
                        <textarea
                            value={edu.specialization || ''}
                            onChange={(e) => handleChange(edu.id, 'specialization', e.target.value)}
                            placeholder="Details about your specialization, achievements, etc."
                            className={styles.textarea}
                            rows={3}
                        />
                    </div>
                </div>
            ))}

            {educationList.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No education entries yet. Click "Add Education" to get started.</p>
                </div>
            )}

            <button type="submit" className="btn btn-primary">
                Save Changes
            </button>
        </form>
    );
}
