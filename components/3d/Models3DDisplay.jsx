'use client';

import dynamic from 'next/dynamic';

// Dynamically import 3D model component
const Custom3DModel = dynamic(() => import('@/components/3d/Custom3DModel'), {
    ssr: false,
    loading: () => <div style={{ height: '500px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-text-secondary)' }}>Loading 3D model...</div>
    </div>
});

/**
 * Component to display 3D models based on their configured section
 * @param {Array} models - Array of 3D model objects from portfolio data
 * @param {String} section - Which section to display ('hero', 'about', 'works', 'floating')
 */
export default function Models3DDisplay({ models = [], section = 'hero' }) {
    // Filter models for this section
    const sectionModels = models.filter(model => model.displaySection === section);

    if (!sectionModels || sectionModels.length === 0) {
        return null;
    }

    return (
        <>
            {sectionModels.map((model) => (
                <div key={model.id} style={getContainerStyle(section)}>
                    <Custom3DModel
                        modelUrl={model.url}
                        animationType={model.animationType}
                        position={model.position}
                        scale={model.scale}
                        enableScroll={model.enableScroll}
                        height={getHeightForSection(section)}
                    />
                </div>
            ))}
        </>
    );
}

// Helper function to get container styles based on section
function getContainerStyle(section) {
    const baseStyle = {
        width: '100%',
        position: 'relative',
    };

    switch (section) {
        case 'floating':
            return {
                ...baseStyle,
                position: 'fixed',
                top: '20%',
                right: '5%',
                width: '300px',
                height: '300px',
                zIndex: 10,
                pointerEvents: 'none',
            };
        case 'hero':
            return {
                ...baseStyle,
                flex: 1,
                minHeight: '500px',
            };
        case 'about':
        case 'works':
            return {
                ...baseStyle,
                margin: 'var(--spacing-xl) 0',
            };
        default:
            return baseStyle;
    }
}

// Helper function to get height based on section
function getHeightForSection(section) {
    switch (section) {
        case 'floating':
            return '300px';
        case 'hero':
            return '500px';
        case 'about':
            return '400px';
        case 'works':
            return '350px';
        default:
            return '400px';
    }
}
