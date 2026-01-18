# 3D Models Directory

This directory stores uploaded 3D model files for your portfolio.

## Supported Formats

- `.obj` - Wavefront OBJ files
- `.fbx` - Autodesk FBX files  
- `.gltf` - GL Transmission Format (text-based)
- `.glb` - GL Transmission Format (binary)

## Usage

Models uploaded through the admin panel are automatically stored here.

### File Naming Convention
```
model_[timestamp]_[original-filename]
```

Example: `model_1767760123456_robot.glb`

## Integration

These models can be displayed in your portfolio with:
- Custom animations (rotate, float, scale, spin)
- Scroll-based interactions
- Positioned in different sections (hero, about, works, floating)

## Performance Tips

1. **Optimize Models**: Keep polygon counts reasonable
2. **File Size**: Compress textures, use .glb for smaller files
3. **LOD**: Use Level of Detail for complex models
4. **Testing**: Test on various devices for performance

## Recommended Tools

- **Blender** - Free, open-source 3D creation suite
- **gltf.report** - Optimize and analyze GLTF/GLB files
- **Sketchfab** - Download optimized 3D models

---

Upload and manage your 3D models through the Admin Dashboard → 3D Models section.
