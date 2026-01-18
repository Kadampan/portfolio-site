'use client';

import { useState } from 'react';
import styles from './AdminSection.module.css';

export default function ToolsSection({ data, onSave }) {
    const [toolsList, setToolsList] = useState(data || []);

    const handleAdd = () => {
        const newTool = {
            id: `tool${Date.now()}`,
            category: '',
            items: []
        };
        setToolsList([...toolsList, newTool]);
    };

    const handleRemove = (id) => {
        if (window.confirm('Are you sure you want to remove this tool category?')) {
            const updatedList = toolsList.filter(item => item.id !== id);
            setToolsList(updatedList);
            // Auto-save after removal
            setTimeout(() => {
                onSave(updatedList);
            }, 100);
        }
    };

    const handleChange = (id, field, value) => {
        setToolsList(toolsList.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleItemsChange = (id, itemsString) => {
        // Convert comma-separated string to array
        const itemsArray = itemsString.split(',').map(item => item.trim()).filter(item => item);
        handleChange(id, 'items', itemsArray);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(toolsList);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.section}>
            <div className={styles.addSection}>
                <button type="button" onClick={handleAdd} className="btn btn-primary">
                    + Add Tool Category
                </button>
            </div>

            {toolsList.map((tool, index) => (
                <div key={tool.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Tool Category #{index + 1}</h3>
                        <button
                            type="button"
                            onClick={() => handleRemove(tool.id)}
                            className={`btn btn-outline ${styles.removeBtn}`}
                        >
                            Remove
                        </button>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Category Title</label>
                        <input
                            type="text"
                            value={tool.category || ''}
                            onChange={(e) => handleChange(tool.id, 'category', e.target.value)}
                            placeholder="e.g., 3D Software, Game Engines, Programming"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Tools (comma-separated)</label>
                        <textarea
                            value={tool.items?.join(', ') || ''}
                            onChange={(e) => handleItemsChange(tool.id, e.target.value)}
                            placeholder="e.g., Blender, Maya, 3ds Max, Cinema 4D"
                            className={styles.textarea}
                            rows={3}
                        />
                        <p className={styles.hint}>Separate each tool with a comma</p>
                    </div>

                    {tool.items && tool.items.length > 0 && (
                        <div className={styles.previewTags}>
                            {tool.items.map((item, idx) => (
                                <span key={idx} className={styles.tag}>{item}</span>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {toolsList.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No tool categories yet. Click "Add Tool Category" to get started.</p>
                </div>
            )}

            <button type="submit" className="btn btn-primary">
                Save Changes
            </button>
        </form>
    );
}
