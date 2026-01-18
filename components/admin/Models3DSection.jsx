'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './Models3DSection.module.css';

// Dynamic import for 3D preview
const Custom3DModel = dynamic(() => import('@/components/3d/Custom3DModel'), {
    ssr: false,
    loading: () => <div className={styles.previewLoading}>Loading preview...</div>
});

export default function Models3DSection({ data, onUpdate }) {
    const [models, setModels] = useState(data || []);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saving, setSaving] = useState(false);
    const [expandedModel, setExpandedModel] = useState(null);

    useEffect(() => {
        setModels(data || []);
        setHasUnsavedChanges(false);
    }, [data]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedExtensions = ['.obj', '.fbx', '.gltf', '.glb'];
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExt)) {
            alert(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`);
            return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size too large. Maximum 10MB allowed.');
            return;
        }

        setUploading(true);
        setUploadProgress('Uploading 3D model...');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload-model', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                const newModel = {
                    id: `model_${Date.now()}`,
                    name: file.name.replace(/\.[^/.]+$/, ''),
                    url: result.url,
                    filename: result.filename,
                    animationType: 'rotate',
                    position: [0, 0, 0],
                    scale: 1,
                    enableScroll: true,
                    displaySection: 'hero'
                };

                const updatedModels = [...models, newModel];
                setModels(updatedModels);
                setHasUnsavedChanges(true);
                setUploadProgress('✅ Model uploaded! Click "Save All Changes" to apply.');
                setExpandedModel(newModel.id);
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading 3D model:', error);
            setUploadProgress('❌ Error: ' + error.message);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            await onUpdate(models);
            setHasUnsavedChanges(false);
            alert('✅ All changes saved successfully!');
        } catch (error) {
            console.error('Error saving:', error);
            alert('❌ Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (modelId, filename) => {
        if (!confirm('Are you sure you want to delete this 3D model?')) return;

        try {
            const response = await fetch(`/api/upload-model?filename=${filename}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedModels = models.filter(m => m.id !== modelId);
                setModels(updatedModels);
                setHasUnsavedChanges(true);
            }
        } catch (error) {
            console.error('Error deleting model:', error);
            alert('Failed to delete model');
        }
    };

    const handleModelUpdate = (modelId, field, value) => {
        const updatedModels = models.map(model => {
            if (model.id === modelId) {
                return { ...model, [field]: value };
            }
            return model;
        });
        setModels(updatedModels);
        setHasUnsavedChanges(true);
    };

    const handlePositionUpdate = (modelId, axis, value) => {
        const updatedModels = models.map(model => {
            if (model.id === modelId) {
                const newPosition = [...model.position];
                const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
                newPosition[axisIndex] = parseFloat(value) || 0;
                return { ...model, position: newPosition };
            }
            return model;
        });
        setModels(updatedModels);
        setHasUnsavedChanges(true);
    };

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <div>
                    <h2>3D Models Manager</h2>
                    <p className={styles.description}>
                        Upload and manage your custom 3D models (.obj, .fbx, .gltf, .glb) with scroll-based animations
                    </p>
                </div>

                {hasUnsavedChanges && (
                    <button
                        className={`${styles.saveButton} ${saving ? styles.saving : ''}`}
                        onClick={handleSaveAll}
                        disabled={saving}
                    >
                        {saving ? '💾 Saving...' : '💾 Save All Changes'}
                    </button>
                )}
            </div>

            {/* Upload Section */}
            <div className={styles.uploadSection}>
                <label className={`${styles.uploadButton} ${uploading ? styles.uploading : ''}`}>
                    <input
                        type="file"
                        accept=".obj,.fbx,.gltf,.glb"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                    {uploading ? '⏳ Uploading...' : '+ Upload 3D Model'}
                </label>
                {uploadProgress && (
                    <p className={`${styles.uploadProgress} ${uploadProgress.includes('✅') ? styles.success : uploadProgress.includes('❌') ? styles.error : ''}`}>
                        {uploadProgress}
                    </p>
                )}
            </div>

            {/* Models Count */}
            <div className={styles.statsBar}>
                <span>📊 Total Models: <strong>{models.length}</strong></span>
                <span>🎭 Hero Section: <strong>{models.filter(m => m.displaySection === 'hero').length}</strong></span>
                <span>📍 Floating: <strong>{models.filter(m => m.displaySection === 'floating').length}</strong></span>
            </div>

            {/* Models List */}
            <div className={styles.modelsList}>
                {models.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🎭</div>
                        <h3>No 3D models uploaded yet</h3>
                        <p>Upload your first model to get started!</p>
                        <ul className={styles.tips}>
                            <li>✅ Supported: .obj, .fbx, .gltf, .glb</li>
                            <li>✅ Max size: 10MB</li>
                            <li>✅ Recommended: GLB format</li>
                        </ul>
                    </div>
                ) : (
                    models.map((model) => (
                        <div key={model.id} className={`${styles.modelCard} ${expandedModel === model.id ? styles.expanded : ''}`}>
                            <div className={styles.modelHeader} onClick={() => setExpandedModel(expandedModel === model.id ? null : model.id)}>
                                <div className={styles.modelTitle}>
                                    <h3>{model.name}</h3>
                                    <span className={styles.badge}>{model.displaySection}</span>
                                </div>
                                <div className={styles.headerActions}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(model.id, model.filename); }}
                                        className={styles.deleteButton}
                                        title="Delete model"
                                    >
                                        🗑️ Delete
                                    </button>
                                    <span className={styles.expandIcon}>
                                        {expandedModel === model.id ? '▼' : '▶'}
                                    </span>
                                </div>
                            </div>

                            {expandedModel === model.id && (
                                <div className={styles.modelContent}>
                                    {/* 3D Preview */}
                                    <div className={styles.previewSection}>
                                        <h4>Preview</h4>
                                        <div className={styles.preview3D}>
                                            <Custom3DModel
                                                modelUrl={model.url}
                                                animationType={model.animationType}
                                                position={model.position}
                                                scale={model.scale}
                                                height="300px"
                                                enableScroll={false}
                                            />
                                        </div>
                                    </div>

                                    {/* Settings */}
                                    <div className={styles.modelSettings}>
                                        <div className={styles.formGroup}>
                                            <label>Model Name:</label>
                                            <input
                                                type="text"
                                                value={model.name}
                                                onChange={(e) => handleModelUpdate(model.id, 'name', e.target.value)}
                                                placeholder="Enter model name"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Animation Type:</label>
                                            <select
                                                value={model.animationType}
                                                onChange={(e) => handleModelUpdate(model.id, 'animationType', e.target.value)}
                                            >
                                                <option value="rotate">🔄 Rotate (Smooth Spin)</option>
                                                <option value="float">⬆️ Float (Up/Down)</option>
                                                <option value="scale">📏 Scale (Pulse)</option>
                                                <option value="spin">🌀 Spin (Multi-axis)</option>
                                                <option value="none">⏸️ None (Static)</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Display Section:</label>
                                            <select
                                                value={model.displaySection}
                                                onChange={(e) => handleModelUpdate(model.id, 'displaySection', e.target.value)}
                                            >
                                                <option value="hero">🏠 Hero Section (Main)</option>
                                                <option value="about">👤 About Section</option>
                                                <option value="works">🎨 Works Section</option>
                                                <option value="floating">📍 Floating (Fixed)</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Scale: {model.scale}x</label>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="5"
                                                step="0.1"
                                                value={model.scale}
                                                onChange={(e) => handleModelUpdate(model.id, 'scale', parseFloat(e.target.value))}
                                                className={styles.slider}
                                            />
                                            <div className={styles.sliderLabels}>
                                                <span>0.1x</span>
                                                <span>5.0x</span>
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Position (X, Y, Z):</label>
                                            <div className={styles.positionInputs}>
                                                <input
                                                    type="number"
                                                    placeholder="X"
                                                    step="0.1"
                                                    value={model.position[0]}
                                                    onChange={(e) => handlePositionUpdate(model.id, 'x', e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Y"
                                                    step="0.1"
                                                    value={model.position[1]}
                                                    onChange={(e) => handlePositionUpdate(model.id, 'y', e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Z"
                                                    step="0.1"
                                                    value={model.position[2]}
                                                    onChange={(e) => handlePositionUpdate(model.id, 'z', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={model.enableScroll}
                                                    onChange={(e) => handleModelUpdate(model.id, 'enableScroll', e.target.checked)}
                                                />
                                                🌊 Enable Scroll Animation
                                            </label>
                                        </div>

                                        <div className={styles.modelInfo}>
                                            <small>📁 File: {model.filename}</small>
                                            <small>🔗 URL: {model.url}</small>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Save Button */}
            {hasUnsavedChanges && models.length > 0 && (
                <div className={styles.bottomBar}>
                    <button
                        className={`${styles.saveButtonLarge} ${saving ? styles.saving : ''}`}
                        onClick={handleSaveAll}
                        disabled={saving}
                    >
                        {saving ? '💾 Saving Changes...' : '💾 Save All Changes'}
                    </button>
                </div>
            )}
        </div>
    );
}
