'use client';

import { useState, useEffect } from 'react';
import styles from './ThemeSection.module.css';
import FontManager from './FontManager';

export default function ThemeSection() {
    const [theme, setTheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('logo');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [availableFonts, setAvailableFonts] = useState({ customFonts: [], systemFonts: [] });

    useEffect(() => {
        fetchTheme();
        fetchFonts();
    }, []);

    const fetchTheme = async () => {
        try {
            const res = await fetch('/api/theme');
            const data = await res.json();
            setTheme(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch theme:', error);
            setLoading(false);
        }
    };

    const fetchFonts = async () => {
        try {
            const res = await fetch('/api/fonts');
            const data = await res.json();
            setAvailableFonts(data);
        } catch (error) {
            console.error('Failed to fetch fonts:', error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(theme)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Theme saved! Refresh to see changes.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to save theme' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setSaving(false);
        }
    };

    const updateTheme = (category, field, value) => {
        setTheme(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const updateNestedTheme = (category, nested, field, value) => {
        setTheme(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [nested]: {
                    ...prev[category][nested],
                    [field]: value
                }
            }
        }));
    };

    const updateArrayColor = (category, field, index, value) => {
        const newColors = [...theme[category][field]];
        newColors[index] = value;
        updateTheme(category, field, newColors);
    };

    // Helper function to render all font options
    const renderFontOptions = () => {
        const allFonts = [
            ...availableFonts.systemFonts,
            ...availableFonts.customFonts.map(f => f.name)
        ];

        return allFonts.map((font, index) => (
            <option key={index} value={font}>{font}</option>
        ));
    };

    if (loading) return <div className={styles.loading}>Loading theme settings...</div>;

    const tabs = [
        { id: 'fonts', label: 'Fonts', icon: '🔤' },
        { id: 'logo', label: 'Logo', icon: '🎨' },
        { id: 'headings', label: 'Headings', icon: '📝' },
        { id: 'sectionTitles', label: 'Section Titles', icon: '🏷️' },
        { id: 'buttons', label: 'Buttons', icon: '🔘' },
        { id: 'navLinks', label: 'Navigation', icon: '🧭' },
        { id: 'hyperlinks', label: 'Links', icon: '🔗' },
        { id: 'globalColors', label: 'Colors', icon: '🌈' }
    ];

    return (
        <div className={styles.themeSection}>
            <div className={styles.header}>
                <h2>Theme Customization</h2>
                <p>Customize fonts, colors, animations, and more</p>
            </div>

            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className={styles.tabIcon}>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </aside>

                <main className={styles.content}>
                    {/* FONTS MANAGER */}
                    {activeTab === 'fonts' && (
                        <FontManager onFontsUpdate={setAvailableFonts} />
                    )}

                    {/* LOGO SETTINGS */}
                    {activeTab === 'logo' && theme.logo && (
                        <div className={styles.panel}>
                            <h3>Logo Settings</h3>

                            <div className={styles.formGroup}>
                                <label>Logo Text</label>
                                <input
                                    type="text"
                                    value={theme.logo.text}
                                    onChange={(e) => updateTheme('logo', 'text', e.target.value)}
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Font Family</label>
                                    <select
                                        value={theme.logo.fontFamily}
                                        onChange={(e) => updateTheme('logo', 'fontFamily', e.target.value)}
                                    >
                                        {renderFontOptions()}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Font Size</label>
                                    <input
                                        type="text"
                                        value={theme.logo.fontSize}
                                        onChange={(e) => updateTheme('logo', 'fontSize', e.target.value)}
                                        placeholder="e.g., 2.4rem"
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Letter Spacing</label>
                                    <input
                                        type="text"
                                        value={theme.logo.letterSpacing}
                                        onChange={(e) => updateTheme('logo', 'letterSpacing', e.target.value)}
                                        placeholder="e.g., 0.12em"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Text Transform</label>
                                    <select
                                        value={theme.logo.textTransform}
                                        onChange={(e) => updateTheme('logo', 'textTransform', e.target.value)}
                                    >
                                        <option value="none">None</option>
                                        <option value="uppercase">Uppercase</option>
                                        <option value="lowercase">Lowercase</option>
                                        <option value="capitalize">Capitalize</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Gradient Colors (6 colors for smooth flow)</label>
                                <div className={styles.colorGrid}>
                                    {theme.logo.gradientColors.map((color, index) => (
                                        <div key={index} className={styles.colorInput}>
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => updateArrayColor('logo', 'gradientColors', index, e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={color}
                                                onChange={(e) => updateArrayColor('logo', 'gradientColors', index, e.target.value)}
                                                placeholder="#000000"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.section}>
                                <h4>Animation Settings</h4>
                                <div className={styles.row}>
                                    <div className={styles.formGroupfull}>
                                        <label className={styles.checkbox}>
                                            <input
                                                type="checkbox"
                                                checked={theme.logo.animation.enabled}
                                                onChange={(e) => updateNestedTheme('logo', 'animation', 'enabled', e.target.checked)}
                                            />
                                            <span>Enable Animation</span>
                                        </label>
                                    </div>
                                </div>

                                {theme.logo.animation.enabled && (
                                    <>
                                        <div className={styles.row}>
                                            <div className={styles.formGroup}>
                                                <label>Animation Speed</label>
                                                <input
                                                    type="text"
                                                    value={theme.logo.animation.speed}
                                                    onChange={(e) => updateNestedTheme('logo', 'animation', 'speed', e.target.value)}
                                                    placeholder="e.g., 3s"
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.checkbox}>
                                                    <input
                                                        type="checkbox"
                                                        checked={theme.logo.animation.pulseEnabled}
                                                        onChange={(e) => updateNestedTheme('logo', 'animation', 'pulseEnabled', e.target.checked)}
                                                    />
                                                    <span>Pulse Effect</span>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className={styles.section}>
                                <h4>Glow Settings</h4>
                                <div className={styles.formGroup}>
                                    <label className={styles.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={theme.logo.glow.enabled}
                                            onChange={(e) => updateNestedTheme('logo', 'glow', 'enabled', e.target.checked)}
                                        />
                                        <span>Enable Glow</span>
                                    </label>
                                </div>

                                {theme.logo.glow.enabled && (
                                    <div className={styles.row}>
                                        <div className={styles.formGroup}>
                                            <label>Glow Color</label>
                                            <div className={styles.colorPicker}>
                                                <input
                                                    type="color"
                                                    value={theme.logo.glow.color}
                                                    onChange={(e) => updateNestedTheme('logo', 'glow', 'color', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    value={theme.logo.glow.color}
                                                    onChange={(e) => updateNestedTheme('logo', 'glow', 'color', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Intensity</label>
                                            <select
                                                value={theme.logo.glow.intensity}
                                                onChange={(e) => updateNestedTheme('logo', 'glow', 'intensity', e.target.value)}
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* HEADINGS SETTINGS */}
                    {activeTab === 'headings' && theme.headings && (
                        <div className={styles.panel}>
                            <h3>Heading Styles (H1-H6)</h3>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Font Family</label>
                                    <select
                                        value={theme.headings.fontFamily}
                                        onChange={(e) => updateTheme('headings', 'fontFamily', e.target.value)}
                                    >
                                        {renderFontOptions()}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Font Weight</label>
                                    <select
                                        value={theme.headings.fontWeight}
                                        onChange={(e) => updateTheme('headings', 'fontWeight', e.target.value)}
                                    >
                                        <option value="400">Regular (400)</option>
                                        <option value="500">Medium (500)</option>
                                        <option value="600">Semibold (600)</option>
                                        <option value="700">Bold (700)</option>
                                        <option value="800">Extra Bold (800)</option>
                                        <option value="900">Black (900)</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Letter Spacing</label>
                                    <input
                                        type="text"
                                        value={theme.headings.letterSpacing}
                                        onChange={(e) => updateTheme('headings', 'letterSpacing', e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Text Color</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.headings.color}
                                            onChange={(e) => updateTheme('headings', 'color', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.headings.color}
                                            onChange={(e) => updateTheme('headings', 'color', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.section}>
                                <h4>Individual Heading Sizes</h4>
                                <div className={styles.row}>
                                    <div className={styles.formGroup}>
                                        <label>H1 Size</label>
                                        <input type="text" value={theme.headings.h1Size} onChange={(e) => updateTheme('headings', 'h1Size', e.target.value)} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>H2 Size</label>
                                        <input type="text" value={theme.headings.h2Size} onChange={(e) => updateTheme('headings', 'h2Size', e.target.value)} />
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.formGroup}>
                                        <label>H3 Size</label>
                                        <input type="text" value={theme.headings.h3Size} onChange={(e) => updateTheme('headings', 'h3Size', e.target.value)} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>H4 Size</label>
                                        <input type="text" value={theme.headings.h4Size} onChange={(e) => updateTheme('headings', 'h4Size', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION TITLES */}
                    {activeTab === 'sectionTitles' && theme.sectionTitles && (
                        <div className={styles.panel}>
                            <h3>Section Title Styles</h3>
                            <p className={styles.description}>Customize "About Me", "Education", "Get In Touch", etc.</p>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Font Family</label>
                                    <select
                                        value={theme.sectionTitles.fontFamily}
                                        onChange={(e) => updateTheme('sectionTitles', 'fontFamily', e.target.value)}
                                    >
                                        {renderFontOptions()}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Font Size</label>
                                    <input
                                        type="text"
                                        value={theme.sectionTitles.fontSize}
                                        onChange={(e) => updateTheme('sectionTitles', 'fontSize', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Letter Spacing</label>
                                    <input
                                        type="text"
                                        value={theme.sectionTitles.letterSpacing}
                                        onChange={(e) => updateTheme('sectionTitles', 'letterSpacing', e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Text Transform</label>
                                    <select
                                        value={theme.sectionTitles.textTransform}
                                        onChange={(e) => updateTheme('sectionTitles', 'textTransform', e.target.value)}
                                    >
                                        <option value="none">None</option>
                                        <option value="uppercase">Uppercase</option>
                                        <option value="lowercase">Lowercase</option>
                                        <option value="capitalize">Capitalize</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={theme.sectionTitles.gradientEnabled}
                                        onChange={(e) => updateTheme('sectionTitles', 'gradientEnabled', e.target.checked)}
                                    />
                                    <span>Use Gradient</span>
                                </label>
                            </div>

                            {theme.sectionTitles.gradientEnabled ? (
                                <div className={styles.row}>
                                    <div className={styles.formGroup}>
                                        <label>Gradient Color 1</label>
                                        <div className={styles.colorPicker}>
                                            <input
                                                type="color"
                                                value={theme.sectionTitles.gradientColors[0]}
                                                onChange={(e) => updateArrayColor('sectionTitles', 'gradientColors', 0, e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={theme.sectionTitles.gradientColors[0]}
                                                onChange={(e) => updateArrayColor('sectionTitles', 'gradientColors', 0, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Gradient Color 2</label>
                                        <div className={styles.colorPicker}>
                                            <input
                                                type="color"
                                                value={theme.sectionTitles.gradientColors[1]}
                                                onChange={(e) => updateArrayColor('sectionTitles', 'gradientColors', 1, e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={theme.sectionTitles.gradientColors[1]}
                                                onChange={(e) => updateArrayColor('sectionTitles', 'gradientColors', 1, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.formGroup}>
                                    <label>Text Color</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.sectionTitles.color}
                                            onChange={(e) => updateTheme('sectionTitles', 'color', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.sectionTitles.color}
                                            onChange={(e) => updateTheme('sectionTitles', 'color', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* BUTTONS */}
                    {activeTab === 'buttons' && theme.buttons && (
                        <div className={styles.panel}>
                            <h3>Button Styles</h3>

                            <div className={styles.section}>
                                <h4>General Button Settings</h4>
                                <div className={styles.row}>
                                    <div className={styles.formGroup}>
                                        <label>Font Family</label>
                                        <select
                                            value={theme.buttons.fontFamily}
                                            onChange={(e) => updateTheme('buttons', 'fontFamily', e.target.value)}
                                        >
                                            {renderFontOptions()}
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Font Size</label>
                                        <input
                                            type="text"
                                            value={theme.buttons.fontSize}
                                            onChange={(e) => updateTheme('buttons', 'fontSize', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.formGroup}>
                                        <label>Letter Spacing</label>
                                        <input
                                            type="text"
                                            value={theme.buttons.letterSpacing}
                                            onChange={(e) => updateTheme('buttons', 'letterSpacing', e.target.value)}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Border Radius</label>
                                        <input
                                            type="text"
                                            value={theme.buttons.borderRadius}
                                            onChange={(e) => updateTheme('buttons', 'borderRadius', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.section}>
                                <h4>Primary Button</h4>
                                <div className={styles.row}>
                                    <div className={styles.formGroup}>
                                        <label>Gradient Color 1</label>
                                        <div className={styles.colorPicker}>
                                            <input
                                                type="color"
                                                value={theme.buttons.primary.bgGradient[0]}
                                                onChange={(e) => updateArrayColor('buttons', 'primary', 'bgGradient', 0, e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={theme.buttons.primary.bgGradient[0]}
                                                onChange={(e) => {
                                                    const newGradient = [...theme.buttons.primary.bgGradient];
                                                    newGradient[0] = e.target.value;
                                                    updateNestedTheme('buttons', 'primary', 'bgGradient', newGradient);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Gradient Color 2</label>
                                        <div className={styles.colorPicker}>
                                            <input
                                                type="color"
                                                value={theme.buttons.primary.bgGradient[1]}
                                                onChange={(e) => {
                                                    const newGradient = [...theme.buttons.primary.bgGradient];
                                                    newGradient[1] = e.target.value;
                                                    updateNestedTheme('buttons', 'primary', 'bgGradient', newGradient);
                                                }}
                                            />
                                            <input
                                                type="text"
                                                value={theme.buttons.primary.bgGradient[1]}
                                                onChange={(e) => {
                                                    const newGradient = [...theme.buttons.primary.bgGradient];
                                                    newGradient[1] = e.target.value;
                                                    updateNestedTheme('buttons', 'primary', 'bgGradient', newGradient);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.section}>
                                <h4>Outline Button</h4>
                                <div className={styles.row}>
                                    <div className={styles.formGroup}>
                                        <label>Border Color</label>
                                        <div className={styles.colorPicker}>
                                            <input
                                                type="color"
                                                value={theme.buttons.outline.borderColor}
                                                onChange={(e) => updateNestedTheme('buttons', 'outline', 'borderColor', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={theme.buttons.outline.borderColor}
                                                onChange={(e) => updateNestedTheme('buttons', 'outline', 'borderColor', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Text Color</label>
                                        <div className={styles.colorPicker}>
                                            <input
                                                type="color"
                                                value={theme.buttons.outline.textColor}
                                                onChange={(e) => updateNestedTheme('buttons', 'outline', 'textColor', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={theme.buttons.outline.textColor}
                                                onChange={(e) => updateNestedTheme('buttons', 'outline', 'textColor', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NAV LINKS */}
                    {activeTab === 'navLinks' && theme.navLinks && (
                        <div className={styles.panel}>
                            <h3>Navigation Link Styles</h3>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Font Family</label>
                                    <select
                                        value={theme.navLinks.fontFamily}
                                        onChange={(e) => updateTheme('navLinks', 'fontFamily', e.target.value)}
                                    >
                                        {renderFontOptions()}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Font Size</label>
                                    <input
                                        type="text"
                                        value={theme.navLinks.fontSize}
                                        onChange={(e) => updateTheme('navLinks', 'fontSize', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Default Color</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.navLinks.color}
                                            onChange={(e) => updateTheme('navLinks', 'color', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.navLinks.color}
                                            onChange={(e) => updateTheme('navLinks', 'color', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Hover Color</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.navLinks.hoverColor}
                                            onChange={(e) => updateTheme('navLinks', 'hoverColor', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.navLinks.hoverColor}
                                            onChange={(e) => updateTheme('navLinks', 'hoverColor', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* HYPERLINKS */}
                    {activeTab === 'hyperlinks' && theme.hyperlinks && (
                        <div className={styles.panel}>
                            <h3>Hyperlink Styles</h3>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Link Color</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.hyperlinks.color}
                                            onChange={(e) => updateTheme('hyperlinks', 'color', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.hyperlinks.color}
                                            onChange={(e) => updateTheme('hyperlinks', 'color', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Hover Color</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.hyperlinks.hoverColor}
                                            onChange={(e) => updateTheme('hyperlinks', 'hoverColor', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.hyperlinks.hoverColor}
                                            onChange={(e) => updateTheme('hyperlinks', 'hoverColor', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label className={styles.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={theme.hyperlinks.underline}
                                            onChange={(e) => updateTheme('hyperlinks', 'underline', e.target.checked)}
                                        />
                                        <span>Show Underline</span>
                                    </label>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={theme.hyperlinks.hoverUnderline}
                                            onChange={(e) => updateTheme('hyperlinks', 'hoverUnderline', e.target.checked)}
                                        />
                                        <span>Underline on Hover</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GLOBAL COLORS */}
                    {activeTab === 'globalColors' && theme.globalColors && (
                        <div className={styles.panel}>
                            <h3>Global Color Scheme</h3>

                            <div className={styles.colorList}>
                                <div className={styles.colorItem}>
                                    <label>Primary Color</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.globalColors.primary}
                                            onChange={(e) => updateTheme('globalColors', 'primary', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.globalColors.primary}
                                            onChange={(e) => updateTheme('globalColors', 'primary', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.colorItem}>
                                    <label>Secondary Color</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.globalColors.secondary}
                                            onChange={(e) => updateTheme('globalColors', 'secondary', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.globalColors.secondary}
                                            onChange={(e) => updateTheme('globalColors', 'secondary', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.colorItem}>
                                    <label>Background</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.globalColors.background}
                                            onChange={(e) => updateTheme('globalColors', 'background', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.globalColors.background}
                                            onChange={(e) => updateTheme('globalColors', 'background', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.colorItem}>
                                    <label>Card Background</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.globalColors.cardBackground}
                                            onChange={(e) => updateTheme('globalColors', 'cardBackground', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.globalColors.cardBackground}
                                            onChange={(e) => updateTheme('globalColors', 'cardBackground', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.colorItem}>
                                    <label>Text Primary</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.globalColors.textPrimary}
                                            onChange={(e) => updateTheme('globalColors', 'textPrimary', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.globalColors.textPrimary}
                                            onChange={(e) => updateTheme('globalColors', 'textPrimary', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.colorItem}>
                                    <label>Text Secondary</label>
                                    <div className={styles.colorPicker}>
                                        <input
                                            type="color"
                                            value={theme.globalColors.textSecondary}
                                            onChange={(e) => updateTheme('globalColors', 'textSecondary', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={theme.globalColors.textSecondary}
                                            onChange={(e) => updateTheme('globalColors', 'textSecondary', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <div className={styles.actions}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Theme Settings'}
                </button>
                <p className={styles.hint}>Note: You may need to refresh the page to see changes</p>
            </div>
        </div>
    );
}
