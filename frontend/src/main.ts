/**
 * Main Application Entry Point
 * Initializes the app based on page type
 */

import { RoomMeasurementUI } from './room-measurement-ui';

// Detect the current page based on data-page attribute
function initializeApp(): void {
  const pageType = document.body.getAttribute('data-page');

  switch (pageType) {
    case 'measure':
      initializeRoomMeasurement();
      break;
    case 'ai':
      initializeAIStudio();
      break;
    case 'home':
    default:
      initializeHomePage();
      break;
  }
}

/**
 * Initialize Room Measurement page
 */
function initializeRoomMeasurement(): void {
  console.log('Initializing Room Measurement page...');

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      try {
        const ui = new RoomMeasurementUI('app');
        console.log('Room Measurement UI initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Room Measurement UI:', error);
        document.getElementById('app')!.innerHTML =
          '<p style="color: red;">Failed to load Room Measurement. Please refresh the page.</p>';
      }
    });
  } else {
    try {
      const ui = new RoomMeasurementUI('app');
      console.log('Room Measurement UI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Room Measurement UI:', error);
      document.getElementById('app')!.innerHTML =
        '<p style="color: red;">Failed to load Room Measurement. Please refresh the page.</p>';
    }
  }
}

/**
 * Initialize AI Studio page with room measurement
 */
function initializeAIStudio(): void {
  console.log('Initializing AI Studio page...');

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      try {
        // Create a header for AI Studio
        const app = document.getElementById('app');
        if (app) {
          app.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
              <h1 style="color: #333; margin-bottom: 0.5rem;">AI Studio</h1>
              <p style="color: #666; margin-bottom: 2rem;">Advanced AI-powered tools for your furniture showroom</p>
            </div>
          `;

          // Create container for room measurement UI
          const measurementContainer = document.createElement('div');
          measurementContainer.id = 'room-measurement-container';
          app.appendChild(measurementContainer);

          // Initialize Room Measurement UI
          const ui = new RoomMeasurementUI('room-measurement-container');
          console.log('AI Studio with Room Measurement initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize AI Studio:', error);
        const app = document.getElementById('app');
        if (app) {
          app.innerHTML =
            '<p style="color: red; padding: 2rem;">Failed to load AI Studio. Please refresh the page.</p>';
        }
      }
    });
  } else {
    try {
      // Create a header for AI Studio
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = `
          <div style="padding: 2rem; text-align: center;">
            <h1 style="color: #333; margin-bottom: 0.5rem;">AI Studio</h1>
            <p style="color: #666; margin-bottom: 2rem;">Advanced AI-powered tools for your furniture showroom</p>
          </div>
        `;

        // Create container for room measurement UI
        const measurementContainer = document.createElement('div');
        measurementContainer.id = 'room-measurement-container';
        app.appendChild(measurementContainer);

        // Initialize Room Measurement UI
        const ui = new RoomMeasurementUI('room-measurement-container');
        console.log('AI Studio with Room Measurement initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize AI Studio:', error);
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML =
          '<p style="color: red; padding: 2rem;">Failed to load AI Studio. Please refresh the page.</p>';
      }
    }
  }
}

/**
 * Initialize home page
 */
function initializeHomePage(): void {
  console.log('Initializing Home page...');

  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div style="padding: 2rem; text-align: center;">
        <h1 style="color: #333;">Welcome to SREE KRISHNA STEELS</h1>
        <p style="color: #666;">
          <a href="ai-room-designer.html">Visit AI Studio</a> |
          <a href="room-measure.html">Room Measurement</a>
        </p>
      </div>
    `;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Also call immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
