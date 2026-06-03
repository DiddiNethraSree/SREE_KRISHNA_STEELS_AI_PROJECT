import { AiRoomMeasurement } from "./ai-room-measurement";
import type { DetectedObject, RoomMeasurements } from "./ai-room-measurement";
import { Chart } from "chart.js/auto";

export class RoomMeasurementUI {
  private engine: AiRoomMeasurement;
  private activeTab: "photo" | "video" | "live" = "photo";
  private isCameraActive = false;
  private isVideoProcessing = false;
  private videoFrameId: number | null = null;
  private currentStream: MediaStream | null = null;
  private loadedImage: HTMLImageElement | null = null;
  private scalePixelsPerMeter = 100;
  
  // History log for trends
  private measurementsHistory: RoomMeasurements[] = [];
  private chart: Chart | null = null;

  // Sensor Pinned Coordinates
  private pinnedPoints: {
    depth: { x: number; z: number } | null;
    left: { x: number; z: number } | null;
    right: { x: number; z: number } | null;
    height: { x: number; y: number; z: number } | null;
    ceiling: { x: number; y: number; z: number } | null;
  } = { depth: null, left: null, right: null, height: null, ceiling: null };

  // DOM elements - Tab controls
  private tabBtnPhoto!: HTMLButtonElement;
  private tabBtnVideo!: HTMLButtonElement;
  private tabBtnLive!: HTMLButtonElement;
  
  // DOM elements - Upload areas
  private panelPhoto!: HTMLDivElement;
  private panelVideo!: HTMLDivElement;
  private panelLive!: HTMLDivElement;
  private fileInputPhoto!: HTMLInputElement;
  private fileInputVideo!: HTMLInputElement;
  private choosePhotoBtn!: HTMLButtonElement;
  private chooseVideoBtn!: HTMLButtonElement;
  private startLiveBtn!: HTMLButtonElement;
  private uploadStatus!: HTMLParagraphElement;
  private webcamSelect!: HTMLSelectElement;

  // DOM elements - Workspace
  private layout!: HTMLDivElement;
  private canvas!: HTMLCanvasElement;
  private videoElement!: HTMLVideoElement;
  private modelLoader!: HTMLDivElement;
  private modelLoaderText!: HTMLParagraphElement;

  // DOM elements - Controls
  private sensorPanel!: HTMLDivElement;
  private sensorHeightInput!: HTMLInputElement;
  private sensorHeightVal!: HTMLSpanElement;
  private sensorPitchInput!: HTMLInputElement;
  private sensorPitchVal!: HTMLSpanElement;
  private pinDepthBtn!: HTMLButtonElement;
  private pinLeftBtn!: HTMLButtonElement;
  private pinRightBtn!: HTMLButtonElement;
  private pinHeightBtn!: HTMLButtonElement;
  private clearPinsBtn!: HTMLButtonElement;
  
  private analyzeBtn!: HTMLButtonElement;
  private refineGeminiBtn!: HTMLButtonElement;
  private spawnFurnitureBlock!: HTMLDivElement;
  private spawnButtonsContainer!: HTMLDivElement;
  private resultCard!: HTMLDivElement;
  private downloadBtn!: HTMLButtonElement;
  private resetBtn!: HTMLButtonElement;
  
  // Table outputs
  private dimWFt!: HTMLElement;
  private dimWM!: HTMLElement;
  private dimLFt!: HTMLElement;
  private dimLM!: HTMLElement;
  private dimHFt!: HTMLElement;
  private dimHM!: HTMLElement;
  private dimAreaFt!: HTMLElement;
  private dimAreaM!: HTMLElement;
  private autoScaleDisplay!: HTMLElement;
  private chartFramesCount!: HTMLElement;

  // Gyroscope real sensor values
  private devicePitch = 30; // degrees
  private deviceRoll = 0;   // degrees
  private hasDeviceOrientation = false;

  constructor() {
    this.engine = new AiRoomMeasurement();
    this.initDOMElements();
    this.bindEvents();
    this.initChart();
    this.setupGyroscope();
    this.setupDraggableARPreview();
  }

  private initDOMElements() {
    // Tabs
    this.tabBtnPhoto = document.getElementById("tab-btn-photo") as HTMLButtonElement;
    this.tabBtnVideo = document.getElementById("tab-btn-video") as HTMLButtonElement;
    this.tabBtnLive = document.getElementById("tab-btn-live") as HTMLButtonElement;

    // Panels
    this.panelPhoto = document.getElementById("panel-photo") as HTMLDivElement;
    this.panelVideo = document.getElementById("panel-video") as HTMLDivElement;
    this.panelLive = document.getElementById("panel-live") as HTMLDivElement;

    // Inputs
    this.fileInputPhoto = document.getElementById("measure-file") as HTMLInputElement;
    this.fileInputVideo = document.getElementById("measure-video-file") as HTMLInputElement;
    this.choosePhotoBtn = document.getElementById("choose-room-photo") as HTMLButtonElement;
    this.chooseVideoBtn = document.getElementById("choose-room-video") as HTMLButtonElement;
    this.startLiveBtn = document.getElementById("start-live-btn") as HTMLButtonElement;
    this.uploadStatus = document.getElementById("measure-upload-status") as HTMLParagraphElement;
    this.webcamSelect = document.getElementById("webcam-select") as HTMLSelectElement;

    // Workspace
    this.layout = document.getElementById("measure-layout") as HTMLDivElement;
    this.canvas = document.getElementById("measure-canvas") as HTMLCanvasElement;
    this.videoElement = document.getElementById("measure-video-element") as HTMLVideoElement;
    this.modelLoader = document.getElementById("model-loader") as HTMLDivElement;
    this.modelLoaderText = document.getElementById("model-loader-text") as HTMLParagraphElement;

    // Controls Side Panel
    this.sensorPanel = document.getElementById("sensor-panel") as HTMLDivElement;
    this.sensorHeightInput = document.getElementById("sensor-height") as HTMLInputElement;
    this.sensorHeightVal = document.getElementById("sensor-height-val") as HTMLSpanElement;
    this.sensorPitchInput = document.getElementById("sensor-pitch") as HTMLInputElement;
    this.sensorPitchVal = document.getElementById("sensor-pitch-val") as HTMLSpanElement;
    
    this.pinDepthBtn = document.getElementById("pin-depth-btn") as HTMLButtonElement;
    this.pinLeftBtn = document.getElementById("pin-left-btn") as HTMLButtonElement;
    this.pinRightBtn = document.getElementById("pin-right-btn") as HTMLButtonElement;
    this.pinHeightBtn = document.getElementById("pin-height-btn") as HTMLButtonElement;
    this.clearPinsBtn = document.getElementById("clear-pins-btn") as HTMLButtonElement;

    this.analyzeBtn = document.getElementById("analyze-btn") as HTMLButtonElement;
    this.refineGeminiBtn = document.getElementById("refine-gemini-btn") as HTMLButtonElement;
    this.spawnFurnitureBlock = document.getElementById("spawn-furniture-block") as HTMLDivElement;
    this.spawnButtonsContainer = document.getElementById("spawn-buttons-container") as HTMLDivElement;
    this.resultCard = document.getElementById("measure-result") as HTMLDivElement;
    
    this.downloadBtn = document.getElementById("download-btn") as HTMLButtonElement;
    this.resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;

    // Output Labels
    this.dimWFt = document.getElementById("dim-w-ft")!;
    this.dimWM = document.getElementById("dim-w-m")!;
    this.dimLFt = document.getElementById("dim-l-ft")!;
    this.dimLM = document.getElementById("dim-l-m")!;
    this.dimHFt = document.getElementById("dim-h-ft")!;
    this.dimHM = document.getElementById("dim-h-m")!;
    this.dimAreaFt = document.getElementById("dim-area-ft")!;
    this.dimAreaM = document.getElementById("dim-area-m")!;
    this.autoScaleDisplay = document.getElementById("auto-scale-display")!;
    this.chartFramesCount = document.getElementById("chart-frames-count")!;
  }

  private bindEvents() {
    // Tabs click
    this.tabBtnPhoto.addEventListener("click", () => this.switchTab("photo"));
    this.tabBtnVideo.addEventListener("click", () => this.switchTab("video"));
    this.tabBtnLive.addEventListener("click", () => this.switchTab("live"));

    // File buttons click
    this.choosePhotoBtn.addEventListener("click", () => this.fileInputPhoto.click());
    this.chooseVideoBtn.addEventListener("click", () => this.fileInputVideo.click());
    this.startLiveBtn.addEventListener("click", () => this.toggleLiveCamera());

    // File inputs change
    this.fileInputPhoto.addEventListener("change", () => this.handlePhotoSelect());
    this.fileInputVideo.addEventListener("change", () => this.handleVideoSelect());

    // Drag and drop events for drop zones
    this.setupDragAndDrop(this.panelPhoto, this.fileInputPhoto);
    this.setupDragAndDrop(this.panelVideo, this.fileInputVideo);

    // Sliders
    this.sensorHeightInput.addEventListener("input", () => {
      this.sensorHeightVal.textContent = `${Number(this.sensorHeightInput.value).toFixed(2)}m`;
    });
    this.sensorPitchInput.addEventListener("input", () => {
      this.sensorPitchVal.textContent = `${this.sensorPitchInput.value}°`;
      if (!this.hasDeviceOrientation) {
        this.devicePitch = Number(this.sensorPitchInput.value);
      }
    });

    // Run AI Detection click
    this.analyzeBtn.addEventListener("click", () => this.runAIDetection());

    // Refine with Gemini click
    this.refineGeminiBtn.addEventListener("click", () => this.refineWithGemini());

    // Pinning events
    this.pinDepthBtn.addEventListener("click", () => this.pinPoint("depth"));
    this.pinLeftBtn.addEventListener("click", () => this.pinPoint("left"));
    this.pinRightBtn.addEventListener("click", () => this.pinPoint("right"));
    this.pinHeightBtn.addEventListener("click", () => this.pinPoint("height"));
    this.clearPinsBtn.addEventListener("click", () => this.clearPins());

    // Presets
    this.downloadBtn.addEventListener("click", () => this.downloadSnapshot());
    this.resetBtn.addEventListener("click", () => this.resetWorkspace());
  }

  private switchTab(tab: "photo" | "video" | "live") {
    if (this.activeTab === tab) return;
    this.resetWorkspace();
    
    // Deactivate current tab
    document.getElementById(`tab-btn-${this.activeTab}`)?.classList.remove("active");
    this.activeTab = tab;
    
    // Activate new tab
    document.getElementById(`tab-btn-${this.activeTab}`)?.classList.add("active");

    // Toggle panel displays
    this.panelPhoto.style.display = tab === "photo" ? "grid" : "none";
    this.panelVideo.style.display = tab === "video" ? "grid" : "none";
    this.panelLive.style.display = tab === "live" ? "grid" : "none";

    this.sensorPanel.style.display = tab === "live" ? "grid" : "none";
    this.webcamSelect.style.display = tab === "live" ? "block" : "none";
  }

  private setupDragAndDrop(dropArea: HTMLElement, fileInput: HTMLInputElement) {
    dropArea.addEventListener("dragover", e => {
      e.preventDefault();
      dropArea.classList.add("drag-over");
    });
    dropArea.addEventListener("dragleave", () => {
      dropArea.classList.remove("drag-over");
    });
    dropArea.addEventListener("drop", e => {
      e.preventDefault();
      dropArea.classList.remove("drag-over");
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        fileInput.files = files;
        fileInput.dispatchEvent(new Event("change"));
      }
    });
  }

  private handlePhotoSelect() {
    const file = this.fileInputPhoto.files?.[0];
    if (!file) return;

    this.uploadStatus.textContent = `File selected: ${file.name}`;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        this.loadedImage = img;
        this.canvas.width = img.naturalWidth;
        this.canvas.height = img.naturalHeight;
        
        const ctx = this.canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        this.layout.style.display = "grid";
        this.resultCard.style.display = "none";
        this.spawnFurnitureBlock.style.display = "none";
        this.analyzeBtn.disabled = false;
        this.analyzeBtn.textContent = "🔍 Run AI Object Detection";
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  private handleVideoSelect() {
    const file = this.fileInputVideo.files?.[0];
    if (!file) return;

    this.uploadStatus.textContent = `Video selected: ${file.name}`;
    const fileURL = URL.createObjectURL(file);
    
    this.videoElement.src = fileURL;
    this.videoElement.style.display = "none";
    this.videoElement.load();
    
    this.videoElement.onloadedmetadata = () => {
      this.canvas.width = this.videoElement.videoWidth || 640;
      this.canvas.height = this.videoElement.videoHeight || 480;
      
      this.layout.style.display = "grid";
      this.resultCard.style.display = "none";
      this.spawnFurnitureBlock.style.display = "none";
      this.analyzeBtn.disabled = false;
      this.analyzeBtn.textContent = "🎥 Start Real-Time Analysis";
      
      // Draw first frame
      this.videoElement.currentTime = 0;
    };

    this.videoElement.onseeked = () => {
      const ctx = this.canvas.getContext("2d");
      ctx?.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
    };
  }

  private async toggleLiveCamera() {
    if (this.isCameraActive) {
      this.stopLiveStream();
    } else {
      await this.startLiveStream();
    }
  }

  private async startLiveStream() {
    this.modelLoaderText.textContent = "Requesting webcam permissions...";
    this.modelLoader.style.display = "flex";
    
    try {
      if (this.currentStream) {
        this.stopLiveStream();
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.srcObject = this.currentStream;
      this.videoElement.play();

      this.isCameraActive = true;
      this.startLiveBtn.textContent = "🛑 Stop Webcam Stream";
      this.startLiveBtn.classList.add("danger-btn");
      
      this.videoElement.onloadedmetadata = () => {
        this.canvas.width = this.videoElement.videoWidth;
        this.canvas.height = this.videoElement.videoHeight;
        this.layout.style.display = "grid";
        this.modelLoader.style.display = "none";
        this.resultCard.style.display = "block"; // Show running values immediately
        this.analyzeBtn.textContent = "⚡ Real-Time Tracking ON";
        this.analyzeBtn.disabled = true;

        this.startVideoLoop();
      };
      
      // Populate camera choices
      this.populateCameraOptions();

    } catch (err) {
      console.error("Camera access failed", err);
      this.uploadStatus.textContent = "❌ Camera access denied or unavailable.";
      this.modelLoader.style.display = "none";
    }
  }

  private stopLiveStream() {
    this.isCameraActive = false;
    this.isVideoProcessing = false;
    if (this.videoFrameId) {
      cancelAnimationFrame(this.videoFrameId);
      this.videoFrameId = null;
    }
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(t => t.stop());
      this.currentStream = null;
    }
    this.videoElement.srcObject = null;
    this.startLiveBtn.textContent = "📹 Start Webcam Stream";
    this.startLiveBtn.classList.remove("danger-btn");
    this.analyzeBtn.disabled = false;
    this.analyzeBtn.textContent = "🔍 Run AI Object Detection";
  }

  private async populateCameraOptions() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === "videoinput");
      
      if (videoDevices.length > 1) {
        this.webcamSelect.innerHTML = videoDevices.map((d, i) => `
          <option value="${d.deviceId}">${d.label || `Camera ${i + 1}`}</option>
        `).join("");
        this.webcamSelect.style.display = "block";
        
        this.webcamSelect.onchange = async () => {
          const deviceId = this.webcamSelect.value;
          // Restart camera with new ID
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } },
            audio: false
          });
          if (this.currentStream) {
            this.currentStream.getTracks().forEach(t => t.stop());
          }
          this.currentStream = stream;
          this.videoElement.srcObject = stream;
          this.videoElement.play();
        };
      }
    } catch (e) {
      console.warn("Could not list video devices", e);
    }
  }

  private startVideoLoop() {
    let lastAiCheck = 0;
    let detections: DetectedObject[] = [];
    
    const loop = async (timestamp: number) => {
      if (!this.isCameraActive && !this.isVideoProcessing) return;

      const ctx = this.canvas.getContext("2d");
      if (ctx) {
        // Draw video frame to canvas
        ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);

        // Run object detection periodically to avoid lag (e.g. every 500ms)
        if (timestamp - lastAiCheck > 500) {
          lastAiCheck = timestamp;
          try {
            detections = await this.engine.detectObjects(this.canvas);
            
            // Calculate scale and estimate dimensions
            const { pixelsPerMeter, referenceObject } = this.engine.calculateScaleFromObjects(
              detections,
              this.canvas.width
            );
            this.scalePixelsPerMeter = pixelsPerMeter;
            
            const dims = this.engine.estimateRoomDimensionsFromScale(
              pixelsPerMeter,
              this.canvas.width,
              this.canvas.height,
              referenceObject
            );

            // In live camera, if we have pinned points, merge coordinates
            if (this.activeTab === "live") {
              this.recalculatePinnedDimensions(dims);
            }

            this.updateOutputTable(dims, referenceObject);
            this.addMeasurementToHistory(dims);
            this.updateSpawnFurnitureActions(detections);
          } catch (e) {
            console.error("AI frame error", e);
          }
        }

        // Draw overlays on top of frame (every frame to be smooth)
        this.drawOverlays(ctx, detections);
      }

      this.videoFrameId = requestAnimationFrame(loop);
    };

    this.videoFrameId = requestAnimationFrame(loop);
  }

  private async runAIDetection() {
    if (this.activeTab === "video") {
      // Toggle video play / pause processing
      if (this.isVideoProcessing) {
        this.videoElement.pause();
        this.isVideoProcessing = false;
        this.analyzeBtn.textContent = "🎥 Resume Video Analysis";
      } else {
        this.videoElement.play();
        this.isVideoProcessing = true;
        this.analyzeBtn.textContent = "⏸ Pause Video Analysis";
        this.resultCard.style.display = "block";
        this.startVideoLoop();
      }
      return;
    }

    // Photo Tab Mode
    if (!this.loadedImage) return;

    this.modelLoaderText.textContent = "AI model detecting objects...";
    this.modelLoader.style.display = "flex";
    this.analyzeBtn.disabled = true;

    try {
      const detections = await this.engine.detectObjects(this.canvas);
      
      const { pixelsPerMeter, referenceObject } = this.engine.calculateScaleFromObjects(
        detections,
        this.canvas.width
      );
      this.scalePixelsPerMeter = pixelsPerMeter;

      const dims = this.engine.estimateRoomDimensionsFromScale(
        pixelsPerMeter,
        this.canvas.width,
        this.canvas.height,
        referenceObject
      );

      this.modelLoader.style.display = "none";
      this.resultCard.style.display = "block";
      this.analyzeBtn.disabled = false;
      this.analyzeBtn.textContent = "🔍 Re-analyse";

      // Draw static final canvas with boxes
      const ctx = this.canvas.getContext("2d")!;
      ctx.drawImage(this.loadedImage, 0, 0);
      this.drawOverlays(ctx, detections);
      this.drawDimensionLinesOnCanvas(ctx, dims);

      this.updateOutputTable(dims, referenceObject);
      this.addMeasurementToHistory(dims);
      this.updateSpawnFurnitureActions(detections);

    } catch (err) {
      console.error(err);
      this.modelLoader.style.display = "none";
      this.analyzeBtn.disabled = false;
      this.analyzeBtn.textContent = "🔍 Try Again";
    }
  }

  private drawOverlays(ctx: CanvasRenderingContext2D, detections: DetectedObject[]) {
    // 1. Draw detected object bounding boxes with clean visual styles
    for (const obj of detections) {
      const [x, y, w, h] = obj.bbox;
      
      // Neon green glow for objects
      ctx.strokeStyle = "rgba(45, 212, 191, 0.85)";
      ctx.lineWidth = Math.max(2, this.canvas.width / 400);
      ctx.shadowColor = "rgba(45, 212, 191, 0.4)";
      ctx.shadowBlur = 8;
      
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0; // Reset blur

      // Box tag background
      ctx.fillStyle = "rgba(20, 30, 25, 0.85)";
      ctx.fillRect(x, y - 24, Math.max(100, w * 0.6), 24);

      // Box border
      ctx.strokeStyle = "rgba(45, 212, 191, 0.4)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y - 24, Math.max(100, w * 0.6), 24);

      // Label text
      ctx.fillStyle = "#2dd4bf";
      ctx.font = "bold 11px Inter, sans-serif";
      const sizeStr = obj.estimatedSize ? ` (${obj.estimatedSize.width}x${obj.estimatedSize.depth}m)` : "";
      ctx.fillText(`${obj.class.toUpperCase()} ${obj.confidence}%${sizeStr}`, x + 6, y - 8);
    }

    // 2. Draw HUD if in Live Camera Mode
    if (this.activeTab === "live") {
      this.drawHUD(ctx);
    }
  }

  private drawHUD(ctx: CanvasRenderingContext2D) {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    
    // Crosshair in center
    ctx.strokeStyle = "rgba(247, 201, 72, 0.9)"; // Gold
    ctx.lineWidth = 2;
    
    // Center Circle
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.stroke();
    
    // Center Dot
    ctx.fillStyle = "rgba(247, 201, 72, 0.9)";
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    // Crosshair ticks
    ctx.beginPath();
    ctx.moveTo(cx - 24, cy); ctx.lineTo(cx - 14, cy);
    ctx.moveTo(cx + 14, cy); ctx.lineTo(cx + 24, cy);
    ctx.moveTo(cx, cy - 24); ctx.lineTo(cx, cy - 14);
    ctx.moveTo(cx, cy + 14); ctx.lineTo(cx, cy + 24);
    ctx.stroke();

    // 3D Level / Pitch Indicators (Aviation Gyro HUD style)
    const pitchOffset = (this.devicePitch - 30) * 3; // Shift HUD lines based on pitch
    const rollRad = this.deviceRoll * (Math.PI / 180);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rollRad);

    // Roll indicator ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 120, 0, Math.PI * 2);
    ctx.stroke();

    // Level Pitch bar lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
    ctx.beginPath();
    // Horizon line
    ctx.moveTo(-70, -pitchOffset);
    ctx.lineTo(-20, -pitchOffset);
    ctx.moveTo(20, -pitchOffset);
    ctx.lineTo(70, -pitchOffset);
    
    // Upper pitch lines (10 degree intervals)
    ctx.moveTo(-40, -pitchOffset - 30); ctx.lineTo(-15, -pitchOffset - 30);
    ctx.moveTo(15, -pitchOffset - 30);  ctx.lineTo(40, -pitchOffset - 30);
    
    // Lower pitch lines (10 degree intervals)
    ctx.moveTo(-40, -pitchOffset + 30); ctx.lineTo(-15, -pitchOffset + 30);
    ctx.moveTo(15, -pitchOffset + 30);  ctx.lineTo(40, -pitchOffset + 30);
    ctx.stroke();
    
    ctx.restore();

    // Render pinned points if any exist
    ctx.fillStyle = "rgba(239, 68, 68, 0.9)"; // Red pin
    ctx.font = "bold 10px Inter, Arial";

    const drawPin = (pt: { x: number; z: number } | null, label: string) => {
      if (!pt) return;
      // Reproject back onto canvas coordinate using inverse calculation
      // For visual preview, we place them at representative points on canvas
      const xCanvas = cx + (pt.x / pt.z) * (cx / Math.tan(30 * Math.PI / 180));
      // Estimate vertical offset based on depth
      const yCanvas = cy - ((1.5 / pt.z) * cy); // rough y projection
      
      ctx.beginPath();
      ctx.arc(xCanvas, yCanvas, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(label, xCanvas + 10, yCanvas - 6);
    };

    if (this.pinnedPoints.depth) drawPin(this.pinnedPoints.depth, "WALL BASE");
    if (this.pinnedPoints.left) drawPin(this.pinnedPoints.left, "LEFT CORNER");
    if (this.pinnedPoints.right) drawPin(this.pinnedPoints.right, "RIGHT CORNER");
  }

  private pinPoint(type: "depth" | "left" | "right" | "height") {
    if (this.activeTab !== "live") return;
    
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const heightVal = Number(this.sensorHeightInput.value);
    
    const pt = this.engine.calculate3DPoint(
      cx,
      cy,
      this.canvas.width,
      this.canvas.height,
      heightVal,
      this.devicePitch,
      this.deviceRoll
    );

    if (type === "depth") {
      this.pinnedPoints.depth = { x: pt.x, z: pt.z };
      this.uploadStatus.textContent = `📍 Pinned Wall Base. Est. Distance: ${pt.distance.toFixed(2)}m.`;
    } else if (type === "left") {
      this.pinnedPoints.left = { x: pt.x, z: pt.z };
      this.uploadStatus.textContent = `📍 Pinned Left Wall Corner.`;
    } else if (type === "right") {
      this.pinnedPoints.right = { x: pt.x, z: pt.z };
      this.uploadStatus.textContent = `📍 Pinned Right Wall Corner.`;
    } else if (type === "height") {
      // For ceiling, we pin standard height
      this.pinnedPoints.ceiling = { x: pt.x, y: pt.y + 3.0, z: pt.z }; // rough mock ceiling height pin
      this.uploadStatus.textContent = `📍 Pinned Ceiling Point.`;
    }

    // Force recalibrate measurements
    this.runAIDetection();
  }

  private recalculatePinnedDimensions(dims: RoomMeasurements) {
    // Overwrite dimensions if pins are defined
    if (this.pinnedPoints.left && this.pinnedPoints.right) {
      const pL = this.pinnedPoints.left;
      const pR = this.pinnedPoints.right;
      const dx = pR.x - pL.x;
      const dz = pR.z - pL.z;
      const width = Math.sqrt(dx * dx + dz * dz);
      dims.width = Number(width.toFixed(2));
    }
    
    if (this.pinnedPoints.depth) {
      const depthVal = Math.sqrt(this.pinnedPoints.depth.x * this.pinnedPoints.depth.x + this.pinnedPoints.depth.z * this.pinnedPoints.depth.z);
      dims.length = Number(depthVal.toFixed(2));
    }

    dims.area = Number((dims.width * dims.length).toFixed(2));
    dims.perimeter = Number((2 * (dims.width + dims.length)).toFixed(2));
    dims.notes = "Calibrated via live orientation and pinned floor points.";
    dims.confidence = "high";
  }

  private clearPins() {
    this.pinnedPoints = { depth: null, left: null, right: null, height: null, ceiling: null };
    this.uploadStatus.textContent = "Pins cleared. Aim and record again.";
  }

  private drawDimensionLinesOnCanvas(ctx: CanvasRenderingContext2D, dims: RoomMeasurements) {
    const cW = this.canvas.width;
    const cH = this.canvas.height;
    const fontSize = Math.max(14, Math.min(cW, cH) / 40);
    ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;

    const drawLabel = (x1: number, y1: number, x2: number, y2: number, label: string) => {
      ctx.strokeStyle = "rgba(187, 30, 45, 0.9)"; // SKS Brand Red
      ctx.fillStyle = "rgba(187, 30, 45, 0.9)";
      ctx.lineWidth = Math.max(3, cW / 300);
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Label background block
      const tw = ctx.measureText(label).width;
      const bw = tw + 20;
      const bh = fontSize + 12;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      
      ctx.fillStyle = "rgba(25, 36, 31, 0.95)";
      ctx.fillRect(mx - bw/2, my - bh/2, bw, bh);
      ctx.strokeStyle = "#e7c77a"; // Gold frame
      ctx.lineWidth = 1;
      ctx.strokeRect(mx - bw/2, my - bh/2, bw, bh);
      
      ctx.fillStyle = "#fff";
      ctx.fillText(label, mx - tw/2, my + fontSize/3);
    };

    const wFt = (dims.width * 3.28084).toFixed(1);
    const lFt = (dims.length * 3.28084).toFixed(1);
    const hFt = (dims.height * 3.28084).toFixed(1);

    // Draw Width, Depth, Height markers on the room photo
    drawLabel(cW * 0.1, cH * 0.9, cW * 0.9, cH * 0.9, `Width: ${wFt} ft (${dims.width} m)`);
    drawLabel(cW * 0.08, cH * 0.85, cW * 0.08, cH * 0.15, `Depth: ${lFt} ft (${dims.length} m)`);
    drawLabel(cW * 0.92, cH * 0.15, cW * 0.92, cH * 0.85, `Height: ${hFt} ft (${dims.height} m)`);
  }

  private updateOutputTable(dims: RoomMeasurements, refObj: DetectedObject | null) {
    const wFt = (dims.width * 3.28084).toFixed(1);
    const lFt = (dims.length * 3.28084).toFixed(1);
    const hFt = (dims.height * 3.28084).toFixed(1);
    const areaFt = (dims.area * 10.7639).toFixed(1);

    this.dimWFt.textContent = `${wFt} ft`;
    this.dimWM.textContent = `${dims.width.toFixed(2)} m`;
    this.dimLFt.textContent = `${lFt} ft`;
    this.dimLM.textContent = `${dims.length.toFixed(2)} m`;
    this.dimHFt.textContent = `${hFt} ft`;
    this.dimHM.textContent = `${dims.height.toFixed(2)} m`;
    this.dimAreaFt.textContent = `${areaFt} sq ft`;
    this.dimAreaM.textContent = `${dims.area.toFixed(2)} m²`;

    this.autoScaleDisplay.textContent = refObj
      ? `${refObj.class} (scale: ${this.scalePixelsPerMeter.toFixed(0)}px/m)`
      : "Frustum standard frustum projection";
  }

  private addMeasurementToHistory(dims: RoomMeasurements) {
    // Keep max 50 points
    if (this.measurementsHistory.length > 50) {
      this.measurementsHistory.shift();
    }
    
    this.measurementsHistory.push(dims);
    this.chartFramesCount.textContent = `${this.measurementsHistory.length} frames`;
    
    this.updateChart();
  }

  private initChart() {
    const chartCanvas = document.getElementById("measure-trend-chart") as HTMLCanvasElement;
    if (!chartCanvas) return;

    this.chart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Width (m)",
            data: [],
            borderColor: "#2dd4bf", // teal
            backgroundColor: "rgba(45, 212, 191, 0.1)",
            borderWidth: 2,
            tension: 0.2
          },
          {
            label: "Length/Depth (m)",
            data: [],
            borderColor: "#bb1e2d", // red
            backgroundColor: "rgba(187, 30, 45, 0.1)",
            borderWidth: 2,
            tension: 0.2
          },
          {
            label: "Height (m)",
            data: [],
            borderColor: "#f7c948", // gold
            backgroundColor: "rgba(247, 201, 72, 0.1)",
            borderWidth: 2,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { display: false },
          y: {
            grid: { color: "rgba(255,255,255,0.06)" },
            ticks: { color: "#888", font: { size: 9 } }
          }
        }
      }
    });
  }

  private updateChart() {
    if (!this.chart) return;

    const labels = this.measurementsHistory.map((_, i) => i.toString());
    const widths = this.measurementsHistory.map(m => m.width);
    const lengths = this.measurementsHistory.map(m => m.length);
    const heights = this.measurementsHistory.map(m => m.height);

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = widths;
    this.chart.data.datasets[1].data = lengths;
    this.chart.data.datasets[2].data = heights;

    this.chart.update("none"); // Update instantly without animation to be responsive
  }

  private updateSpawnFurnitureActions(detections: DetectedObject[]) {
    // Find if we have sofa, couch or chair
    const furnitureList = detections.filter(d => 
      ["sofa", "couch", "chair", "bed", "dining table"].includes(d.class)
    );

    if (furnitureList.length === 0) {
      this.spawnFurnitureBlock.style.display = "none";
      return;
    }

    this.spawnFurnitureBlock.style.display = "block";
    this.spawnButtonsContainer.innerHTML = furnitureList.map(item => `
      <button class="preset-btn" type="button" data-furniture="${item.class}" style="text-align:left; justify-content:flex-start;">
        🎯 Place 3D ${item.class.toUpperCase()} in Room Preview
      </button>
    `).join("");

    // Bind listeners
    const buttons = this.spawnButtonsContainer.querySelectorAll("button");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const itemClass = btn.getAttribute("data-furniture");
        this.spawnProductInARPreview(itemClass);
      });
    });
  }

  private spawnProductInARPreview(furnitureClass: string | null) {
    if (!furnitureClass) return;

    // Find category element in dropdown
    const select = document.getElementById("furniture-select") as HTMLSelectElement;
    if (!select) return;

    // Try to find a matching option
    let optionIndex = 0;
    for (let i = 0; i < select.options.length; i++) {
      const optionText = select.options[i].text.toLowerCase();
      if (optionText.includes(furnitureClass) || 
          (furnitureClass === "couch" && optionText.includes("sofa"))) {
        optionIndex = i;
        break;
      }
    }

    select.selectedIndex = optionIndex;
    select.dispatchEvent(new Event("change"));

    // Scroll to section 2 (AR Preview)
    document.querySelector(".ar-preview")?.scrollIntoView({ behavior: "smooth" });
  }

  private async refineWithGemini() {
    const apiKey = (import.meta.env.VITE_GEMINI_KEY as string) || "";
    if (!apiKey || apiKey.includes("your_gemini_key")) {
      alert("Please set a valid VITE_GEMINI_KEY in the .env file.");
      return;
    }

    this.modelLoaderText.textContent = "Consulting Gemini Vision AI...";
    this.modelLoader.style.display = "flex";

    try {
      // Capture canvas as base64 jpeg
      const base64Image = this.canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: "You are an expert interior architect and computer vision engine. Analyze this room photo. Estimate the room's width, length (depth), and ceiling height in meters (m). Standard doors are 2.1m high, kitchen counters are 0.9m high, dining tables are 0.75m high, and chairs are 0.45m high. Use these to auto-calibrate. Return ONLY a JSON object containing keys: widthM, lengthM, heightM, confidence ('high'|'medium'|'low'), and notes. Do not include markdown code blocks, backticks, or any text other than the JSON."
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        throw new Error("Gemini API call failed");
      }

      const resData = await response.json();
      const content = resData.candidates[0].content.parts[0].text;
      const cleanJson = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const aiEst = JSON.parse(cleanJson);

      const dims: RoomMeasurements = {
        width: Number(aiEst.widthM || aiEst.widthFt * 0.3048),
        length: Number(aiEst.lengthM || aiEst.lengthFt * 0.3048),
        height: Number(aiEst.heightM || aiEst.heightFt * 0.3048),
        area: 0,
        perimeter: 0,
        detectedObjects: [],
        confidence: aiEst.confidence || "medium",
        notes: `Gemini Vision Refined: ${aiEst.notes || "Analyzed room dimensions."}`,
        timestamp: new Date()
      };
      
      dims.area = Number((dims.width * dims.length).toFixed(2));
      dims.perimeter = Number((2 * (dims.width + dims.length)).toFixed(2));

      this.modelLoader.style.display = "none";
      this.resultCard.style.display = "block";

      // Redraw canvas with updated scales
      const ctx = this.canvas.getContext("2d")!;
      if (this.loadedImage) {
        ctx.drawImage(this.loadedImage, 0, 0);
      }
      this.drawDimensionLinesOnCanvas(ctx, dims);

      this.updateOutputTable(dims, null);
      this.addMeasurementToHistory(dims);

    } catch (err) {
      console.error(err);
      this.modelLoader.style.display = "none";
      alert("Error refining with Gemini. Make sure your internet connection and API key are valid.");
    }
  }

  private setupGyroscope() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", (event) => {
        if (event.beta !== null && event.gamma !== null) {
          this.hasDeviceOrientation = true;
          
          // Pitch represents tilt forwards/backwards
          this.devicePitch = Math.round(event.beta);
          // Roll represents lateral tilt
          this.deviceRoll = Math.round(event.gamma);
          
          // Keep pitch input values synchronized
          this.sensorPitchInput.value = Math.max(0, Math.min(80, this.devicePitch)).toString();
          this.sensorPitchVal.textContent = `${this.sensorPitchInput.value}°`;
        }
      }, true);
    }
  }

  private setupDraggableARPreview() {
    const furnitureOverlay = document.getElementById("furniture-overlay") as HTMLImageElement | null;
    const roomScene = document.getElementById("room-scene") as HTMLDivElement | null;
    const posX = document.getElementById("pos-x") as HTMLInputElement | null;
    const posY = document.getElementById("pos-y") as HTMLInputElement | null;

    if (!furnitureOverlay || !roomScene || !posX || !posY) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialXPercent = 20;
    let initialYPercent = 45;

    const onStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDragging = true;
      furnitureOverlay.style.cursor = "grabbing";

      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

      startX = clientX;
      startY = clientY;
      initialXPercent = Number(posX.value);
      initialYPercent = Number(posY.value);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      // Get width and height of container
      const containerWidth = roomScene.clientWidth;
      const containerHeight = roomScene.clientHeight;

      // Convert delta pixels to percentage of container
      const deltaXPercent = (deltaX / containerWidth) * 100;
      const deltaYPercent = (deltaY / containerHeight) * 100;

      let newXPercent = Math.max(0, Math.min(100, initialXPercent + deltaXPercent));
      let newYPercent = Math.max(0, Math.min(100, initialYPercent + deltaYPercent));

      posX.value = Math.round(newXPercent).toString();
      posY.value = Math.round(newYPercent).toString();
      
      // Dispatch input event to trigger updateOverlayControls() in main
      posX.dispatchEvent(new Event("input"));
      posY.dispatchEvent(new Event("input"));
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      furnitureOverlay.style.cursor = "grab";
    };

    // Attach listeners
    furnitureOverlay.addEventListener("mousedown", onStart);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);

    furnitureOverlay.addEventListener("touchstart", onStart, { passive: false });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
  }

  private downloadSnapshot() {
    const a = document.createElement("a");
    a.download = `SKS_AI_Room_Measurements_${new Date().getTime()}.png`;
    a.href = this.canvas.toDataURL("image/png");
    a.click();
  }

  private resetWorkspace() {
    this.stopLiveStream();
    this.loadedImage = null;
    this.isVideoProcessing = false;
    this.measurementsHistory = [];
    this.clearPins();

    const ctx = this.canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.layout.style.display = "none";
    this.resultCard.style.display = "none";
    this.spawnFurnitureBlock.style.display = "none";
    
    // Clear file selection
    this.fileInputPhoto.value = "";
    this.fileInputVideo.value = "";
    
    this.uploadStatus.textContent = "Select a source to begin AI scanning.";

    if (this.chart) {
      this.chart.data.labels = [];
      this.chart.data.datasets.forEach((d: any) => d.data = []);
      this.chart.update();
    }
  }
}
