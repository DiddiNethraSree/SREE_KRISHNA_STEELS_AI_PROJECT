# AI Room Measurement Feature Documentation

## Overview

The AI Room Measurement feature uses advanced computer vision and machine learning to analyze photos, videos, and live camera streams to provide accurate room dimension measurements. This feature is integrated into the AI Studio of your SREE KRISHNA STEELS furniture showroom application.

## Features

### 1. **Multi-Input Support**
- 📷 **Photo Upload**: Drag & drop or click to upload room images
- 🎥 **Video Analysis**: Process video files to extract measurements from frames
- 📹 **Live Camera**: Real-time room measurement using webcam stream

### 2. **Measurement Outputs**
- **Width** (meters): Horizontal room dimension
- **Height** (meters): Vertical room dimension  
- **Depth** (meters): Depth/length of the room
- **Area** (sq. meters): Floor area calculation (Width × Depth)
- **Perimeter** (meters): Room perimeter calculation
- **Confidence**: Accuracy rating (0-100%)

### 3. **Object Detection**
Automatically detects and identifies:
- Furniture (sofas, chairs, beds, tables, desks, cabinets, shelves)
- Structural elements (doors, windows)
- Occupants (for scale reference)

### 4. **Advanced Features**
- Automatic calibration using detected furniture
- Real-time frame processing for video input
- Measurement history tracking
- Data visualization with charts
- Report generation and export

## Technology Stack

### Core Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| **@tensorflow/tfjs** | Deep learning framework | ^4.17.0 |
| **@tensorflow/tfjs-coco-ssd** | Pre-trained object detection model | ^2.2.5 |
| **@mediapipe/tasks-vision** | Advanced computer vision AI | ^0.10.8 |
| **opencv-js** | Image processing and analysis | ^4.5.2 |
| **chart.js** | Data visualization | ^4.4.1 |

### Why These Libraries?

1. **TensorFlow.js + COCO-SSD**
   - Runs entirely in browser (no server needed)
   - Fast, accurate object detection
   - Pre-trained on 80 object classes including furniture
   - ~5MB model size

2. **MediaPipe Vision**
   - Google's production-grade computer vision
   - Better accuracy for complex scenes
   - Supports pose detection for human scale reference
   - Optimized for performance

3. **OpenCV.js**
   - Image processing and manipulation
   - Edge detection for wall identification
   - Perspective correction
   - Contour analysis

4. **Chart.js**
   - Beautiful, responsive charts
   - Easy integration
   - Lightweight (~60KB)

## Installation

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

## Usage Guide

### For End Users

#### Photo Upload
1. Navigate to Room Measurement or AI Studio page
2. Click the "Photo" tab
3. Drag & drop an image or click to select from device
4. Wait for AI analysis (2-5 seconds)
5. View measurements and detected objects
6. Download report if needed

#### Video Analysis
1. Click the "Video" tab
2. Upload a video file (MP4, WebM, etc.)
3. The first frame will be analyzed
4. Results will appear automatically

#### Live Camera
1. Click the "Live Camera" tab
2. Click "Start Camera" button
3. Grant camera permissions when prompted
4. Measurements update in real-time
5. Click "Stop Camera" to end

### For Developers

#### Initialize the UI Component

```typescript
import { RoomMeasurementUI } from './room-measurement-ui';

// Create the UI component
const ui = new RoomMeasurementUI('container-id');
```

#### Use the Core Measurement Engine

```typescript
import { AiRoomMeasurement } from './ai-room-measurement';

const measurement = new AiRoomMeasurement();

// Analyze an image
const results = await measurement.analyzeImage(imageFile);
console.log(`Room Width: ${results.width}m`);
console.log(`Room Area: ${results.area}m²`);

// Set custom reference size (in meters)
measurement.setReferenceSize(1.5); // e.g., sofa width

// For video analysis
const videoElement = document.getElementById('video');
measurement.startVideoAnalysis(videoElement, (measurements) => {
  console.log('Updated measurements:', measurements);
});

// Stop when done
measurement.stopVideoAnalysis();
```

## API Reference

### RoomMeasurements Interface

```typescript
interface RoomMeasurements {
  width: number;              // in meters
  height: number;             // in meters
  depth: number;              // in meters
  area: number;               // in square meters
  perimeter: number;          // in meters
  detectedObjects: DetectedObject[];
  confidence: number;         // 0-100
  timestamp: Date;
}
```

### DetectedObject Interface

```typescript
interface DetectedObject {
  class: string;              // e.g., "sofa", "table"
  confidence: number;         // 0-100
  bbox: [number, number, number, number]; // [x, y, width, height]
  estimatedSize?: {
    width: number;
    height: number;
    depth: number;
  };
}
```

## File Structure

```
frontend/
├── src/
│   ├── main.ts                      # Entry point
│   ├── ai-room-measurement.ts       # Core AI engine
│   ├── room-measurement-ui.ts       # UI component
│   └── room-measurement-integration.ts  # Integration utilities
├── ai-room-designer.html             # AI Studio page
├── room-measure.html                 # Room Measurement page
├── package.json                      # Dependencies
└── tsconfig.json                     # TypeScript config
```

## Performance Considerations

### Model Loading
- First load: ~5 seconds (model download & initialization)
- Subsequent loads: ~500ms (cached)
- Total model size: ~5MB

### Analysis Time
- Photo: 1-3 seconds
- Video frame: 0.5-1 second
- Real-time camera: Continuous (10 FPS default)

### Optimization Tips
1. Use compressed images when possible
2. Limit video resolution to 1280x720
3. Reduce camera FPS for lower-end devices
4. Clear measurement history to free memory

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Chromium | ✅ Full | Best support |
| Firefox | ✅ Full | Good support |
| Safari | ✅ Full | iOS 14+ required |
| Edge | ✅ Full | Chromium-based |
| Mobile | ✅ Limited | Camera works, may be slower |

## Troubleshooting

### Model Fails to Load
- **Issue**: "Model not initialized"
- **Solution**: Check internet connection, browser console for errors
- **Try**: Refresh the page, clear browser cache

### Camera Permission Denied
- **Issue**: Can't access camera
- **Solution**: Check browser permissions, ensure HTTPS (except localhost)
- **Try**: Clear site data and try again

### Inaccurate Measurements
- **Issue**: Measurements seem off
- **Solution**: Ensure good lighting, stable camera angle, furniture in frame
- **Try**: Use a furniture piece with known size as reference

### Slow Performance
- **Issue**: Analysis takes too long
- **Solution**: Reduce image resolution, close other applications
- **Try**: Use a different browser or update GPU drivers

## Advanced Configuration

### Set Custom Reference Size

```typescript
// If you know a furniture piece dimension
const measurement = new AiRoomMeasurement();
measurement.setReferenceSize(0.75); // e.g., 75cm = 0.75m
```

### Access Measurement History

```typescript
// UI component maintains measurement history
const measurements = ui.measurementHistory; // Array of all measurements
```

### Custom Calibration

```typescript
// Adjust pixel-to-meter ratio based on known reference
// This improves accuracy for specific camera angles
measurement.setReferenceSize(knownSizeInMeters);
```

## Privacy & Data

- **All processing happens locally** in your browser
- No images or data are sent to external servers
- No tracking or analytics collection
- Perfect for sensitive/private rooms

## Limitations & Assumptions

1. **Assumes rectangular rooms** - L-shaped or irregular rooms may not be accurate
2. **Requires furniture reference** - Empty rooms are harder to measure
3. **Depends on image quality** - Poor lighting/blurry images reduce accuracy
4. **Assumes level camera** - Angled camera view affects measurements
5. **Confidence varies** - Complex scenes may have lower confidence scores

## Future Enhancements

Planned features for future versions:
- [ ] 3D room visualization
- [ ] Furniture placement simulation
- [ ] AR room preview
- [ ] Multi-floor support
- [ ] Integration with furniture catalog
- [ ] Measurement comparison tools
- [ ] Cloud backup option
- [ ] Export to PDF

## Support & Contribution

For issues, suggestions, or contributions:
1. Check this documentation
2. Review browser console for errors
3. Test in different browsers
4. Submit issues on GitHub

## License

This feature is part of SREE KRISHNA STEELS AI Project.

## Changelog

### v1.0.0 (Initial Release)
- Photo upload and analysis
- Video frame processing
- Live camera streaming
- Real-time detection
- Measurement history
- Report export
- Responsive UI
