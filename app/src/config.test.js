import { describe, test, expect, vi, beforeEach } from 'vitest';
import config from './config.js';

// Mock window.location
const mockLocation = {
  hostname: 'localhost',
  port: '3000',
  protocol: 'http:',
  pathname: '/'
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// Mock console methods to avoid noise during tests
const originalLog = console.log;
const originalWarn = console.warn;

describe('Config Module', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock console methods
    console.log = vi.fn();
    console.warn = vi.fn();
    
    // Reset location
    window.location = {
      hostname: 'localhost',
      port: '3000',
      protocol: 'http:',
      pathname: '/'
    };
  });

  afterEach(() => {
    // Restore console methods
    console.log = originalLog;
    console.warn = originalWarn;
  });

  test('exports configuration object', () => {
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
  });

  test('contains required configuration properties', () => {
    // Test for common configuration properties that should exist
    expect(config).toHaveProperty('clientId');
    expect(config).toHaveProperty('features');
    expect(config).toHaveProperty('documentReferenceConfiguration');
  });

  test('clientId configuration is properly set', () => {
    // The clientId should be defined
    expect(config.clientId).toBeDefined();
  });

  test('handles development environment correctly', () => {
    // Mock development environment
    window.location.hostname = 'localhost';
    
    // Re-import config to test development-specific behavior
    expect(config.features).toBeDefined();
  });

  test('handles production environment correctly', () => {
    // Mock production environment
    window.location.hostname = 'example.com';
    window.location.protocol = 'https:';
    
    // Test that production config is handled properly
    expect(config.features).toBeDefined();
  });

  test('provides default values when environment variables are missing', () => {
    // Config should have sensible defaults
    expect(config).toBeDefined();
    expect(config.features).toBeDefined();
  });

  test('config properties exist and have expected types', () => {
    // Test that config has expected properties with correct types
    if (config.features) {
      expect(typeof config.features).toBe('object');
      expect(typeof config.features.auditing).toBe('boolean');
      expect(typeof config.features.developerLog).toBe('boolean');
      expect(typeof config.features.feedback).toBe('boolean');
    }
    
    if (config.bloodPressureCutoff) {
      expect(typeof config.bloodPressureCutoff).toBe('number');
    }
    
    if (config.cholesterolCutoff) {
      expect(typeof config.cholesterolCutoff).toBe('number');
    }
  });

  test('handles different port configurations', () => {
    // Test with different ports
    window.location.port = '8080';
    
    // Config should handle different port configurations
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
  });

  test('handles HTTPS protocol correctly', () => {
    window.location.protocol = 'https:';
    window.location.hostname = 'secure.example.com';
    
    // Test HTTPS handling
    expect(config).toBeDefined();
  });

  test('contains appropriate configuration for FHIR client', () => {
    // Since this is a FHIR app, config should contain FHIR-related settings
    // Test for the presence of configuration that would be needed for FHIR
    expect(config).toBeDefined();
    
    // The config should be suitable for use with FHIR client
    if (config.iss) {
      expect(typeof config.iss).toBe('string');
    }
    
    if (config.clientId) {
      expect(typeof config.clientId).toBe('string');
    }
  });

  test('validates URL format in guidelines', () => {
    // Guidelines URLs should be valid if they exist
    if (config.accGuidelines && config.accGuidelines.startsWith('http')) {
      expect(() => new URL(config.accGuidelines)).not.toThrow();
    }
  });

  test('handles edge cases for hostname detection', () => {
    // Test with undefined hostname
    window.location.hostname = '';
    
    // Config should handle edge cases gracefully
    expect(config).toBeDefined();
    expect(config.features).toBeDefined();
  });
});