import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Estimator from './Estimator.jsx';

// Mock services that might be used by Estimator
vi.mock('../../services/RiskService', () => ({
  default: class {
    calculateASCVDRisk = vi.fn().mockResolvedValue({ tenYearRisk: 7.5 });
  }
}));

const mockProps = {
  // Patient data
  patientInfo: {
    age: 50,
    sex: 'male',
    systolicBloodPressure: { value: 130 },
    diastolicBloodPressure: { value: 80 },
    totalCholesterol: { value: 200 },
    hdl: { value: 50 },
    ldl: { value: 120 },
    relatedFactors: {
      diabetic: false,
      smoker: 'not',
      race: 'white',
      hypertensive: false
    },
    cholesterolRelativeDate: '1 year ago',
    bloodPressureRelativeDate: '6 months ago',
    cholesterolDate: '2023-01-01',
    bloodPressureDate: '2023-06-01'
  },
  
  // Risk calculation results
  ascvdRisk: { tenYearRisk: 7.5, tenYearScore: 7.5 },
  ascvdRiskText: 'Borderline Risk',
  ascvdBackgroundColor: '#fcbb41',
  ascvdMissingData: false,
  ascvdMissingFields: [],
  
  // Loading state
  loading: false,
  
  // Navigation functions
  goToEducator: vi.fn(),
  goToMESACalculator: vi.fn(),
  
  // Feedback function
  submitUserFeedback: vi.fn(),
  
  // Logger
  log: vi.fn()
};

describe('Estimator Component', () => {
  test('renders patient demographic information', () => {
    render(<Estimator {...mockProps} />);
    
    // Check for age display
    expect(screen.getByText('Age:')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    
    // Check for sex display
    expect(screen.getByText('Male')).toBeInTheDocument();
    
    // Check for race display
    expect(screen.getByText('Race/Ethnicity:')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
  });

  test('displays blood pressure and cholesterol values', () => {
    render(<Estimator {...mockProps} />);
    
    // Blood pressure
    expect(screen.getByText('Systolic Blood Pressure (mmHg):')).toBeInTheDocument();
    expect(screen.getByText('130')).toBeInTheDocument();
    expect(screen.getByText('Diastolic Blood Pressure (mmHg):')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    
    // Cholesterol values
    expect(screen.getByText('Total Cholesterol (mg/dL):')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('HDL Cholesterol (mg/dL):')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('LDL Cholesterol (mg/dL):')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  test('shows risk factors correctly', () => {
    render(<Estimator {...mockProps} />);
    
    // Diabetes status
    expect(screen.getByText('History of Diabetes:')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    
    // Smoking status
    expect(screen.getByText('Smoker:')).toBeInTheDocument();
    expect(screen.getByText('Never Smoker')).toBeInTheDocument();
    
    // Hypertension treatment
    expect(screen.getByText('Hypertension Treatment:')).toBeInTheDocument();
  });

  test('displays ASCVD risk calculation results', () => {
    render(<Estimator {...mockProps} />);
    
    // Risk percentage
    expect(screen.getByText(/7\.5%/)).toBeInTheDocument();
    
    // Risk category
    expect(screen.getByText('Borderline Risk')).toBeInTheDocument();
    
    // ASCVD title
    expect(screen.getByText('Risk of Having a Heart Attack or Stroke within 10 Years')).toBeInTheDocument();
  });

  test('shows missing data message when data is incomplete', () => {
    const propsWithMissingData = {
      ...mockProps,
      ascvdMissingData: true,
      ascvdMissingFields: ['Missing Total Cholesterol', 'Missing Age']
    };

    render(<Estimator {...propsWithMissingData} />);
    
    expect(screen.getByText(/Missing Total Cholesterol/)).toBeInTheDocument();
    expect(screen.getByText(/Missing Age/)).toBeInTheDocument();
  });

  test('navigates to MESA calculator when button is clicked', () => {
    render(<Estimator {...mockProps} />);
    
    const mesaButton = screen.getByText('MESA Calculator');
    fireEvent.click(mesaButton);
    
    expect(mockProps.goToMESACalculator).toHaveBeenCalled();
  });

  test('navigates to patient education when button is clicked', () => {
    render(<Estimator {...mockProps} />);
    
    const educatorButton = screen.getByText('Patient Risk Education Tool');
    fireEvent.click(educatorButton);
    
    expect(mockProps.goToEducator).toHaveBeenCalled();
  });

  test('opens feedback modal when feedback button is clicked', () => {
    render(<Estimator {...mockProps} />);
    
    const feedbackButton = screen.getByText('Provide Feedback');
    fireEvent.click(feedbackButton);
    
    // Check if modal appears
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('handles loading state correctly', () => {
    const loadingProps = { ...mockProps, loading: true };
    render(<Estimator {...loadingProps} />);
    
    // During loading, certain elements should not be visible
    expect(screen.queryByText('Patient Risk Education Tool')).not.toBeInTheDocument();
    expect(screen.queryByText('MESA Calculator')).not.toBeInTheDocument();
  });

  test('displays data collection dates', () => {
    render(<Estimator {...mockProps} />);
    
    expect(screen.getByText('1 year ago')).toBeInTheDocument();
    expect(screen.getByText('6 months ago')).toBeInTheDocument();
  });

  test('displays different risk levels with appropriate styling', () => {
    // Test high risk scenario
    const highRiskProps = {
      ...mockProps,
      ascvdRisk: { tenYearRisk: 15.2 },
      ascvdRiskText: 'High Risk',
      ascvdBackgroundColor: '#d9534f'
    };

    const { rerender } = render(<Estimator {...highRiskProps} />);
    
    expect(screen.getByText(/15\.2%/)).toBeInTheDocument();
    expect(screen.getByText('High Risk')).toBeInTheDocument();

    // Test low risk scenario
    const lowRiskProps = {
      ...mockProps,
      ascvdRisk: { tenYearRisk: 3.1 },
      ascvdRiskText: 'Low Risk',
      ascvdBackgroundColor: '#5cb85c'
    };

    rerender(<Estimator {...lowRiskProps} />);
    
    expect(screen.getByText(/3\.1%/)).toBeInTheDocument();
    expect(screen.getByText('Low Risk')).toBeInTheDocument();
  });

  test('handles different race ethnicities', () => {
    const africanAmericanProps = {
      ...mockProps,
      patientInfo: {
        ...mockProps.patientInfo,
        relatedFactors: {
          ...mockProps.patientInfo.relatedFactors,
          race: 'africanamerican'
        }
      }
    };

    render(<Estimator {...africanAmericanProps} />);
    expect(screen.getByText('African American')).toBeInTheDocument();
  });

  test('shows diabetic status when patient has diabetes', () => {
    const diabeticProps = {
      ...mockProps,
      patientInfo: {
        ...mockProps.patientInfo,
        relatedFactors: {
          ...mockProps.patientInfo.relatedFactors,
          diabetic: true
        }
      }
    };

    render(<Estimator {...diabeticProps} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  test('displays current smoker status', () => {
    const smokerProps = {
      ...mockProps,
      patientInfo: {
        ...mockProps.patientInfo,
        relatedFactors: {
          ...mockProps.patientInfo.relatedFactors,
          smoker: 'yes'
        }
      }
    };

    render(<Estimator {...smokerProps} />);
    expect(screen.getByText('Current Smoker')).toBeInTheDocument();
  });
});