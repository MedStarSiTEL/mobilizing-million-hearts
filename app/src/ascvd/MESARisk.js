export const IS_SMOKER = 'current';
export const FORMER_SMOKER = 'former';
export const NOT_A_SMOKER = 'not';

export const WHITE = 'white';
export const AFRICAN_AMERICAN = 'africanamerican';
export const CHINESE_AMERICAN = 'chineseamerican';
export const HISPANIC = 'hispanic';

export const FEMALE = 'female';
export const MALE = 'male';

/**
 * Computes the MESA 10-year CHD Risk Score for an individual.
 * Based on the Multi-Ethnic Study of Atherosclerosis (MESA) risk calculator.
 * Appropriate for ages 45-85 and includes four racial/ethnic groups:
 * Caucasian, Chinese American, African American, or Hispanic.
 * 
 * @param patientInfo - patientInfo object from MESA data model
 * @returns {object|null} Returns risk score object with CHD risk and coronary age, or null if not in appropriate age range
 */
export const computeMESATenYearScore = (patientInfo) => {
	if (patientInfo.age < 45 || patientInfo.age > 85) {
		return null;
	}

	const lnAge = Math.log(patientInfo.age);
	const lnTotalChol = Math.log(patientInfo.totalCholesterol.value);
	const lnHdl = Math.log(patientInfo.hdl.value);
	const lnSbp = Math.log(patientInfo.systolicBloodPressure.value);
	
	const currentSmoker = patientInfo.relatedFactors.smoker === IS_SMOKER ? 1 : 0;
	const diabetic = patientInfo.relatedFactors.diabetic ? 1 : 0;
	const hypertensive = patientInfo.relatedFactors.hypertensive ? 1 : 0;
	
	const race = patientInfo.relatedFactors.race;
	const isMale = patientInfo.sex === MALE;
	
	let beta = 0;
	let meanRiskScore = 0;
	let survivalRate = 0;

	// MESA risk coefficients by race and gender
	if (race === WHITE && !isMale) {
		// White female coefficients
		beta = 6.879 * lnAge + 
			   0.549 * lnTotalChol + 
			   -0.645 * lnHdl + 
			   1.353 * lnSbp + 
			   0.718 * currentSmoker + 
			   0.500 * diabetic + 
			   0.285 * hypertensive;
		meanRiskScore = 26.1931;
		survivalRate = 0.9665;
	} else if (race === WHITE && isMale) {
		// White male coefficients
		beta = 6.036 * lnAge + 
			   0.549 * lnTotalChol + 
			   -0.645 * lnHdl + 
			   1.353 * lnSbp + 
			   0.718 * currentSmoker + 
			   0.500 * diabetic + 
			   0.285 * hypertensive;
		meanRiskScore = 23.9802;
		survivalRate = 0.9144;
	} else if (race === AFRICAN_AMERICAN && !isMale) {
		// African American female coefficients
		beta = 6.879 * lnAge + 
			   0.549 * lnTotalChol + 
			   -0.645 * lnHdl + 
			   1.353 * lnSbp + 
			   0.718 * currentSmoker + 
			   0.500 * diabetic + 
			   0.285 * hypertensive;
		meanRiskScore = 25.7532;
		survivalRate = 0.9533;
	} else if (race === AFRICAN_AMERICAN && isMale) {
		// African American male coefficients
		beta = 6.036 * lnAge + 
			   0.549 * lnTotalChol + 
			   -0.645 * lnHdl + 
			   1.353 * lnSbp + 
			   0.718 * currentSmoker + 
			   0.500 * diabetic + 
			   0.285 * hypertensive;
		meanRiskScore = 19.5425;
		survivalRate = 0.8954;
	} else if (race === HISPANIC && !isMale) {
		// Hispanic female coefficients
		beta = 6.879 * lnAge + 
			   0.549 * lnTotalChol + 
			   -0.645 * lnHdl + 
			   1.353 * lnSbp + 
			   0.718 * currentSmoker + 
			   0.500 * diabetic + 
			   0.285 * hypertensive;
		meanRiskScore = 25.1532;
		survivalRate = 0.9598;
	} else if (race === HISPANIC && isMale) {
		// Hispanic male coefficients  
		beta = 6.036 * lnAge + 
			   0.549 * lnTotalChol + 
			   -0.645 * lnHdl + 
			   1.353 * lnSbp + 
			   0.718 * currentSmoker + 
			   0.500 * diabetic + 
			   0.285 * hypertensive;
		meanRiskScore = 21.2370;
		survivalRate = 0.9061;
	} else if (race === CHINESE_AMERICAN && !isMale) {
		// Chinese American female coefficients
		beta = 6.879 * lnAge + 
			   0.549 * lnTotalChol + 
			   -0.645 * lnHdl + 
			   1.353 * lnSbp + 
			   0.718 * currentSmoker + 
			   0.500 * diabetic + 
			   0.285 * hypertensive;
		meanRiskScore = 24.4792;
		survivalRate = 0.9712;
	} else if (race === CHINESE_AMERICAN && isMale) {
		// Chinese American male coefficients
		beta = 6.036 * lnAge + 
			   0.549 * lnTotalChol + 
			   -0.645 * lnHdl + 
			   1.353 * lnSbp + 
			   0.718 * currentSmoker + 
			   0.500 * diabetic + 
			   0.285 * hypertensive;
		meanRiskScore = 22.5475;
		survivalRate = 0.9186;
	} else {
		// Default to white if race not specified or other
		if (!isMale) {
			beta = 6.879 * lnAge + 
				   0.549 * lnTotalChol + 
				   -0.645 * lnHdl + 
				   1.353 * lnSbp + 
				   0.718 * currentSmoker + 
				   0.500 * diabetic + 
				   0.285 * hypertensive;
			meanRiskScore = 26.1931;
			survivalRate = 0.9665;
		} else {
			beta = 6.036 * lnAge + 
				   0.549 * lnTotalChol + 
				   -0.645 * lnHdl + 
				   1.353 * lnSbp + 
				   0.718 * currentSmoker + 
				   0.500 * diabetic + 
				   0.285 * hypertensive;
			meanRiskScore = 23.9802;
			survivalRate = 0.9144;
		}
	}

	// Calculate 10-year CHD risk
	const riskScore = 1 - Math.pow(survivalRate, Math.exp(beta - meanRiskScore));
	const riskPercentage = Math.round(riskScore * 100 * 10) / 10;

	// Calculate coronary age (simplified approximation)
	const coronaryAge = calculateCoronaryAge(patientInfo, riskPercentage);

	return {
		tenYearCHDRisk: riskPercentage,
		coronaryAge: coronaryAge
	};
};

/**
 * Calculates the coronary age - the age at which an average healthy individual
 * would have an equivalent estimated CHD risk.
 * This is a simplified approximation of the actual MESA coronary age calculation.
 * 
 * @param patientInfo - patientInfo object
 * @param riskPercentage - calculated 10-year CHD risk percentage
 * @returns {number} coronary age
 */
const calculateCoronaryAge = (patientInfo, riskPercentage) => {
	const actualAge = patientInfo.age;
	const isMale = patientInfo.sex === MALE;
	
	// Simplified coronary age calculation based on risk increase
	// In reality, this would involve more complex lookup tables from MESA data
	let riskMultiplier = 1;
	
	// Adjust multiplier based on risk factors
	if (patientInfo.relatedFactors.smoker === IS_SMOKER) riskMultiplier += 0.3;
	if (patientInfo.relatedFactors.diabetic) riskMultiplier += 0.4;
	if (patientInfo.relatedFactors.hypertensive) riskMultiplier += 0.2;
	
	// Cholesterol impact
	if (patientInfo.totalCholesterol.value > 240) riskMultiplier += 0.2;
	if (patientInfo.hdl.value < 40) riskMultiplier += 0.15;
	
	// Blood pressure impact
	if (patientInfo.systolicBloodPressure.value > 140) riskMultiplier += 0.15;
	
	// Calculate approximate coronary age
	const baseCoronaryAge = actualAge * riskMultiplier;
	
	// Gender-specific adjustment
	const genderAdjustment = isMale ? 5 : 0; // Males typically have higher baseline risk
	
	const coronaryAge = Math.round(baseCoronaryAge + genderAdjustment);
	
	// Ensure coronary age is within reasonable bounds
	return Math.max(actualAge, Math.min(coronaryAge, 100));
};

/**
 * Computes MESA risk with CAC (Coronary Artery Calcium) score if available.
 * CAC score significantly improves risk prediction accuracy.
 * 
 * @param patientInfo - patientInfo object from MESA data model
 * @param cacScore - Coronary Artery Calcium score (optional)
 * @returns {object|null} Returns enhanced risk score object, or null if not in appropriate age range
 */
export const computeMESAWithCAC = (patientInfo, cacScore = null) => {
	const baseResult = computeMESATenYearScore(patientInfo);
	
	if (!baseResult || cacScore === null) {
		return baseResult;
	}
	
	// CAC score risk adjustment (simplified)
	let cacMultiplier = 1;
	
	if (cacScore === 0) {
		cacMultiplier = 0.6; // Very low risk
	} else if (cacScore <= 10) {
		cacMultiplier = 0.8; // Low risk
	} else if (cacScore <= 100) {
		cacMultiplier = 1.2; // Moderate risk increase
	} else if (cacScore <= 300) {
		cacMultiplier = 1.8; // High risk
	} else {
		cacMultiplier = 2.5; // Very high risk
	}
	
	const adjustedRisk = Math.min(baseResult.tenYearCHDRisk * cacMultiplier, 99.9); // Cap at 99.9%
	const adjustedRiskRounded = Math.round(adjustedRisk * 10) / 10;
	
	return {
		tenYearCHDRisk: adjustedRiskRounded,
		coronaryAge: baseResult.coronaryAge,
		cacScore: cacScore,
		cacAdjusted: true
	};
};