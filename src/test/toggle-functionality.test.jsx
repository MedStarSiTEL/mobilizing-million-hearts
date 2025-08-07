import { render, fireEvent } from '@testing-library/react';
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

describe('Toggle Component Functionality', () => {
  describe('Toggle Components Rendering', () => {
    it('should render toggle components instead of radio buttons for yes/no fields', () => {
      const { container } = render(<App />);
      
      // Check that toggle groups exist
      const toggleGroups = container.querySelectorAll('[class*="bg-muted p-1"]');
      expect(toggleGroups.length).toBeGreaterThan(0);
      
      // Check that toggle buttons exist (they should have "Yes" and "No" text)
      const yesButtons = Array.from(container.querySelectorAll('button')).filter(btn => 
        btn.textContent.toLowerCase() === 'yes'
      );
      const noButtons = Array.from(container.querySelectorAll('button')).filter(btn => 
        btn.textContent.toLowerCase() === 'no'
      );
      
      // Should have 5 yes buttons and 5 no buttons (diabetes, smoking, family history, lipid, hypertension)
      expect(yesButtons.length).toBe(5);
      expect(noButtons.length).toBe(5);
    });

    it('should render with correct initial state from query parameters', () => {
      window.location.search = '?diabetes=yes&smoking=no&familyHistory=yes';
      const { container } = render(<App />);
      
      // Find all buttons with "Yes" text
      const yesButtons = Array.from(container.querySelectorAll('button')).filter(btn => 
        btn.textContent.toLowerCase() === 'yes'
      );
      
      // Find all buttons with "No" text  
      const noButtons = Array.from(container.querySelectorAll('button')).filter(btn => 
        btn.textContent.toLowerCase() === 'no'
      );

      // Check that some buttons have the selected state (data-state="on")
      const selectedYesButtons = yesButtons.filter(btn => btn.getAttribute('data-state') === 'on');
      const selectedNoButtons = noButtons.filter(btn => btn.getAttribute('data-state') === 'on');
      
      // Should have at least some selected buttons based on query params
      expect(selectedYesButtons.length).toBeGreaterThan(0);
      expect(selectedNoButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Toggle Interaction', () => {
    it('should handle toggle clicks without errors', () => {
      const { container } = render(<App />);
      
      // Find a "Yes" button and click it
      const yesButtons = Array.from(container.querySelectorAll('button')).filter(btn => 
        btn.textContent.toLowerCase() === 'yes'
      );
      
      if (yesButtons.length > 0) {
        expect(() => {
          fireEvent.click(yesButtons[0]);
        }).not.toThrow();
      }
      
      // Find a "No" button and click it
      const noButtons = Array.from(container.querySelectorAll('button')).filter(btn => 
        btn.textContent.toLowerCase() === 'no'
      );
      
      if (noButtons.length > 0) {
        expect(() => {
          fireEvent.click(noButtons[0]);
        }).not.toThrow();
      }
    });

    it('should maintain gender radio buttons (not converted to toggles)', () => {
      const { container } = render(<App />);
      
      // Check that gender section exists and has radio button elements
      // Look for radio button indicators or radio group structure
      const radioButtons = container.querySelectorAll('[role="radio"], input[type="radio"]');
      const genderLabels = Array.from(container.querySelectorAll('label')).filter(label => 
        label.textContent.toLowerCase() === 'male' || label.textContent.toLowerCase() === 'female'
      );
      
      // Should have gender labels (Male/Female)
      expect(genderLabels.length).toBe(2);
      
      // Check that gender section doesn't use toggle styling
      const toggleButtons = Array.from(container.querySelectorAll('button')).filter(btn => 
        btn.textContent.toLowerCase() === 'male' || btn.textContent.toLowerCase() === 'female'
      );
      
      // Gender should NOT be using toggle buttons
      expect(toggleButtons.length).toBe(0);
    });
  });

  describe('Toggle State Management', () => {
    it('should handle boolean parameter parsing with toggles', () => {
      window.location.search = '?diabetes=1&smoking=0&familyHistory=true&lipidMedication=false&hypertensionMedication=yes';
      
      expect(() => render(<App />)).not.toThrow();
    });

    it('should handle alternative parameter names with toggles', () => {
      window.location.search = '?smoke=yes&family=no&statin=yes&htn=no';
      
      expect(() => render(<App />)).not.toThrow();
    });

    it('should handle case insensitive parameters with toggles', () => {
      window.location.search = '?diabetes=YES&smoking=No&familyHistory=TRUE';
      
      expect(() => render(<App />)).not.toThrow();
    });
  });

  describe('Form Submission with Toggles', () => {
    it('should allow calculate button to be clicked with toggle selections', () => {
      window.location.search = '?gender=male&age=65&diabetes=yes&smoking=no';
      const { container } = render(<App />);
      
      // Find and click the calculate button
      const calculateButton = Array.from(container.querySelectorAll('button')).find(btn => 
        btn.textContent.toLowerCase().includes('calculate')
      );
      
      expect(calculateButton).not.toBeNull();
      expect(() => {
        fireEvent.click(calculateButton);
      }).not.toThrow();
    });
  });
});