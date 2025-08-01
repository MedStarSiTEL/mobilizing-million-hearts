import { describe, test, expect } from 'vitest';
import * as constants from './constants.js';

describe('Constants Module', () => {
  test('exports constants object', () => {
    expect(constants).toBeDefined();
    expect(typeof constants).toBe('object');
  });

  test('contains resource constants', () => {
    // Test for resource constants that should be present
    expect(constants.RESOURCES).toBeDefined();
    expect(typeof constants.RESOURCES).toBe('object');
  });

  test('resource constants have correct structure', () => {
    const { RESOURCES } = constants;
    
    // Common resources that should exist based on the app structure
    expect(RESOURCES.CONDITION).toBeDefined();
    expect(RESOURCES.OBSERVATION).toBeDefined();
    expect(RESOURCES.MEDICATIONSTATEMENT).toBeDefined();
    
    // Ensure they are strings
    expect(typeof RESOURCES.CONDITION).toBe('string');
    expect(typeof RESOURCES.OBSERVATION).toBe('string');
    expect(typeof RESOURCES.MEDICATIONSTATEMENT).toBe('string');
  });

  test('contains validation constants', () => {
    // Validation constants should be defined for form validation
    expect(constants.VALIDATION).toBeDefined();
    expect(typeof constants.VALIDATION).toBe('object');
    
    // Common validation fields
    expect(constants.VALIDATION.age).toBeDefined();
    expect(constants.VALIDATION.totalCholesterol).toBeDefined();
    expect(constants.VALIDATION.systolicBloodPressure).toBeDefined();
    expect(constants.VALIDATION.hdlCholesterol).toBeDefined();
  });

  test('contains disclaimer text', () => {
    // Test for disclaimer constant
    expect(constants.DISCLAIMER).toBeDefined();
    expect(typeof constants.DISCLAIMER).toBe('string');
    expect(constants.DISCLAIMER.length).toBeGreaterThan(0);
  });

  test('validation messages are properly structured', () => {
    // Each validation should have proper messages
    Object.keys(constants.VALIDATION).forEach(field => {
      const validation = constants.VALIDATION[field];
      expect(Array.isArray(validation)).toBe(true);
      expect(validation.length).toBe(2); // Should have two messages: missing and out of range
      
      validation.forEach(message => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  test('resource constants have expected values', () => {
    // Test that resource constants have the expected FHIR resource names
    expect(constants.RESOURCES.CONDITION).toBe('Condition');
    expect(constants.RESOURCES.OBSERVATION).toBe('Observation');
    expect(constants.RESOURCES.MEDICATIONSTATEMENT).toBe('MedicationStatement');
  });

  test('string constants are non-empty', () => {
    // Ensure string constants are meaningful
    expect(constants.DISCLAIMER.length).toBeGreaterThan(0);
    
    Object.keys(constants.RESOURCES).forEach(key => {
      const value = constants.RESOURCES[key];
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });
});