import '@testing-library/jest-dom';

// Mock window.location for URL parameter testing
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    search: '',
    href: '',
    pathname: '',
    origin: 'http://localhost:3001',
  },
});

/**
 * Mock ResizeObserver class for testing environment
 * 
 * ResizeObserver is a native web API that's used by Radix UI components (like Select, Slider, etc.)
 * to detect when elements change size and adjust their positioning accordingly. Since jsdom doesn't
 * provide this API, we need to mock it to prevent "ResizeObserver is not defined" errors during tests.
 * 
 * This mock provides the basic interface that Radix UI components expect, allowing our tests
 * to run without throwing errors when components try to observe element size changes.
 */
class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {
    // Mock implementation - in real usage, this would start observing size changes
  }
  
  unobserve() {
    // Mock implementation - in real usage, this would stop observing a specific element
  }
  
  disconnect() {
    // Mock implementation - in real usage, this would stop all observations
  }
}

global.ResizeObserver = ResizeObserver;

/**
 * Mock IntersectionObserver class for testing environment
 * 
 * Similar to ResizeObserver, IntersectionObserver is used by some UI components
 * to detect when elements enter/exit the viewport. This mock prevents errors
 * if any components use this API.
 */
class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserver;

// Global test utilities if needed
global.setUrlParams = (params) => {
  const searchParams = new URLSearchParams(params);
  window.location.search = '?' + searchParams.toString();
};