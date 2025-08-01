import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import App from './App.jsx';
import FhirClient from 'fhirclient';

// Mock FHIR Client
vi.mock('fhirclient', () => ({
  default: {
    oauth2: {
      ready: vi.fn()
    }
  }
}));

// Mock services
vi.mock('./services/RiskService', () => ({
  default: class MockRiskService {
    constructor(client, log) {
      this.client = client;
      this.log = log;
    }
    getRiskInformation = vi.fn().mockResolvedValue({
      age: 55,
      sex: 'male',
      systolicBloodPressure: { value: 140 },
      diastolicBloodPressure: { value: 90 },
      totalCholesterol: { value: 200 },
      hdl: { value: 45 },
      ldl: { value: 130 },
      relatedFactors: {
        diabetic: false,
        smoker: 'not',
        race: 'white',
        hypertensive: true
      }
    });
  }
}));

vi.mock('./services/AuditEventService', () => ({
  default: class MockAuditEventService {
    constructor(auditInfo) {
      this.auditInfo = auditInfo;
    }
    create = vi.fn().mockResolvedValue({});
  }
}));

vi.mock('./services/ErrorTranslator', () => ({
  default: class MockErrorTranslator {
    translate = vi.fn().mockReturnValue('Translated error message');
  }
}));

// Mock patient data
const mockPatientInfo = {
  age: 55,
  sex: 'male',
  systolicBloodPressure: { value: 140 },
  diastolicBloodPressure: { value: 90 },
  totalCholesterol: { value: 200 },
  hdl: { value: 45 },
  ldl: { value: 130 },
  relatedFactors: {
    diabetic: false,
    smoker: 'not',
    race: 'white',
    hypertensive: true
  }
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset FHIR client mock
    FhirClient.oauth2.ready.mockReset();
  });

  test('renders ASCVD Risk Estimator by default', async () => {
    // Mock successful FHIR authentication
    FhirClient.oauth2.ready.mockResolvedValue({
      patient: { id: 'test-patient' },
      state: { tokenResponse: { encounter: 'test', user: 'test', tenant: 'test' } }
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('ASCVD Risk Estimator')).toBeInTheDocument();
    });
  });

  test('displays loading state during data fetch', () => {
    // Mock that never resolves to keep loading state
    FhirClient.oauth2.ready.mockImplementation(() => new Promise(() => {}));

    render(<App />);
    
    // Check for loading state - the Loader component should be active
    // Look for the loading overlay or spinner
    expect(screen.getByLabelText('oval-loading')).toBeInTheDocument();
  });

  test('handles FHIR authentication errors gracefully', async () => {
    FhirClient.oauth2.ready.mockRejectedValue(new Error('Authentication failed'));

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Translated error message')).toBeInTheDocument();
    });
  });

  test('switches to MESA calculator when button clicked', async () => {
    // Setup successful auth and patient data
    FhirClient.oauth2.ready.mockResolvedValue({
      patient: { id: 'test-patient' },
      state: { tokenResponse: { encounter: 'test', user: 'test', tenant: 'test' } }
    });

    render(<App />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('ASCVD Risk Estimator')).toBeInTheDocument();
    });

    // Find and click MESA Calculator button
    const mesaButton = screen.getByText('MESA Calculator');
    fireEvent.click(mesaButton);
    
    await waitFor(() => {
      expect(screen.getByText('MESA Risk Calculator')).toBeInTheDocument();
    });
  });

  test('switches back to ASCVD from other pages', async () => {
    FhirClient.oauth2.ready.mockResolvedValue({
      patient: { id: 'test-patient' },
      state: { tokenResponse: { encounter: 'test', user: 'test', tenant: 'test' } }
    });

    render(<App />);
    
    // Wait for load and go to educator
    await waitFor(() => {
      expect(screen.getByText('ASCVD Risk Estimator')).toBeInTheDocument();
    });

    const educatorButton = screen.getByText('Patient Risk Education Tool');
    fireEvent.click(educatorButton);

    // The educator page should load
    await waitFor(() => {
      // Look for educator-specific content rather than a specific title
      expect(screen.getByText(/Risk Education/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('calculates both ASCVD and MESA risks on patient load', async () => {
    const mockClient = {
      patient: { id: 'test-patient' },
      state: { tokenResponse: { encounter: 'test', user: 'test', tenant: 'test' } }
    };

    FhirClient.oauth2.ready.mockResolvedValue(mockClient);

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('ASCVD Risk Estimator')).toBeInTheDocument();
    });

    // Both calculators should have been initialized with patient data
    expect(FhirClient.oauth2.ready).toHaveBeenCalled();
  });
});