'use client';

import { useState } from 'react';
import styles from './AdminSection.module.css';

export default function WorksSection({ data, onSave }) {
    const [worksList, setWorksList] = useState(data || []);
    const [uploadingImages, setUploadingImages] = useState({});

    const handleAdd = () => {
        const newWork = {
            id: `work${Date.now()}`,
            title: '',
            description: '',
            image: '',
            tools: ''
        };
        setWorksList([...worksList, newWork]);
    };

    const handleRemove = (id) => {
        if (window.confirm('Are you sure you want to remove this work?')) {
            const updatedList = worksList.filter(item => item.id !== id);
            setWorksList(updatedList);
            // Auto-save after removal
            setTimeout(() => {
                onSave(updatedList);
            }, 100);
        }
    };

    const handleChange = (id, field, value) => {
        setWorksList(worksList.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleImageUpload = async (id, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImages(prev => ({ ...prev, [id]: true }));
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'work');

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
                handleChange(id, 'image', data.path);
                alert('Image uploaded successfully!');
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('An error occurred during upload');
        } finally {
            setUploadingImages(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleRemoveImage = (id) => {
        if (window.confirm('Are you sure you want to remove this image?')) {
            handleChange(id, 'image', '');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(worksList);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.section}>
            <div className={styles.addSection}>
                <button type="button" onClick={handleAdd} className="btn btn-primary">
                    + Add Work
                </button>
            </div>

            {worksList.map((work, index) => (
                <div key={work.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Work #{index + 1}</h3>
                        <button
                            type="button"
                            onClick={() => handleRemove(work.id)}
                            className={`btn btn-outline ${styles.removeBtn}`}
                        >
                            Remove
                        </button>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Work Image</label>
                        {work.image && (
                            <div className={styles.imagePreview}>
                                <img src={work.image} alt={work.title} />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(work.id)}
                                    className={`btn btn-outline ${styles.removeBtn}`}
                                >
                                    Remove Image
                                </button>
                            </div>
                        )}
                        <label className={`btn ${work.image ? 'btn-outline' : 'btn-primary'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(work.id, e)}
                                style={{ display: 'none' }}
                                disabled={uploadingImages[work.id]}
                            />
                            {uploadingImages[work.id] ? 'Uploading...' : (work.image ? 'Replace Image' : 'Add Image')}
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Title</label>
                        <input
                            type="text"
                            value={work.title || ''}
                            onChange={(e) => handleChange(work.id, 'title', e.target.value)}
                            placeholder="e.g., Cyberpunk City"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            value={work.description || ''}
                            onChange={(e) => handleChange(work.id, 'description', e.target.value)}
                            placeholder="Describe your work..."
                            className={styles.textarea}
                            rows={4}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Tools Used</label>
                        <input
                            type="text"
                            value={work.tools || ''}
                            onChange={(e) => handleChange(work.id, 'tools', e.target.value)}
                            placeholder="e.g., Blender, Unity, Substance Painter (comma-separated)"
                            className={styles.input}
                        />
                    </div>
                </div>
            ))}

            {worksList.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No works yet. Click "Add Work" to showcase your projects.</p>
                </div>
            )}

            <button type="submit" className="btn btn-primary">
                Save Changes
            </button>
        </form>
    );
}
