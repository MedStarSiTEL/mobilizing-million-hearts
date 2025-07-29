const nullOrUnd = (x) => {
	return x === undefined || x === null || x === '';
};

const validateReading = (currentVal, min, max) => {
	if (!isNaN(currentVal) && currentVal !== undefined && currentVal >= min && currentVal <= max) {
		return true;
	}
	return false;
};

const isValidSBP = (bp) => validateReading(bp, 90, 200);

const isValidHDL = (hdl) => validateReading(hdl, 20, 100);

const isValidTotalCholesterol = (totalCholesterol) => validateReading(totalCholesterol, 130, 320);

const isValidMESAAge = (age) => validateReading(age, 45, 85);

const isValidCACScore = (cacScore) => {
	if (cacScore === null || cacScore === undefined) {
		return true; // CAC score is optional
	}
	return validateReading(cacScore, 0, 5000);
};

const isValidMESARace = (race) => {
	const validRaces = ['white', 'africanamerican', 'hispanic', 'chineseamerican'];
	return validRaces.includes(race);
};

const missingMESAFields = (patientInfo, includeCACScore = false) => {
	const needInput = [];
	
	if (
		nullOrUnd(patientInfo.systolicBloodPressure) ||
		nullOrUnd(patientInfo.systolicBloodPressure.value)
	) {
		needInput.push('Missing Systolic Blood Pressure');
	} else if (!isValidSBP(patientInfo.systolicBloodPressure.value)) {
		needInput.push('Invalid Systolic Blood Pressure Range (90-200 mmHg)');
	}

	if (nullOrUnd(patientInfo.totalCholesterol) || nullOrUnd(patientInfo.totalCholesterol.value)) {
		needInput.push('Missing Total Cholesterol');
	} else if (!isValidTotalCholesterol(patientInfo.totalCholesterol.value)) {
		needInput.push('Invalid Total Cholesterol Range (130-320 mg/dL)');
	}

	if (nullOrUnd(patientInfo.relatedFactors) || nullOrUnd(patientInfo.relatedFactors.diabetic)) {
		needInput.push('Missing History of Diabetes');
	}

	if (nullOrUnd(patientInfo.age)) {
		needInput.push('Missing Age');
	} else if (!isValidMESAAge(patientInfo.age)) {
		needInput.push('Invalid Age Range (MESA calculator valid for ages 45-85)');
	}

	if (nullOrUnd(patientInfo.hdl) || nullOrUnd(patientInfo.hdl.value)) {
		needInput.push('Missing HDL Cholesterol');
	} else if (!isValidHDL(patientInfo.hdl.value)) {
		needInput.push('Invalid HDL Cholesterol Range (20-100 mg/dL)');
	}

	if (nullOrUnd(patientInfo.relatedFactors) || nullOrUnd(patientInfo.relatedFactors.smoker)) {
		needInput.push('Missing Smoking Status');
	}

	if (nullOrUnd(patientInfo.relatedFactors) || nullOrUnd(patientInfo.relatedFactors.race)) {
		needInput.push('Missing Race/Ethnicity');
	} else if (!isValidMESARace(patientInfo.relatedFactors.race)) {
		needInput.push('Invalid Race (MESA supports: White, African American, Hispanic, Chinese American)');
	}

	if (nullOrUnd(patientInfo.relatedFactors) || nullOrUnd(patientInfo.relatedFactors.hypertensive)) {
		needInput.push('Missing Hypertension Treatment Status');
	}

	if (nullOrUnd(patientInfo.sex)) {
		needInput.push('Missing Sex');
	}

	// Validate CAC score if included
	if (includeCACScore && !isValidCACScore(patientInfo.cacScore)) {
		needInput.push('Invalid CAC Score Range (0-5000)');
	}

	return needInput;
};

const calculateMESAMissingFields = (pi, includeCACScore = false) => {
	const missing = missingMESAFields(pi, includeCACScore);
	return {
		riskText: 'Invalid Data',
		backgroundColor: '#f64747',
		missingData: true,
		missingFields: missing,
	};
};

const canCalculateMESAScore = (patientInfo, includeCACScore = false) => {
	const basicValidation = 
		patientInfo.systolicBloodPressure &&
		patientInfo.systolicBloodPressure.value !== null &&
		patientInfo.systolicBloodPressure.value !== undefined &&
		isValidMESAAge(patientInfo.age) &&
		patientInfo.totalCholesterol &&
		patientInfo.totalCholesterol.value !== null &&
		patientInfo.totalCholesterol.value !== undefined &&
		isValidTotalCholesterol(patientInfo.totalCholesterol.value) &&
		patientInfo.hdl &&
		patientInfo.hdl.value !== null &&
		patientInfo.hdl.value !== undefined &&
		isValidHDL(patientInfo.hdl.value) &&
		patientInfo.relatedFactors &&
		patientInfo.relatedFactors.hypertensive !== null &&
		isValidMESARace(patientInfo.relatedFactors.race) &&
		patientInfo.relatedFactors.diabetic !== null &&
		patientInfo.relatedFactors.smoker !== null &&
		patientInfo.sex !== null;

	if (includeCACScore) {
		return basicValidation && isValidCACScore(patientInfo.cacScore);
	}

	return basicValidation;
};

const calculateMESARiskCard = (riskResult, pi) => {
	if (!riskResult || isNaN(riskResult.tenYearCHDRisk) || riskResult.tenYearCHDRisk === null) {
		return calculateMESAMissingFields(pi);
	}

	const risk = riskResult.tenYearCHDRisk;
	
	// MESA-specific risk categories for CHD
	if (risk < 3) {
		return { 
			riskText: 'Low CHD Risk', 
			backgroundColor: '#2ecc71', 
			missingData: false,
			coronaryAge: riskResult.coronaryAge
		};
	}
	if (risk < 7.5) {
		return { 
			riskText: 'Borderline CHD Risk', 
			backgroundColor: '#ffff7e', 
			missingData: false,
			coronaryAge: riskResult.coronaryAge
		};
	}
	if (risk < 15) {
		return { 
			riskText: 'Intermediate CHD Risk', 
			backgroundColor: '#fcbb41', 
			missingData: false,
			coronaryAge: riskResult.coronaryAge
		};
	}
	return { 
		riskText: 'High CHD Risk', 
		backgroundColor: '#f64747', 
		missingData: false,
		coronaryAge: riskResult.coronaryAge
	};
};

const validateMESAInputs = (patientInfo, includeCACScore = false) => {
	const validationErrors = [];
	
	// Age validation
	if (!isValidMESAAge(patientInfo.age)) {
		validationErrors.push('Age must be between 45-85 years for MESA calculator');
	}
	
	// Race validation  
	if (!isValidMESARace(patientInfo.relatedFactors.race)) {
		validationErrors.push('Race must be one of: White, African American, Hispanic, or Chinese American');
	}
	
	// Blood pressure validation
	if (!isValidSBP(patientInfo.systolicBloodPressure.value)) {
		validationErrors.push('Systolic blood pressure must be between 90-200 mmHg');
	}
	
	// Cholesterol validation
	if (!isValidTotalCholesterol(patientInfo.totalCholesterol.value)) {
		validationErrors.push('Total cholesterol must be between 130-320 mg/dL');
	}
	
	if (!isValidHDL(patientInfo.hdl.value)) {
		validationErrors.push('HDL cholesterol must be between 20-100 mg/dL');
	}
	
	// CAC score validation if required
	if (includeCACScore && !isValidCACScore(patientInfo.cacScore)) {
		validationErrors.push('CAC score must be between 0-5000');
	}
	
	return validationErrors;
};

export {
	calculateMESAMissingFields,
	canCalculateMESAScore,
	calculateMESARiskCard,
	validateMESAInputs,
	nullOrUnd,
	validateReading,
	isValidMESAAge,
	isValidHDL,
	isValidSBP,
	isValidTotalCholesterol,
	isValidCACScore,
	isValidMESARace,
	missingMESAFields,
};