import { useState, useEffect } from 'react';
import { getDefaultFormData, parseQueryParams } from '../utils/queryParams';

export const useFormData = () => {
  const [formData, setFormData] = useState(getDefaultFormData());
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const parsedData = parseQueryParams();
    setFormData(parsedData);
  }, []);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleStartOver = () => {
    setFormData(getDefaultFormData());
    setShowResults(false);
  };

  const updateFormData = (newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  };

  return {
    formData,
    showResults,
    handleCalculate,
    handleStartOver,
    updateFormData,
    setFormData
  };
};