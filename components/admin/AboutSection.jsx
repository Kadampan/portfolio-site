'use client';

import { useState } from 'react';
import styles from './AdminSection.module.css';

export default function AboutSection({ data, onSave }) {
    const [formData, setFormData] = useState(data || {});
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const formDataObj = new FormData();
        formDataObj.append('image', file);
        formDataObj.append('type', 'about-profile');

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formDataObj
            });

            const data = await res.json();
            if (res.ok) {
                handleChange('image', data.path);
                alert('Profile image uploaded successfully!');
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('An error occurred during upload');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        if (window.confirm('Are you sure you want to remove the profile image?')) {
            const updatedData = { ...formData, image: '' };
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
                <h3 className={styles.cardTitle}>Profile Image</h3>

                {formData.image && (
                    <div className={styles.imagePreview}>
                        <img src={formData.image} alt="Profile" style={{ maxWidth: '300px' }} />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className={`btn btn-outline ${styles.removeBtn}`}
                        >
                            Remove Image
                        </button>
                    </div>
                )}

                <div className={styles.uploadSection}>
                    <label className={`btn ${formData.image ? 'btn-outline' : 'btn-primary'}`}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            disabled={uploadingImage}
                        />
                        {uploadingImage ? 'Uploading...' : (formData.image ? 'Replace Image' : 'Add Image')}
                    </label>
                    <p className={styles.hint}>Recommended size: 800x800px (square)</p>
                </div>
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>About Description</h3>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Write about yourself... Use \n\n for paragraph breaks"
                        className={styles.textarea}
                        rows={12}
                    />
                    <p className={styles.hint}>Use double line breaks (\n\n) to separate paragraphs</p>
                </div>
            </div>

            <button type="submit" className="btn btn-primary">
                Save Changes
            </button>
        </form>
    );
}
