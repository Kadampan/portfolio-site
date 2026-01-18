'use client';

import { useState, useEffect } from 'react';
import styles from './FontManager.module.css';

export default function FontManager({ onFontsUpdate }) {
    const [fonts, setFonts] = useState({ customFonts: [], systemFonts: [] });
    const [uploading, setUploading] = useState(false);
    const [fontName, setFontName] = useState('');
    const [fontFile, setFontFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchFonts();
    }, []);

    const fetchFonts = async () => {
        try {
            const res = await fetch('/api/fonts');
            const data = await res.json();
            setFonts(data);
            if (onFontsUpdate) onFontsUpdate(data);
        } catch (error) {
            console.error('Failed to fetch fonts:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validExtensions = ['ttf', 'otf', 'woff', 'woff2'];
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (!validExtensions.includes(fileExtension)) {
                setMessage({
                    type: 'error',
                    text: 'Invalid file type. Please use .ttf, .otf, .woff, or .woff2'
                });
                return;
            }

            setFontFile(file);
            // Auto-fill font name from filename if empty
            if (!fontName) {
                const name = file.name.split('.')[0].replace(/[-_]/g, ' ');
                setFontName(name);
            }
            setMessage({ type: '', text: '' });
        }
    };

    const handleUpload = async () => {
        if (!fontFile || !fontName.trim()) {
            setMessage({ type: 'error', text: 'Please provide both font name and file' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('font', fontFile);
            formData.append('fontName', fontName.trim());

            const res = await fetch('/api/fonts', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Font uploaded successfully!' });
                setFontName('');
                setFontFile(null);
                // Reset file input
                document.getElementById('fontFileInput').value = '';
                // Refresh fonts list
                await fetchFonts();
            } else {
                setMessage({ type: 'error', text: data.error || 'Upload failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred during upload' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (fontName) => {
        if (!confirm(`Are you sure you want to delete the font "${fontName}"?`)) {
            return;
        }

        try {
            const res = await fetch('/api/fonts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fontName })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Font deleted successfully' });
                await fetchFonts();
            } else {
                setMessage({ type: 'error', text: data.error || 'Delete failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete font' });
        }
    };

    return (
        <div className={styles.fontManager}>
            <div className={styles.header}>
                <h3>Font Library</h3>
                <p>Upload custom fonts to use in your theme</p>
            </div>

            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            {/* Upload Section */}
            <div className={styles.uploadSection}>
                <h4>📤 Upload New Font</h4>

                <div className={styles.uploadForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="fontName">Font Name</label>
                        <input
                            type="text"
                            id="fontName"
                            value={fontName}
                            onChange={(e) => setFontName(e.target.value)}
                            placeholder="e.g., My Custom Font"
                            disabled={uploading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="fontFileInput">Font File</label>
                        <div className={styles.fileInputWrapper}>
                            <input
                                type="file"
                                id="fontFileInput"
                                accept=".ttf,.otf,.woff,.woff2"
                                onChange={handleFileChange}
                                disabled={uploading}
                                className={styles.fileInput}
                            />
                            <label htmlFor="fontFileInput" className={styles.fileLabel}>
                                {fontFile ? (
                                    <>
                                        <span className={styles.fileName}>📁 {fontFile.name}</span>
                                        <span className={styles.fileSize}>
                                            ({(fontFile.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span>Choose Font File</span>
                                        <span className={styles.fileTypes}>.ttf, .otf, .woff, .woff2</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading || !fontFile || !fontName.trim()}
                        className="btn btn-primary"
                    >
                        {uploading ? 'Uploading...' : 'Upload Font'}
                    </button>
                </div>

                <div className={styles.instructions}>
                    <h5>💡 How to use:</h5>
                    <ol>
                        <li>Enter a name for your font</li>
                        <li>Choose a font file (.ttf, .otf, .woff, or .woff2)</li>
                        <li>Click "Upload Font"</li>
                        <li>Your font will appear in all font selection dropdowns!</li>
                    </ol>
                </div>
            </div>

            {/* Font Lists */}
            <div className={styles.fontLists}>
                {/* Custom Fonts */}
                <div className={styles.fontList}>
                    <h4>🎨 Your Custom Fonts ({fonts.customFonts?.length || 0})</h4>

                    {fonts.customFonts?.length > 0 ? (
                        <div className={styles.fontItems}>
                            {fonts.customFonts.map((font, index) => (
                                <div key={index} className={styles.fontItem}>
                                    <div className={styles.fontInfo}>
                                        <span className={styles.fontNameDisplay} style={{ fontFamily: font.name }}>
                                            {font.name}
                                        </span>
                                        <span className={styles.fontMeta}>
                                            {font.format.toUpperCase()} • {new Date(font.uploadedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(font.name)}
                                        className={styles.deleteBtn}
                                        title="Delete font"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyState}>No custom fonts uploaded yet</p>
                    )}
                </div>

                {/* System Fonts */}
                <div className={styles.fontList}>
                    <h4>💻 Available System Fonts ({fonts.systemFonts?.length || 0})</h4>
                    <div className={styles.systemFonts}>
                        {fonts.systemFonts?.map((font, index) => (
                            <span key={index} className={styles.systemFont}>
                                {font}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
