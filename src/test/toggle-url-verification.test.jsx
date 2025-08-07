import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App.jsx';

beforeEach(() => {
  window.location = {
    search: '',
    href: 'http://localhost:3001/mesa-risk',
    pathname: '/mesa-risk', 
    origin: 'http://localhost:3001',
  };
});

describe('Toggle URL Parameter Verification', () => {
  it('should show no selection when values are empty (default state)', () => {
    window.location.search = '';
    const { container } = render(<App />);
    
    // Find all toggle buttons
    const allToggleButtons = container.querySelectorAll('button[data-state]');
    const selectedButtons = Array.from(allToggleButtons).filter(btn => 
      btn.getAttribute('data-state') === 'on'
    );
    
    console.log('Total toggle buttons found:', allToggleButtons.length);
    console.log('Selected buttons in default state:', selectedButtons.length);
    
    // With empty defaults, no toggle buttons should be selected
    expect(selectedButtons.length).toBe(0);
  });

  it('should show correct selections when URL parameters are provided', () => {
    window.location.search = '?diabetes=yes&smoking=no&familyHistory=yes&lipidMedication=no&hypertensionMedication=yes';
    const { container } = render(<App />);
    
    // Find all toggle buttons
    const allToggleButtons = container.querySelectorAll('button[data-state]');
    const selectedButtons = Array.from(allToggleButtons).filter(btn => 
      btn.getAttribute('data-state') === 'on'
    );
    
    console.log('Toggle buttons with URL params:');
    selectedButtons.forEach(btn => {
      console.log(`- Button "${btn.textContent}" is selected (data-state="${btn.getAttribute('data-state')}")`);
    });
    
    // Should have exactly 5 selected buttons (one for each boolean field)
    expect(selectedButtons.length).toBe(5);
    
    // Check specific selections
    const selectedYes = selectedButtons.filter(btn => btn.textContent.toLowerCase() === 'yes');
    const selectedNo = selectedButtons.filter(btn => btn.textContent.toLowerCase() === 'no');
    
    // From URL: diabetes=yes, familyHistory=yes, hypertensionMedication=yes (3 yes)
    // From URL: smoking=no, lipidMedication=no (2 no)
    expect(selectedYes.length).toBe(3);
    expect(selectedNo.length).toBe(2);
  });

  it('should handle mixed URL parameters correctly', () => {
    window.location.search = '?diabetes=yes&smoking=no';
    const { container } = render(<App />);
    
    const selectedButtons = Array.from(container.querySelectorAll('button[data-state="on"]'));
    
    console.log('Mixed URL params - selected buttons:');
    selectedButtons.forEach(btn => {
      console.log(`- "${btn.textContent}"`);
    });
    
    // Should have exactly 2 selected buttons (diabetes=yes, smoking=no)
    expect(selectedButtons.length).toBe(2);
    
    const selectedYes = selectedButtons.filter(btn => btn.textContent.toLowerCase() === 'yes');
    const selectedNo = selectedButtons.filter(btn => btn.textContent.toLowerCase() === 'no');
    
    expect(selectedYes.length).toBe(1); // diabetes=yes
    expect(selectedNo.length).toBe(1);  // smoking=no
  });

  it('should handle alternative parameter names correctly', () => {
    window.location.search = '?smoke=yes&family=no&statin=yes';
    const { container } = render(<App />);
    
    const selectedButtons = Array.from(container.querySelectorAll('button[data-state="on"]'));
    
    console.log('Alternative param names - selected buttons:');
    selectedButtons.forEach(btn => {
      console.log(`- "${btn.textContent}"`);
    });
    
    // Should have exactly 3 selected buttons
    expect(selectedButtons.length).toBe(3);
    
    const selectedYes = selectedButtons.filter(btn => btn.textContent.toLowerCase() === 'yes');
    const selectedNo = selectedButtons.filter(btn => btn.textContent.toLowerCase() === 'no');
    
    expect(selectedYes.length).toBe(2); // smoke=yes, statin=yes (lipidMedication)
    expect(selectedNo.length).toBe(1);  // family=no (familyHistory)
  });

  it('should handle case insensitive URL values', () => {
    window.location.search = '?diabetes=YES&smoking=No&familyHistory=TRUE';
    const { container } = render(<App />);
    
    const selectedButtons = Array.from(container.querySelectorAll('button[data-state="on"]'));
    
    console.log('Case insensitive - selected buttons:');
    selectedButtons.forEach(btn => {
      console.log(`- "${btn.textContent}"`);
    });
    
    // Should have exactly 3 selected buttons
    expect(selectedButtons.length).toBe(3);
  });

  it('should show current form data state correctly', () => {
    // Test that the form data is being used correctly for selection state
    window.location.search = '?diabetes=1&smoking=0&familyHistory=true&lipidMedication=false&hypertensionMedication=y';
    const { container } = render(<App />);
    
    const selectedButtons = Array.from(container.querySelectorAll('button[data-state="on"]'));
    
    console.log('Various boolean formats - selected buttons:');
    selectedButtons.forEach(btn => {
      console.log(`- "${btn.textContent}"`);
    });
    
    // Should parse all these different boolean formats correctly
    // diabetes=1 (yes), smoking=0 (no), familyHistory=true (yes), 
    // lipidMedication=false (no), hypertensionMedication=y (yes)
    expect(selectedButtons.length).toBe(5);
    
    const selectedYes = selectedButtons.filter(btn => btn.textContent.toLowerCase() === 'yes');
    const selectedNo = selectedButtons.filter(btn => btn.textContent.toLowerCase() === 'no');
    
    expect(selectedYes.length).toBe(3); // diabetes, familyHistory, hypertensionMedication
    expect(selectedNo.length).toBe(2);  // smoking, lipidMedication
  });
});