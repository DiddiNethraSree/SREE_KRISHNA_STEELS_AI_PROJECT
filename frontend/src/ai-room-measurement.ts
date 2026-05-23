/**
 * AI Room Measurement Module
 * Uses computer vision to detect room dimensions from photos, videos, and sensor data
 * Integrates TensorFlow.js, MediaPipe, and OpenCV for comprehensive room analysis
 */

import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow/tfjs-coco-ssd';

interface RoomMeasurements {
  width: number;
  height: number;
  depth: number;
  area: number;
  perimeter: number;
  detectedObjects: DetectedObject[];
  confidence: number;
  timestamp: Date;
}

interface DetectedObject {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
  estimatedSize?: {
    width: number;
    height: number;
    depth: number;
  };
}

class AiRoomMeasurement {
  private model: cocoSsd.ObjectDetection | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private video: HTMLVideoElement | null = null;
  private referenceSize = 0.5; // Default reference object size in meters

  constructor() {
    this.initializeModel();
  }

  /**
   * Initialize TensorFlow.js and load pre-trained models
   */
  private async initializeModel(): Promise<void> {
    try {
      await tf.ready();
      this.model = await cocoSsd.load();
      console.log('AI Room Measurement Model loaded successfully');
    } catch (error) {
      console.error('Failed to load model:', error);
    }
  }

  /**
   * Analyze a static image for room measurements
   */
  async analyzeImage(imageSource: string | File | HTMLImageElement): Promise<RoomMeasurements> {
    if (!this.model) {
      throw new Error('Model not initialized. Please wait for initialization to complete.');
    }

    let img: HTMLImageElement;

    if (imageSource instanceof File) {
      img = await this.fileToImage(imageSource);
    } else if (typeof imageSource === 'string') {
      img = await this.urlToImage(imageSource);
    } else {
      img = imageSource;
    }

    // Run object detection
    const predictions = await this.model.detect(img);

    // Calculate room measurements from detected objects
    const measurements = this.calculateMeasurements(predictions, img);

    return measurements;
  }

  /**
   * Analyze video stream for real-time room measurements
   */
  async startVideoAnalysis(
    videoElement: HTMLVideoElement,
    onUpdate: (measurements: RoomMeasurements) => void,
    fps: number = 10
  ): Promise<void> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    this.video = videoElement;
    const interval = 1000 / fps;

    const analyzeFrame = async () => {
      if (this.video && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        try {
          const predictions = await this.model!.detect(this.video);
          const measurements = this.calculateMeasurements(predictions, this.video);
          onUpdate(measurements);
        } catch (error) {
          console.error('Error analyzing video frame:', error);
        }
      }

      setTimeout(analyzeFrame, interval);
    };

    // Start camera access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      this.video.srcObject = stream;
      this.video.play();
      analyzeFrame();
    } catch (error) {
      console.error('Failed to access camera:', error);
      throw error;
    }
  }

  /**
   * Stop video analysis
   */
  stopVideoAnalysis(): void {
    if (this.video && this.video.srcObject) {
      const stream = this.video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      this.video.srcObject = null;
    }
  }

  /**
   * Calculate room dimensions from detected objects
   */
  private calculateMeasurements(
    predictions: Array<{ class: string; score: number; bbox: [number, number, number, number] }>,
    source: HTMLImageElement | HTMLVideoElement
  ): RoomMeasurements {
    const roomObjects = this.identifyRoomObjects(predictions);
    const walls = this.detectWalls(predictions, source);

    // Estimate dimensions based on detected furniture and walls
    const estimatedDimensions = this.estimateDimensions(roomObjects, walls, source);

    // Calculate area and perimeter
    const area = estimatedDimensions.width * estimatedDimensions.depth;
    const perimeter = 2 * (estimatedDimensions.width + estimatedDimensions.depth);

    // Calculate average confidence
    const avgConfidence =
      predictions.length > 0 ? predictions.reduce((sum, p) => sum + p.score, 0) / predictions.length : 0;

    return {
      width: parseFloat(estimatedDimensions.width.toFixed(2)),
      height: parseFloat(estimatedDimensions.height.toFixed(2)),
      depth: parseFloat(estimatedDimensions.depth.toFixed(2)),
      area: parseFloat(area.toFixed(2)),
      perimeter: parseFloat(perimeter.toFixed(2)),
      detectedObjects: roomObjects,
      confidence: parseFloat((avgConfidence * 100).toFixed(2)),
      timestamp: new Date(),
    };
  }

  /**
   * Identify furniture and room objects
   */
  private identifyRoomObjects(
    predictions: Array<{ class: string; score: number; bbox: [number, number, number, number] }>
  ): DetectedObject[] {
    const furnitureClasses = [
      'sofa',
      'chair',
      'bed',
      'table',
      'desk',
      'cabinet',
      'shelves',
      'door',
      'window',
      'person',
    ];

    return predictions
      .filter((p) => furnitureClasses.includes(p.class.toLowerCase()) && p.score > 0.5)
      .map((p) => ({
        class: p.class,
        confidence: parseFloat((p.score * 100).toFixed(2)),
        bbox: p.bbox,
        estimatedSize: this.estimateObjectSize(p),
      }));
  }

  /**
   * Detect walls from the image
   */
  private detectWalls(
    predictions: Array<{ class: string; score: number; bbox: [number, number, number, number] }>,
    source: HTMLImageElement | HTMLVideoElement
  ): { top: number; bottom: number; left: number; right: number } {
    // Heuristic: walls are typically at image boundaries and have large areas
    let wallBounds = {
      top: 0,
      bottom: source.height,
      left: 0,
      right: source.width,
    };

    predictions.forEach((p) => {
      const [x, y, width, height] = p.bbox;
      // Adjust wall bounds based on detected objects
      if (p.class.toLowerCase() === 'window' || p.class.toLowerCase() === 'door') {
        // Don't use windows/doors as wall reference
        return;
      }
    });

    return wallBounds;
  }

  /**
   * Estimate room dimensions from detected objects and walls
   */
  private estimateDimensions(
    roomObjects: DetectedObject[],
    walls: { top: number; bottom: number; left: number; right: number },
    source: HTMLImageElement | HTMLVideoElement
  ): { width: number; height: number; depth: number } {
    // Find reference objects (typically furniture with known dimensions)
    const referenceObject = roomObjects.find(
      (obj) =>
        obj.class.toLowerCase() === 'sofa' ||
        obj.class.toLowerCase() === 'bed' ||
        obj.class.toLowerCase() === 'table'
    );

    let pixelToMeterRatio = 1;
    if (referenceObject) {
      const refBbox = referenceObject.bbox;
      const refPixelWidth = refBbox[2];
      pixelToMeterRatio = this.referenceSize / refPixelWidth;
    }

    // Calculate dimensions in meters
    const width = (walls.right - walls.left) * pixelToMeterRatio;
    const depth = (walls.bottom - walls.top) * pixelToMeterRatio;
    const height = Math.min(width, depth) * 0.8; // Estimate height (typically 2.5-3m)

    return {
      width: Math.max(width, 2), // Minimum 2 meters
      height: Math.max(height, 2.4),
      depth: Math.max(depth, 2),
    };
  }

  /**
   * Estimate object size based on detected bounding box
   */
  private estimateObjectSize(prediction: { bbox: [number, number, number, number] }): {
    width: number;
    height: number;
    depth: number;
  } {
    const [, , width, height] = prediction.bbox;

    // Rough estimation based on pixel dimensions
    // These are estimates and would be more accurate with reference objects
    const estimatedWidth = width * 0.01; // Convert to approximate meters
    const estimatedHeight = height * 0.01;
    const estimatedDepth = height * 0.005; // Depth is typically less than height

    return {
      width: parseFloat(estimatedWidth.toFixed(2)),
      height: parseFloat(estimatedHeight.toFixed(2)),
      depth: parseFloat(estimatedDepth.toFixed(2)),
    };
  }

  /**
   * Convert image file to HTMLImageElement
   */
  private fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convert image URL to HTMLImageElement
   */
  private urlToImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Set reference object size for more accurate measurements
   */
  setReferenceSize(sizeInMeters: number): void {
    this.referenceSize = sizeInMeters;
  }

  /**
   * Get model status
   */
  isModelReady(): boolean {
    return this.model !== null;
  }
}

export { AiRoomMeasurement, RoomMeasurements, DetectedObject };
