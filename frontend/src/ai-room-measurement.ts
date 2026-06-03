import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

export interface DetectedObject {
  class: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
  estimatedSize?: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface RoomMeasurements {
  width: number;       // in meters
  length: number;      // in meters
  height: number;      // in meters
  area: number;        // square meters
  perimeter: number;   // meters
  detectedObjects: DetectedObject[];
  confidence: string;  // "high" | "medium" | "low"
  notes: string;
  timestamp: Date;
}

// Typical dimensions in meters for standard object classes detected by COCO-SSD
export const STANDARD_OBJECT_SIZES: Record<string, { width: number; height: number; depth: number }> = {
  sofa: { width: 1.8, height: 0.85, depth: 0.9 },
  couch: { width: 1.8, height: 0.85, depth: 0.9 },
  chair: { width: 0.55, height: 0.8, depth: 0.55 },
  bed: { width: 1.9, height: 0.6, depth: 2.0 },
  "dining table": { width: 1.5, height: 0.75, depth: 0.9 },
  person: { width: 0.5, height: 1.7, depth: 0.35 },
  tv: { width: 1.1, height: 0.65, depth: 0.1 },
  refrigerator: { width: 0.75, height: 1.75, depth: 0.7 },
  laptop: { width: 0.35, height: 0.25, depth: 0.25 },
  pottedplant: { width: 0.45, height: 0.6, depth: 0.45 },
  backpack: { width: 0.35, height: 0.48, depth: 0.2 },
  suitcase: { width: 0.45, height: 0.68, depth: 0.25 },
  bottle: { width: 0.08, height: 0.25, depth: 0.08 }
};

export class AiRoomMeasurement {
  private model: cocoSsd.ObjectDetection | null = null;
  private isModelLoading = false;

  constructor() {}

  /**
   * Initializes the TensorFlow.js and COCO-SSD model.
   * @param onProgress Callback for loading status
   */
  async initModel(onProgress?: (status: string) => void): Promise<cocoSsd.ObjectDetection> {
    if (this.model) return this.model;
    if (this.isModelLoading) {
      while (!this.model) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.model;
    }

    this.isModelLoading = true;
    try {
      if (onProgress) onProgress("Initializing TensorFlow backend...");
      await tf.ready();
      
      // Force WebGL backend if available, otherwise fallback to CPU
      const backends = ["webgl", "cpu"];
      for (const backend of backends) {
        try {
          await tf.setBackend(backend);
          console.log(`Using TFJS Backend: ${backend}`);
          break;
        } catch (e) {
          console.warn(`TFJS Backend ${backend} initialization failed:`, e);
        }
      }

      if (onProgress) onProgress("Downloading COCO-SSD model weights (~5MB)...");
      this.model = await cocoSsd.load({ base: "lite_mobilenet_v2" });
      
      if (onProgress) onProgress("AI Model ready!");
      console.log("COCO-SSD model loaded successfully");
      return this.model;
    } catch (error) {
      console.error("Error loading TFJS COCO-SSD model", error);
      this.isModelLoading = false;
      throw error;
    }
  }

  /**
   * Detects objects in an image, canvas, or video element.
   */
  async detectObjects(imageSource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageData): Promise<DetectedObject[]> {
    const model = await this.initModel();
    const rawPredictions = await model.detect(imageSource);

    return rawPredictions.map((p: any) => {
      const size = STANDARD_OBJECT_SIZES[p.class];
      return {
        class: p.class,
        confidence: Math.round(p.score * 100),
        bbox: p.bbox as [number, number, number, number],
        estimatedSize: size ? { ...size } : undefined
      };
    });
  }

  /**
   * Auto-calibrates scale (pixels-to-meters) based on detected objects.
   * Chooses the highest confidence object with standard dimensions.
   */
  calculateScaleFromObjects(
    detectedObjects: DetectedObject[],
    canvasWidth: number
  ): { pixelsPerMeter: number; referenceObject: DetectedObject | null } {
    let bestObj: DetectedObject | null = null;
    let maxConfidence = -1;

    for (const obj of detectedObjects) {
      if (STANDARD_OBJECT_SIZES[obj.class] && obj.confidence > maxConfidence) {
        maxConfidence = obj.confidence;
        bestObj = obj;
      }
    }

    if (!bestObj) {
      // Default fallback scale: Assume a standard photo width is roughly 4.5 meters
      return { pixelsPerMeter: canvasWidth / 4.5, referenceObject: null };
    }

    const stdWidth = STANDARD_OBJECT_SIZES[bestObj.class].width;
    const pixelWidth = bestObj.bbox[2];
    const pixelsPerMeter = pixelWidth / stdWidth;

    return { pixelsPerMeter, referenceObject: bestObj };
  }

  /**
   * Calculates a 3D coordinate (relative to camera position) of a point on the floor.
   * Uses trigonometry based on holding height and pitch/roll.
   * 
   * @param canvasX X pixel coordinate of the point on the canvas
   * @param canvasY Y pixel coordinate of the point on the canvas
   * @param canvasWidth Width of the canvas in pixels
   * @param canvasHeight Height of the canvas in pixels
   * @param heightM Camera height from the floor in meters (e.g., 1.5m)
   * @param pitchDeg Camera tilt down from horizontal in degrees (0 = horizontal, positive is tilting down)
   * @param rollDeg Camera side-to-side roll in degrees (left/right tilt)
   */
  calculate3DPoint(
    canvasX: number,
    canvasY: number,
    canvasWidth: number,
    canvasHeight: number,
    heightM: number,
    pitchDeg: number,
    _rollDeg = 0
  ): { x: number; y: number; z: number; distance: number } {
    // 1. Center of canvas
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;

    // 2. Camera FOV setup (standard mobile camera has ~60 deg horizontal, ~45 deg vertical FOV)
    const fovH = 60 * (Math.PI / 180);
    const fx = cx / Math.tan(fovH / 2); // Focal length in horizontal pixels
    const fy = fx; // Assume square pixels

    // 3. Pixel offsets from optical center
    const dx = canvasX - cx;
    const dy = cy - canvasY; // canvas Y goes down, but in standard coords up is positive

    // 4. Angular deviations relative to camera axis
    const angleX = Math.atan(dx / fx); // Yaw offset
    const angleY = Math.atan(dy / fy); // Pitch offset

    // 5. Adjust for camera's actual physical pitch angle
    const totalPitch = (pitchDeg * (Math.PI / 180)) - angleY;

    // Avoid division by zero or negative pitch (meaning point is above horizon line)
    const clampedPitch = Math.max(0.02, Math.min(Math.PI / 2 - 0.02, totalPitch));

    // 6. Compute distance (depth along floor)
    // Z is depth (forward distance)
    const z = heightM / Math.tan(clampedPitch);
    
    // X is horizontal lateral distance (perpendicular to depth)
    const x = z * Math.sin(angleX);

    // Y is vertical (which is on the floor, so it is -heightM relative to camera)
    const y = -heightM;

    const distance = Math.sqrt(x * x + z * z);

    return { x, y, z, distance };
  }

  /**
   * Computes final room measurements based on object scaling
   */
  estimateRoomDimensionsFromScale(
    pixelsPerMeter: number,
    canvasWidth: number,
    canvasHeight: number,
    referenceObject: DetectedObject | null
  ): RoomMeasurements {
    // Basic room dimensions layout in pixels (based on typical image proportions)
    // A standard room's width in the photo spans roughly 80% to 100% of the canvas width
    // Height spans from ceiling to floor (roughly 70% of canvas height)
    // Depth extends into the background (roughly 90% of canvas width in perspective)
    
    let baseWidth = canvasWidth * 0.9;
    let baseHeight = canvasHeight * 0.75;
    let baseLength = canvasWidth * 1.1;

    // Estimate based on scale
    let width = Number((baseWidth / pixelsPerMeter).toFixed(2));
    let height = Number((baseHeight / pixelsPerMeter).toFixed(2));
    let length = Number((baseLength / pixelsPerMeter).toFixed(2));

    // Limit to reasonable room bounds
    width = Math.max(2.0, Math.min(12.0, width));
    height = Math.max(2.2, Math.min(5.0, height));
    length = Math.max(2.0, Math.min(15.0, length));

    const area = Number((width * length).toFixed(2));
    const perimeter = Number((2 * (width + length)).toFixed(2));

    let notes = "Estimated automatically via computer vision scale analysis.";
    let confidence: "high" | "medium" | "low" = "low";

    if (referenceObject) {
      notes = `Scale auto-calibrated using detected: ${referenceObject.class} (${referenceObject.confidence}% confidence).`;
      confidence = referenceObject.confidence > 75 ? "high" : "medium";
    } else {
      notes = "No standard furniture detected for scaling. Using default camera frustum estimation.";
    }

    return {
      width,
      length,
      height,
      area,
      perimeter,
      detectedObjects: [], // Populated by caller
      confidence,
      notes,
      timestamp: new Date()
    };
  }
}
