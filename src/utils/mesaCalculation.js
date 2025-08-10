// MESA CHD Risk Calculation
// Based on McClelland et al. 2015 JACC paper coefficients

// MESA Coefficients - With CAC
const MESA_WITH_CAC = {
  baselineSurvival: 0.99833,
  coefficients: {
    age: 0.0172,
    gender: 0.4079,        // male=1, female=0
    chinese: -0.3475,
    black: 0.0353,
    hispanic: -0.0222,
    diabetes: 0.3892,
    smoking: 0.3717,
    totalCholesterol: 0.0043,
    hdlCholesterol: -0.0114,
    lipidMedication: 0.1206,
    systolicBP: 0.0066,
    hypertensionMedication: 0.2278,
    familyHistory: 0.3239,
    cac: 0.2743            // coefficient for ln(CAC + 1)
  }
};

// MESA Coefficients - Without CAC
const MESA_WITHOUT_CAC = {
  baselineSurvival: 0.99963,
  coefficients: {
    age: 0.0455,
    gender: 0.7496,        // male=1, female=0
    chinese: -0.5055,
    black: -0.2111,
    hispanic: -0.1900,
    diabetes: 0.5168,
    smoking: 0.4732,
    totalCholesterol: 0.0053,
    hdlCholesterol: -0.0140,
    lipidMedication: 0.2473,
    systolicBP: 0.0085,
    hypertensionMedication: 0.3381,
    familyHistory: 0.4522
  }
};

/**
 * Convert form data to calculation variables
 */
function prepareVariables(formData) {
  // Gender encoding
  const gender = formData.gender === 'male' ? 1 : 0;
  
  // Race encoding (reference: White/Caucasian = all 0)
  const chinese = formData.ethnicity === '2' ? 1 : 0;
  const black = formData.ethnicity === '3' ? 1 : 0;
  const hispanic = formData.ethnicity === '4' ? 1 : 0;
  
  // Boolean variables (yes/no -> 1/0)
  const diabetes = formData.diabetes === 'yes' ? 1 : 0;
  const smoking = formData.smoking === 'yes' ? 1 : 0;
  const familyHistory = formData.familyHistory === 'yes' ? 1 : 0;
  const lipidMedication = formData.lipidMedication === 'yes' ? 1 : 0;
  const hypertensionMedication = formData.hypertensionMedication === 'yes' ? 1 : 0;
  
  // Numeric variables
  const age = parseFloat(formData.age) || 65;
  const totalCholesterol = parseFloat(formData.totalCholesterol) || 200;
  const hdlCholesterol = parseFloat(formData.hdlCholesterol) || 50;
  const systolicBP = parseFloat(formData.systolicBP) || 120;
  const calcification = parseFloat(formData.calcification) || 0;
  
  return {
    age,
    gender,
    chinese,
    black,
    hispanic,
    diabetes,
    smoking,
    totalCholesterol,
    hdlCholesterol,
    systolicBP,
    lipidMedication,
    hypertensionMedication,
    familyHistory,
    calcification
  };
}

/**
 * Calculate linear estimate using MESA coefficients
 */
function calculateLinearEstimate(variables, coefficients, includeCac = false) {
  let estimate = 0;
  
  estimate += coefficients.age * variables.age;
  estimate += coefficients.gender * variables.gender;
  estimate += coefficients.chinese * variables.chinese;
  estimate += coefficients.black * variables.black;
  estimate += coefficients.hispanic * variables.hispanic;
  estimate += coefficients.diabetes * variables.diabetes;
  estimate += coefficients.smoking * variables.smoking;
  estimate += coefficients.totalCholesterol * variables.totalCholesterol;
  estimate += coefficients.hdlCholesterol * variables.hdlCholesterol;
  estimate += coefficients.lipidMedication * variables.lipidMedication;
  estimate += coefficients.systolicBP * variables.systolicBP;
  estimate += coefficients.hypertensionMedication * variables.hypertensionMedication;
  estimate += coefficients.familyHistory * variables.familyHistory;
  
  // Add CAC component if included
  if (includeCac && coefficients.cac) {
    const lnCacPlus1 = Math.log(variables.calcification + 1);
    estimate += coefficients.cac * lnCacPlus1;
  }
  
  return estimate;
}

/**
 * Calculate 10-year CHD risk percentage
 */
function calculateRisk(linearEstimate, baselineSurvival) {
  const expEstimate = Math.exp(linearEstimate);
  const survivalProbability = Math.pow(baselineSurvival, expEstimate);
  const risk = (1 - survivalProbability) * 100;
  return Math.max(0, Math.min(100, risk)); // Clamp between 0-100%
}

/**
 * Estimate coronary age based on risk
 */
function calculateCoronaryAge(risk, actualAge, gender) {
  // Simplified coronary age estimation
  // This is an approximation - exact formulas would require population risk tables
  
  // Average risk by age and gender (approximate values)
  const baseRiskMale = {
    45: 2.5, 50: 4.0, 55: 6.0, 60: 9.0, 65: 13.0, 70: 18.0, 75: 24.0, 80: 30.0, 85: 35.0
  };
  
  const baseRiskFemale = {
    45: 1.0, 50: 1.8, 55: 3.0, 60: 5.0, 65: 8.0, 70: 12.0, 75: 17.0, 80: 23.0, 85: 28.0
  };
  
  const baseRisk = gender === 1 ? baseRiskMale : baseRiskFemale;
  
  // Find the age that corresponds to this risk level
  const ages = Object.keys(baseRisk).map(Number).sort((a, b) => a - b);
  
  // Linear interpolation to find coronary age
  for (let i = 0; i < ages.length - 1; i++) {
    const age1 = ages[i];
    const age2 = ages[i + 1];
    const risk1 = baseRisk[age1];
    const risk2 = baseRisk[age2];
    
    if (risk >= risk1 && risk <= risk2) {
      // Linear interpolation
      const proportion = (risk - risk1) / (risk2 - risk1);
      return age1 + proportion * (age2 - age1);
    }
  }
  
  // If outside range, extrapolate
  if (risk < baseRisk[ages[0]]) {
    return Math.max(30, ages[0] - (baseRisk[ages[0]] - risk) * 2);
  } else {
    return Math.min(90, ages[ages.length - 1] + (risk - baseRisk[ages[ages.length - 1]]) * 2);
  }
}

/**
 * Main MESA risk calculation function
 */
export function calculateMesaRisk(formData) {
  const variables = prepareVariables(formData);
  
  // Calculate risk with CAC
  const linearEstimateWithCAC = calculateLinearEstimate(
    variables, 
    MESA_WITH_CAC.coefficients, 
    true
  );
  const riskWithCAC = calculateRisk(linearEstimateWithCAC, MESA_WITH_CAC.baselineSurvival);
  
  // Calculate risk without CAC
  const linearEstimateWithoutCAC = calculateLinearEstimate(
    variables, 
    MESA_WITHOUT_CAC.coefficients, 
    false
  );
  const riskWithoutCAC = calculateRisk(linearEstimateWithoutCAC, MESA_WITHOUT_CAC.baselineSurvival);
  
  // Calculate coronary age
  const coronaryAge = calculateCoronaryAge(riskWithCAC, variables.age, variables.gender);
  const ageDifference = coronaryAge - variables.age;
  
  return {
    riskWithCAC: Math.round(riskWithCAC * 10) / 10,
    riskWithoutCAC: Math.round(riskWithoutCAC * 10) / 10,
    coronaryAge: Math.round(coronaryAge),
    ageDifference: Math.round(ageDifference),
    variables // for debugging
  };
}

/**
 * Format results for display
 */
export function formatMesaResults(results) {
  return {
    riskWithCAC: `${results.riskWithCAC}%`,
    riskWithoutCAC: `${results.riskWithoutCAC}%`,
    coronaryAge: `${results.coronaryAge} years`,
    ageDifference: results.ageDifference >= 0 ? `+${results.ageDifference} years` : `${results.ageDifference} years`
  };
}