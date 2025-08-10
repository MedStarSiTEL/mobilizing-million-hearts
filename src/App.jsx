import { useFormData } from './hooks/useFormData';
import MesaRiskForm from './components/MesaRiskForm';

export default function App() {
  const {
    formData,
    showResults,
    riskResults,
    handleCalculate,
    handleStartOver,
    updateFormData
  } = useFormData();

  // Function to get current form values - this is the main purpose of App.jsx
  const getFormValues = () => {
    return { ...formData };
  };

  // Example usage: You can expose this function for external use
  // window.getFormValues = getFormValues; // Uncomment to make globally available
  
  // Or you can use it internally for calculations, logging, etc.
  // useEffect(() => {
  //   console.log('Current form values:', getFormValues());
  // }, [formData]);

  return (
    <MesaRiskForm
      formData={formData}
      updateFormData={updateFormData}
      showResults={showResults}
      riskResults={riskResults}
      onCalculate={handleCalculate}
      onStartOver={handleStartOver}
    />
  );
}
