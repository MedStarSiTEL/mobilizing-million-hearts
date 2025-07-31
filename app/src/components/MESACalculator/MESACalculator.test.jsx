import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import MESACalculator from './MESACalculator.jsx';

const mockProps = {
  patientInfo: {
    age: 55,
    sex: 'male',
    systolicBloodPressure: { value: 140 },
    totalCholesterol: { value: 200 },
    hdl: { value: 45 },
    relatedFactors: {
      diabetic: false,
      smoker: 'not',
      race: 'white',
      hypertensive: true
    },
    cholesterolRelativeDate: '2 years ago',
    bloodPressureRelativeDate: '1 year ago',
    cholesterolDate: '2022-01-01',
    bloodPressureDate: '2023-01-01'
  },
  mesaRisk: { tenYearCHDRisk: 8.5, coronaryAge: 65 },
  mesaRiskText: 'Intermediate CHD Risk',
  mesaBackgroundColor: '#fcbb41',
  mesaMissingData: false,
  mesaMissingFields: [],
  loading: false,
  goToEducator: vi.fn(),
  goToEstimator: vi.fn(),
  submitUserFeedback: vi.fn()
};

describe('MESACalculator Component', () => {
  test('displays patient data for ages 45-85', () => {
    render(<MESACalculator {...mockProps} />);
    
    expect(screen.getByText('Age:')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('Race/Ethnicity:')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  test('displays cholesterol and blood pressure values', () => {
    render(<MESACalculator {...mockProps} />);
    
    expect(screen.getByText('Total Cholesterol (mg/dL):')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('HDL Cholesterol (mg/dL):')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Systolic Blood Pressure (mmHg):')).toBeInTheDocument();
    expect(screen.getByText('140')).toBeInTheDocument();
  });

  test('shows missing data message for incomplete info', () => {
    const propsWithMissingData = {
      ...mockProps,
      mesaMissingData: true,
      mesaMissingFields: ['Missing Age', 'Missing Race']
    };

    render(<MESACalculator {...propsWithMissingData} />);
    
    expect(screen.getByText(/Missing Age/)).toBeInTheDocument();
    expect(screen.getByText(/Missing Race/)).toBeInTheDocument();
  });

  test('renders coronary age when risk calculated', () => {
    render(<MESACalculator {...mockProps} />);
    
    expect(screen.getByText('Coronary Age: 65 years')).toBeInTheDocument();
  });

  test('displays CHD risk information', () => {
    render(<MESACalculator {...mockProps} />);
    
    expect(screen.getByText('Risk of Having Coronary Heart Disease within 10 Years')).toBeInTheDocument();
    expect(screen.getByText(/8.5%/)).toBeInTheDocument();
    expect(screen.getByText(/Intermediate CHD Risk/)).toBeInTheDocument();
  });

  test('navigates back to ASCVD calculator', () => {
    render(<MESACalculator {...mockProps} />);
    
    const ascvdButton = screen.getByText('ASCVD Calculator');
    fireEvent.click(ascvdButton);
    
    expect(mockProps.goToEstimator).toHaveBeenCalled();
  });

  test('navigates to patient education tool', () => {
    render(<MESACalculator {...mockProps} />);
    
    const educatorButton = screen.getByText('Patient Risk Education Tool');
    fireEvent.click(educatorButton);
    
    expect(mockProps.goToEducator).toHaveBeenCalled();
  });

  test('handles feedback modal correctly', () => {
    render(<MESACalculator {...mockProps} />);
    
    const feedbackButton = screen.getByText('Provide Feedback');
    fireEvent.click(feedbackButton);
    
    // Modal should be shown
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('displays correct age range information', () => {
    render(<MESACalculator {...mockProps} />);
    
    expect(screen.getByText(/MESA calculations for ages 45-85/)).toBeInTheDocument();
  });

  test('shows diabetes and smoking status', () => {
    render(<MESACalculator {...mockProps} />);
    
    expect(screen.getByText('History of Diabetes:')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Smoker:')).toBeInTheDocument();
  });

  test('displays hypertension treatment status', () => {
    render(<MESACalculator {...mockProps} />);
    
    expect(screen.getByText('Hypertension Treatment:')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  test('handles loading state', () => {
    const loadingProps = { ...mockProps, loading: true };
    render(<MESACalculator {...loadingProps} />);
    
    // Education button should not be visible during loading
    expect(screen.queryByText('Patient Risk Education Tool')).not.toBeInTheDocument();
  });

  test('displays different race ethnicities correctly', () => {
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

    render(<MESACalculator {...africanAmericanProps} />);
    expect(screen.getByText('African American')).toBeInTheDocument();
  });
});