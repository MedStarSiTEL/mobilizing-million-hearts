import { useState, useEffect } from 'react';
import { getDefaultFormData, parseQueryParams } from '../utils/queryParams';
import { calculateMesaRisk } from '../utils/mesaCalculation';

export const useFormData = () => {
  const [formData, setFormData] = useState(getDefaultFormData());
  const [showResults, setShowResults] = useState(false);
  const [riskResults, setRiskResults] = useState(null);

  useEffect(() => {
    const parsedData = parseQueryParams();
    setFormData(parsedData);
  }, []);

  const handleCalculate = () => {
    const results = calculateMesaRisk(formData);
    setRiskResults(results);
    setShowResults(true);
  };

  const handleStartOver = () => {
    setFormData(getDefaultFormData());
    setShowResults(false);
    setRiskResults(null);
  };

  const updateFormData = (newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  };

  return {
    formData,
    showResults,
    riskResults,
    handleCalculate,
    handleStartOver,
    updateFormData,
    setFormData
  };
};