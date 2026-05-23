/**
 * Room Measurement UI Component
 * Handles the user interface for AI room measurements
 */

import { AiRoomMeasurement, RoomMeasurements } from './ai-room-measurement';
import Chart from 'chart.js/auto';

class RoomMeasurementUI {
  private container: HTMLElement;
  private aiMeasurement: AiRoomMeasurement;
  private chart: Chart | null = null;
  private measurementHistory: RoomMeasurements[] = [];

  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = element;
    this.aiMeasurement = new AiRoomMeasurement();
    this.initializeUI();
  }

  /**
   * Initialize UI components
   */
  private initializeUI(): void {
    this.container.innerHTML = `
      <div class="room-measurement-container">
        <div class="measurement-header">
          <h1>AI Room Measurement</h1>
          <p class="subtitle">Upload a photo or video to measure your room dimensions</p>
        </div>

        <div class="measurement-content">
          <div class="input-section">
            <div class="input-tabs">
              <button class="tab-btn active" data-tab="photo">📷 Photo</button>
              <button class="tab-btn" data-tab="video">🎥 Video</button>
              <button class="tab-btn" data-tab="camera">📹 Live Camera</button>
            </div>

            <div class="tab-content">
              <!-- Photo Tab -->
              <div class="tab-pane active" id="photo-tab">
                <div class="upload-area" id="photoUploadArea">
                  <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p>Drag and drop an image here, or click to select</p>
                  <input type="file" id="photoInput" accept="image/*" hidden />
                </div>
              </div>

              <!-- Video Tab -->
              <div class="tab-pane" id="video-tab">
                <div class="upload-area" id="videoUploadArea">
                  <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  <p>Drag and drop a video here, or click to select</p>
                  <input type="file" id="videoInput" accept="video/*" hidden />
                </div>
                <video id="videoPreview" style="display: none; max-width: 100%; margin-top: 1rem;"></video>
              </div>

              <!-- Camera Tab -->
              <div class="tab-pane" id="camera-tab">
                <div class="camera-container">
                  <video id="cameraStream" autoplay playsinline style="width: 100%; max-width: 100%;"></video>
                  <div class="camera-controls">
                    <button id="startCameraBtn" class="btn btn-primary">Start Camera</button>
                    <button id="stopCameraBtn" class="btn btn-secondary" disabled>Stop Camera</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="preview-section">
            <div id="imagePreview" class="preview-area"></div>
          </div>
        </div>

        <div class="results-section" id="resultsSection" style="display: none;">
          <div class="measurements-grid">
            <div class="measurement-card">
              <span class="label">Width</span>
              <span class="value" id="widthValue">-</span>
              <span class="unit">meters</span>
            </div>
            <div class="measurement-card">
              <span class="label">Height</span>
              <span class="value" id="heightValue">-</span>
              <span class="unit">meters</span>
            </div>
            <div class="measurement-card">
              <span class="label">Depth</span>
              <span class="value" id="depthValue">-</span>
              <span class="unit">meters</span>
            </div>
            <div class="measurement-card">
              <span class="label">Area</span>
              <span class="value" id="areaValue">-</span>
              <span class="unit">sq. meters</span>
            </div>
            <div class="measurement-card">
              <span class="label">Perimeter</span>
              <span class="value" id="perimeterValue">-</span>
              <span class="unit">meters</span>
            </div>
            <div class="measurement-card">
              <span class="label">Confidence</span>
              <span class="value" id="confidenceValue">-</span>
              <span class="unit">%</span>
            </div>
          </div>

          <div class="detected-objects">
            <h3>Detected Objects</h3>
            <div id="objectsList" class="objects-list"></div>
          </div>

          <div class="chart-section">
            <canvas id="measurementChart"></canvas>
          </div>

          <div class="action-buttons">
            <button id="downloadReportBtn" class="btn btn-primary">📥 Download Report</button>
            <button id="resetBtn" class="btn btn-secondary">🔄 Reset</button>
          </div>
        </div>

        <div class="loading-indicator" id="loadingIndicator" style="display: none;">
          <div class="spinner"></div>
          <p>Analyzing room...</p>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.loadStyles();
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    // Tab switching
    const tabBtns = this.container.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => this.switchTab(e.target as HTMLElement));
    });

    // Photo upload
    const photoUploadArea = this.container.querySelector('#photoUploadArea');
    const photoInput = this.container.querySelector('#photoInput') as HTMLInputElement;

    photoUploadArea?.addEventListener('click', () => photoInput.click());
    photoUploadArea?.addEventListener('dragover', (e) => e.preventDefault());
    photoUploadArea?.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = (e as DragEvent).dataTransfer?.files;
      if (files) this.handlePhotoUpload(files[0]);
    });
    photoInput?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) this.handlePhotoUpload(file);
    });

    // Video upload
    const videoUploadArea = this.container.querySelector('#videoUploadArea');
    const videoInput = this.container.querySelector('#videoInput') as HTMLInputElement;

    videoUploadArea?.addEventListener('click', () => videoInput.click());
    videoUploadArea?.addEventListener('dragover', (e) => e.preventDefault());
    videoUploadArea?.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = (e as DragEvent).dataTransfer?.files;
      if (files) this.handleVideoUpload(files[0]);
    });
    videoInput?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) this.handleVideoUpload(file);
    });

    // Camera controls
    this.container.querySelector('#startCameraBtn')?.addEventListener('click', () => this.startCamera());
    this.container.querySelector('#stopCameraBtn')?.addEventListener('click', () => this.stopCamera());

    // Action buttons
    this.container.querySelector('#downloadReportBtn')?.addEventListener('click', () => this.downloadReport());
    this.container.querySelector('#resetBtn')?.addEventListener('click', () => this.reset());
  }

  /**
   * Switch between tabs
   */
  private switchTab(tab: HTMLElement): void {
    // Remove active class from all tabs and panes
    this.container.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));
    this.container.querySelectorAll('.tab-pane').forEach((pane) => pane.classList.remove('active'));

    // Add active class to clicked tab
    tab.classList.add('active');
    const tabName = tab.getAttribute('data-tab');
    const pane = this.container.querySelector(`#${tabName}-tab`);
    pane?.classList.add('active');
  }

  /**
   * Handle photo upload
   */
  private async handlePhotoUpload(file: File): Promise<void> {
    this.showLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          // Display preview
          const previewArea = this.container.querySelector('#imagePreview') as HTMLElement;
          previewArea.innerHTML = '';
          previewArea.appendChild(img);

          // Analyze image
          const measurements = await this.aiMeasurement.analyzeImage(img);
          this.displayResults(measurements);
          this.measurementHistory.push(measurements);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing photo:', error);
      alert('Error processing photo. Please try again.');
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Handle video upload
   */
  private async handleVideoUpload(file: File): Promise<void> {
    const videoPreview = this.container.querySelector('#videoPreview') as HTMLVideoElement;
    const url = URL.createObjectURL(file);
    videoPreview.src = url;
    videoPreview.style.display = 'block';

    this.showLoading(true);

    try {
      await new Promise((resolve) => {
        videoPreview.onloadedmetadata = resolve;
      });

      // Analyze first frame
      const canvas = document.createElement('canvas');
      canvas.width = videoPreview.videoWidth;
      canvas.height = videoPreview.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoPreview, 0, 0);
        const measurements = await this.aiMeasurement.analyzeImage(canvas);
        this.displayResults(measurements);
        this.measurementHistory.push(measurements);
      }
    } catch (error) {
      console.error('Error processing video:', error);
      alert('Error processing video. Please try again.');
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Start camera
   */
  private async startCamera(): Promise<void> {
    const videoElement = this.container.querySelector('#cameraStream') as HTMLVideoElement;
    const startBtn = this.container.querySelector('#startCameraBtn') as HTMLButtonElement;
    const stopBtn = this.container.querySelector('#stopCameraBtn') as HTMLButtonElement;

    try {
      await this.aiMeasurement.startVideoAnalysis(videoElement, (measurements) => {
        this.displayResults(measurements);
        this.measurementHistory.push(measurements);
      });

      startBtn.disabled = true;
      stopBtn.disabled = false;
    } catch (error) {
      console.error('Error starting camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  }

  /**
   * Stop camera
   */
  private stopCamera(): void {
    this.aiMeasurement.stopVideoAnalysis();
    const startBtn = this.container.querySelector('#startCameraBtn') as HTMLButtonElement;
    const stopBtn = this.container.querySelector('#stopCameraBtn') as HTMLButtonElement;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }

  /**
   * Display measurement results
   */
  private displayResults(measurements: RoomMeasurements): void {
    const resultsSection = this.container.querySelector('#resultsSection') as HTMLElement;
    resultsSection.style.display = 'block';

    // Update measurement values
    (this.container.querySelector('#widthValue') as HTMLElement).textContent =
      measurements.width.toFixed(2);
    (this.container.querySelector('#heightValue') as HTMLElement).textContent =
      measurements.height.toFixed(2);
    (this.container.querySelector('#depthValue') as HTMLElement).textContent =
      measurements.depth.toFixed(2);
    (this.container.querySelector('#areaValue') as HTMLElement).textContent = measurements.area.toFixed(2);
    (this.container.querySelector('#perimeterValue') as HTMLElement).textContent =
      measurements.perimeter.toFixed(2);
    (this.container.querySelector('#confidenceValue') as HTMLElement).textContent =
      measurements.confidence.toFixed(1);

    // Display detected objects
    const objectsList = this.container.querySelector('#objectsList') as HTMLElement;
    objectsList.innerHTML = measurements.detectedObjects
      .map(
        (obj) => `
      <div class="object-item">
        <span class="object-class">${obj.class}</span>
        <span class="object-confidence">${obj.confidence.toFixed(1)}%</span>
      </div>
    `
      )
      .join('');

    // Update chart
    this.updateChart(measurements);
  }

  /**
   * Update chart with measurement data
   */
  private updateChart(measurements: RoomMeasurements): void {
    const chartCanvas = this.container.querySelector('#measurementChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: ['Width', 'Height', 'Depth'],
        datasets: [
          {
            label: 'Room Dimensions (meters)',
            data: [measurements.width, measurements.height, measurements.depth],
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Room Dimensions',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Meters',
            },
          },
        },
      },
    });
  }

  /**
   * Download measurement report
   */
  private downloadReport(): void {
    if (this.measurementHistory.length === 0) {
      alert('No measurements to download');
      return;
    }

    const latestMeasurement = this.measurementHistory[this.measurementHistory.length - 1];
    const report = this.generateReport(latestMeasurement);

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
    element.setAttribute('download', `room-measurement-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * Generate report text
   */
  private generateReport(measurements: RoomMeasurements): string {
    return `
==============================================
        ROOM MEASUREMENT REPORT
==============================================

Generated: ${measurements.timestamp.toLocaleString()}

ROOM DIMENSIONS:
  Width: ${measurements.width.toFixed(2)} meters
  Height: ${measurements.height.toFixed(2)} meters
  Depth: ${measurements.depth.toFixed(2)} meters
  Area: ${measurements.area.toFixed(2)} sq. meters
  Perimeter: ${measurements.perimeter.toFixed(2)} meters

DETECTION CONFIDENCE: ${measurements.confidence.toFixed(1)}%

DETECTED OBJECTS:
${measurements.detectedObjects.map((obj) => `  - ${obj.class} (${obj.confidence.toFixed(1)}% confidence)`).join('\n')}

==============================================
This report was generated using AI Room Measurement
Powered by TensorFlow.js and Computer Vision
==============================================
    `;
  }

  /**
   * Reset UI
   */
  private reset(): void {
    this.container.querySelector('#resultsSection')!.setAttribute('style', 'display: none;');
    this.container.querySelector('#imagePreview')!.innerHTML = '';
    this.stopCamera();
    this.measurementHistory = [];
  }

  /**
   * Show/hide loading indicator
   */
  private showLoading(show: boolean): void {
    const indicator = this.container.querySelector('#loadingIndicator') as HTMLElement;
    indicator.style.display = show ? 'flex' : 'none';
  }

  /**
   * Load CSS styles
   */
  private loadStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .room-measurement-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }

      .measurement-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .measurement-header h1 {
        font-size: 2.5rem;
        color: #333;
        margin: 0 0 0.5rem 0;
      }

      .subtitle {
        font-size: 1rem;
        color: #666;
        margin: 0;
      }

      .input-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid #eee;
      }

      .tab-btn {
        padding: 1rem;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-size: 1rem;
        color: #666;
        transition: all 0.3s ease;
      }

      .tab-btn:hover {
        color: #333;
      }

      .tab-btn.active {
        color: #FF6B6B;
        border-bottom-color: #FF6B6B;
      }

      .upload-area {
        border: 2px dashed #ddd;
        border-radius: 8px;
        padding: 3rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .upload-area:hover {
        border-color: #FF6B6B;
        background-color: #fafafa;
      }

      .upload-icon {
        width: 64px;
        height: 64px;
        color: #FF6B6B;
        margin-bottom: 1rem;
      }

      .tab-pane {
        display: none;
      }

      .tab-pane.active {
        display: block;
      }

      .measurements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
      }

      .measurement-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .measurement-card .label {
        font-size: 0.875rem;
        opacity: 0.9;
        margin-bottom: 0.5rem;
      }

      .measurement-card .value {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
      }

      .measurement-card .unit {
        font-size: 0.875rem;
        opacity: 0.8;
      }

      .detected-objects {
        margin: 2rem 0;
      }

      .detected-objects h3 {
        margin-bottom: 1rem;
        color: #333;
      }

      .objects-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .object-item {
        background: #f0f0f0;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      .object-class {
        font-weight: 600;
        color: #333;
      }

      .object-confidence {
        background: #FF6B6B;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
      }

      .chart-section {
        margin: 2rem 0;
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        justify-content: center;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        font-weight: 600;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .btn-secondary {
        background: #f0f0f0;
        color: #333;
      }

      .btn-secondary:hover {
        background: #e0e0e0;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .loading-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
      }

      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .loading-indicator p {
        color: white;
        margin-top: 1rem;
        font-size: 1.25rem;
      }

      .results-section {
        margin-top: 2rem;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @media (max-width: 768px) {
        .measurement-header h1 {
          font-size: 1.75rem;
        }

        .input-tabs {
          flex-wrap: wrap;
        }

        .measurements-grid {
          grid-template-columns: 1fr 1fr;
        }

        .upload-area {
          padding: 2rem 1rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

export { RoomMeasurementUI };
