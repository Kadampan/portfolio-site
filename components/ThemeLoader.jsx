'use client';

import { useEffect } from 'react';

export default function ThemeLoader() {
    useEffect(() => {
        const loadAndApplyTheme = async () => {
            try {
                // Fetch theme settings
                const themeRes = await fetch('/api/theme');
                const theme = await themeRes.json();

                // Fetch available fonts
                const fontsRes = await fetch('/api/fonts');
                const fonts = await fontsRes.json();

                if (!theme) return;

                console.log('🎨 Loading theme and fonts...');

                // ============================================
                // 1. LOAD CUSTOM FONTS
                // ============================================
                let fontFaceCSS = '';
                if (fonts.customFonts && fonts.customFonts.length > 0) {
                    fonts.customFonts.forEach(font => {
                        fontFaceCSS += `
                            @font-face {
                                font-family: '${font.name}';
                                src: url('${font.path}') format('${font.format}');
                                font-weight: normal;
                                font-style: normal;
                                font-display: swap;
                            }
                        `;
                    });
                    console.log(`✅ Loaded ${fonts.customFonts.length} custom fonts`);
                }

                // ============================================
                // 2. BUILD DYNAMIC THEME CSS
                // ============================================
                let themeCSS = fontFaceCSS;

                // Logo styles
                if (theme.logo) {
                    const logo = theme.logo;
                    const gradientStops = logo.gradientColors?.map((color, index) => {
                        const percentage = (index / (logo.gradientColors.length - 1)) * 100;
                        return `${color} ${percentage}%`;
                    }).join(', ') || '#00ffff 0%, #00d4ff 20%, #0088ff 40%, #00d4ff 60%, #00ffff 80%, #ffffff 100%';

                    themeCSS += `
                        #portfolio-logo,
                        #hero-artist-logo {
                            font-family: '${logo.fontFamily}', 'Aquire', sans-serif !important;
                            font-size: ${logo.fontSize} !important;
                            letter-spacing: ${logo.letterSpacing} !important;
                            text-transform: ${logo.textTransform} !important;
                            background: linear-gradient(90deg, ${gradientStops}) !important;
                            background-size: 200% auto !important;
                            -webkit-background-clip: text !important;
                            background-clip: text !important;
                            -webkit-text-fill-color: transparent !important;
                        }
                        
                        /* Hero logo specific size override */
                        #hero-artist-logo {
                            font-size: calc(${logo.fontSize} * 1.5) !important;
                        }
                    `;

                    // Animation
                    if (logo.animation?.enabled) {
                        const animations = [`scifiFlow ${logo.animation.speed} linear infinite`];
                        if (logo.animation?.pulseEnabled) {
                            animations.push('scifiPulse 2s ease-in-out infinite');
                        }
                        themeCSS += `
                            #portfolio-logo,
                            #hero-artist-logo {
                                animation: ${animations.join(', ')} !important;
                            }
                        `;
                    }

                    // Glow
                    if (logo.glow?.enabled) {
                        const glowColor = logo.glow.color || '#00ffff';
                        const shadows = {
                            low: `0 0 8px ${glowColor}66, 0 0 16px ${glowColor}33`,
                            medium: `0 0 8px ${glowColor}99, 0 0 20px ${glowColor}66, 0 0 30px ${glowColor}33`,
                            high: `0 0 8px ${glowColor}CC, 0 0 20px ${glowColor}99, 0 0 30px ${glowColor}66, 0 0 40px ${glowColor}33`
                        }[logo.glow.intensity] || `0 0 8px ${glowColor}99, 0 0 20px ${glowColor}66, 0 0 30px ${glowColor}33`;

                        themeCSS += `
                            #portfolio-logo {
                                filter: drop-shadow(${shadows}) !important;
                            }
                        `;
                    }
                }

                // Headings (h1-h6)
                if (theme.headings) {
                    const h = theme.headings;
                    themeCSS += `
                        h1, h2, h3, h4, h5, h6 {
                            font-family: '${h.fontFamily}', var(--font-family) !important;
                            font-weight: ${h.fontWeight} !important;
                            letter-spacing: ${h.letterSpacing} !important;
                            color: ${h.color} !important;
                        }
                        h1 { font-size: ${h.h1Size} !important; }
                        h2 { font-size: ${h.h2Size} !important; }
                        h3 { font-size: ${h.h3Size} !important; }
                        h4 { font-size: ${h.h4Size} !important; }
                    `;
                }

                // Section Titles
                if (theme.sectionTitles) {
                    const st = theme.sectionTitles;
                    if (st.gradientEnabled && st.gradientColors) {
                        const gradient = `linear-gradient(135deg, ${st.gradientColors[0]} 0%, ${st.gradientColors[1]} 100%)`;
                        themeCSS += `
                            .section-title {
                                font-family: '${st.fontFamily}', 'Aquire', sans-serif !important;
                                font-size: ${st.fontSize} !important;
                                letter-spacing: ${st.letterSpacing} !important;
                                text-transform: ${st.textTransform} !important;
                                background: ${gradient} !important;
                                -webkit-background-clip: text !important;
                                background-clip: text !important;
                                -webkit-text-fill-color: transparent !important;
                            }
                        `;
                    } else {
                        themeCSS += `
                            .section-title {
                                font-family: '${st.fontFamily}', 'Aquire', sans-serif !important;
                                font-size: ${st.fontSize} !important;
                                letter-spacing: ${st.letterSpacing} !important;
                                text-transform: ${st.textTransform} !important;
                                color: ${st.color} !important;
                            }
                        `;
                    }
                }

                // Buttons
                if (theme.buttons) {
                    const btn = theme.buttons;
                    themeCSS += `
                        .btn, button {
                            font-family: '${btn.fontFamily}', 'Aquire', sans-serif !important;
                            font-size: ${btn.fontSize} !important;
                            letter-spacing: ${btn.letterSpacing} !important;
                            border-radius: ${btn.borderRadius} !important;
                        }
                    `;

                    if (btn.primary) {
                        const gradient = `linear-gradient(135deg, ${btn.primary.bgGradient[0]} 0%, ${btn.primary.bgGradient[1]} 100%)`;
                        themeCSS += `
                            .btn-primary {
                                background: ${gradient} !important;
                            }
                        `;
                    }

                    if (btn.outline) {
                        themeCSS += `
                            .btn-outline {
                                border-color: ${btn.outline.borderColor} !important;
                                color: ${btn.outline.textColor} !important;
                            }
                            .btn-outline:hover {
                                background: ${btn.outline.borderColor} !important;
                            }
                        `;
                    }
                }

                // Navigation Links
                if (theme.navLinks) {
                    const nav = theme.navLinks;
                    themeCSS += `
                        nav a, nav button {
                            font-family: '${nav.fontFamily}', var(--font-family) !important;
                            font-size: ${nav.fontSize} !important;
                            color: ${nav.color} !important;
                        }
                        nav a:hover, nav button:hover {
                            color: ${nav.hoverColor} !important;
                        }
                    `;
                }

                // Hyperlinks
                if (theme.hyperlinks) {
                    const link = theme.hyperlinks;
                    themeCSS += `
                        a {
                            color: ${link.color} !important;
                            text-decoration: ${link.underline ? 'underline' : 'none'} !important;
                        }
                        a:hover {
                            color: ${link.hoverColor} !important;
                            text-decoration: ${link.hoverUnderline ? 'underline' : 'none'} !important;
                        }
                    `;
                }

                // Keyframe animations
                themeCSS += `
                    @keyframes scifiFlow {
                        0% { background-position: 200% center; }
                        100% { background-position: 0% center; }
                    }
                    
                    @keyframes scifiPulse {
                        0%, 100% {
                            filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.8)) 
                                    drop-shadow(0 0 20px rgba(0, 212, 255, 0.6)) 
                                    drop-shadow(0 0 30px rgba(0, 136, 255, 0.4));
                        }
                        50% {
                            filter: drop-shadow(0 0 12px rgba(0, 255, 255, 1)) 
                                    drop-shadow(0 0 25px rgba(0, 212, 255, 0.8)) 
                                    drop-shadow(0 0 40px rgba(0, 136, 255, 0.6));
                        }
                    }
                `;

                // ============================================
                // 3. INJECT CSS INTO DOCUMENT
                // ============================================
                let styleTag = document.getElementById('dynamic-theme');
                if (!styleTag) {
                    styleTag = document.createElement('style');
                    styleTag.id = 'dynamic-theme';
                    document.head.appendChild(styleTag);
                }
                styleTag.textContent = themeCSS;

                console.log('✅ Theme and fonts applied successfully!');

            } catch (error) {
                console.error('❌ Failed to load theme:', error);
            }
        };

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadAndApplyTheme);
        } else {
            loadAndApplyTheme();
        }

        // Reload on focus (useful when returning from admin panel)
        const handleFocus = () => loadAndApplyTheme();
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('DOMContentLoaded', loadAndApplyTheme);
        };
    }, []);

    return null;
}
