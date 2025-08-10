// Test the MESA calculation with our test patient
// Run this with: node test-calculation.js

// Simulate the form data for our test patient
const testPatient = {
  gender: 'female',
  age: '45',
  calcification: '0',
  ethnicity: '1', // Caucasian
  diabetes: 'no',
  smoking: 'no',
  familyHistory: 'no',
  totalCholesterol: '160',
  hdlCholesterol: '65',
  systolicBP: '105',
  lipidMedication: 'no',
  hypertensionMedication: 'no'
};

// Import the calculation function (would need to adjust for Node.js)
// For testing purposes, let's manually calculate:

function calculateMesaRiskTest(formData) {
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

  console.log('Variables:', {
    age, gender, chinese, black, hispanic, diabetes, smoking,
    totalCholesterol, hdlCholesterol, systolicBP, 
    lipidMedication, hypertensionMedication, familyHistory, calcification
  });

  // With CAC coefficients
  const coeffsCAC = {
    age: 0.0172,
    gender: 0.4079,
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
    cac: 0.2743
  };

  // Calculate linear estimate with CAC
  let estimateCAC = 0;
  estimateCAC += coeffsCAC.age * age;                          // 0.0172 * 45 = 0.774
  estimateCAC += coeffsCAC.gender * gender;                    // 0.4079 * 0 = 0
  estimateCAC += coeffsCAC.chinese * chinese;                  // -0.3475 * 0 = 0
  estimateCAC += coeffsCAC.black * black;                      // 0.0353 * 0 = 0
  estimateCAC += coeffsCAC.hispanic * hispanic;                // -0.0222 * 0 = 0
  estimateCAC += coeffsCAC.diabetes * diabetes;                // 0.3892 * 0 = 0
  estimateCAC += coeffsCAC.smoking * smoking;                  // 0.3717 * 0 = 0
  estimateCAC += coeffsCAC.totalCholesterol * totalCholesterol;// 0.0043 * 160 = 0.688
  estimateCAC += coeffsCAC.hdlCholesterol * hdlCholesterol;    // -0.0114 * 65 = -0.741
  estimateCAC += coeffsCAC.lipidMedication * lipidMedication;  // 0.1206 * 0 = 0
  estimateCAC += coeffsCAC.systolicBP * systolicBP;           // 0.0066 * 105 = 0.693
  estimateCAC += coeffsCAC.hypertensionMedication * hypertensionMedication; // 0.2278 * 0 = 0
  estimateCAC += coeffsCAC.familyHistory * familyHistory;     // 0.3239 * 0 = 0
  estimateCAC += coeffsCAC.cac * Math.log(calcification + 1); // 0.2743 * ln(1) = 0

  console.log('Linear Estimate with CAC:', estimateCAC);

  // Calculate risk with CAC
  const baselineSurvivalCAC = 0.99833;
  const expEstimateCAC = Math.exp(estimateCAC);
  const survivalProbCAC = Math.pow(baselineSurvivalCAC, expEstimateCAC);
  const riskWithCAC = (1 - survivalProbCAC) * 100;

  console.log('Risk with CAC:', riskWithCAC);

  return {
    riskWithCAC: Math.round(riskWithCAC * 10) / 10,
    variables: { age, gender, calcification }
  };
}

const result = calculateMesaRiskTest(testPatient);
console.log('Final Result:', result);

// Expected: ~6.86% based on manual calculation