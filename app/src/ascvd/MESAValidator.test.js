import PatientInfo from './PatientInfo';
import {
	canCalculateMESAScore,
	calculateMESARiskCard,
	validateMESAInputs,
	isValidMESAAge,
	isValidMESARace,
	isValidCACScore,
	missingMESAFields,
} from './MESAValidator';

describe('MESA Validator tests', () => {
	const createValidPatientInfo = () => {
		const patient = {
			firstName: 'Test',
			lastName: 'Patient',
			birthDate: '1965-03-13T00:00:00.000Z',
			age: 59,
			sex: 'female',
			race: 'white',
		};

		const relatedFactors = { smoker: 'not' };
		const bloodPressure = {
			diastolicBloodPressure: { value: 80, unit: 'mmHg' },
			systolicBloodPressure: { value: 120, unit: 'mmHg' },
		};
		const cholesterol = {
			hdl: { value: 55, unit: 'mg/dL' },
			ldl: { value: 120, unit: 'mg/dL' },
			total: { value: 180, unit: 'mg/dL' },
		};
		const condition = { diabetic: false };
		const medication = { hypertensionMeds: false };

		return new PatientInfo({
			patient,
			cholesterol,
			bloodPressure,
			medication,
			condition,
			relatedFactors,
		});
	};

	test('should validate valid MESA age range', () => {
		expect(isValidMESAAge(45)).toBe(true);
		expect(isValidMESAAge(65)).toBe(true);
		expect(isValidMESAAge(85)).toBe(true);
		expect(isValidMESAAge(44)).toBe(false);
		expect(isValidMESAAge(86)).toBe(false);
	});

	test('should validate MESA race options', () => {
		expect(isValidMESARace('white')).toBe(true);
		expect(isValidMESARace('africanamerican')).toBe(true);
		expect(isValidMESARace('hispanic')).toBe(true);
		expect(isValidMESARace('chineseamerican')).toBe(true);
		expect(isValidMESARace('other')).toBe(false);
		expect(isValidMESARace('asian')).toBe(false);
	});

	test('should validate CAC score range', () => {
		expect(isValidCACScore(0)).toBe(true);
		expect(isValidCACScore(100)).toBe(true);
		expect(isValidCACScore(1000)).toBe(true);
		expect(isValidCACScore(null)).toBe(true); // CAC is optional
		expect(isValidCACScore(undefined)).toBe(true);
		expect(isValidCACScore(-1)).toBe(false);
		expect(isValidCACScore(5001)).toBe(false);
	});

	test('should return true for valid patient info', () => {
		const patientInfo = createValidPatientInfo();
		expect(canCalculateMESAScore(patientInfo)).toBe(true);
	});

	test('should return false for invalid age', () => {
		const patientInfo = createValidPatientInfo();
		patientInfo.age = 40; // Below MESA range
		expect(canCalculateMESAScore(patientInfo)).toBe(false);
	});

	test('should return false for invalid race', () => {
		const patientInfo = createValidPatientInfo();
		patientInfo.relatedFactors.race = 'other';
		expect(canCalculateMESAScore(patientInfo)).toBe(false);
	});

	test('should return false for missing required fields', () => {
		const patientInfo = createValidPatientInfo();
		patientInfo.systolicBloodPressure.value = null;
		expect(canCalculateMESAScore(patientInfo)).toBe(false);
	});

	test('should validate with CAC score when required', () => {
		const patientInfo = createValidPatientInfo();
		patientInfo.cacScore = 150;
		expect(canCalculateMESAScore(patientInfo, true)).toBe(true);
		
		patientInfo.cacScore = -10;
		expect(canCalculateMESAScore(patientInfo, true)).toBe(false);
	});

	test('should identify missing MESA fields', () => {
		const patientInfo = new PatientInfo();
		// Override defaults to null to simulate truly missing data
		patientInfo.relatedFactors.diabetic = null;
		patientInfo.relatedFactors.smoker = null;
		patientInfo.relatedFactors.hypertensive = null;
		patientInfo.relatedFactors.race = null; // Also set race to null
		const missingFields = missingMESAFields(patientInfo);
		
		expect(missingFields.length).toBeGreaterThan(0);
		expect(missingFields).toContain('Missing Systolic Blood Pressure');
		expect(missingFields).toContain('Missing Age');
		expect(missingFields).toContain('Missing HDL Cholesterol');
		expect(missingFields).toContain('Missing Total Cholesterol');
		expect(missingFields).toContain('Missing History of Diabetes');
		expect(missingFields).toContain('Missing Smoking Status');
		expect(missingFields).toContain('Missing Race/Ethnicity');
		expect(missingFields).toContain('Missing Hypertension Treatment Status');
		expect(missingFields).toContain('Missing Sex');
	});

	test('should validate MESA inputs and return appropriate errors', () => {
		const patientInfo = createValidPatientInfo();
		patientInfo.age = 40; // Invalid age
		patientInfo.relatedFactors.race = 'other'; // Invalid race
		patientInfo.systolicBloodPressure.value = 300; // Invalid BP
		
		const errors = validateMESAInputs(patientInfo);
		
		expect(errors.length).toBeGreaterThan(0);
		expect(errors).toContain('Age must be between 45-85 years for MESA calculator');
		expect(errors).toContain('Race must be one of: White, African American, Hispanic, or Chinese American');
		expect(errors).toContain('Systolic blood pressure must be between 90-200 mmHg');
	});

	test('should calculate MESA risk card for low CHD risk', () => {
		const riskResult = {
			tenYearCHDRisk: 2.5,
			coronaryAge: 55
		};
		const patientInfo = createValidPatientInfo();
		
		const riskCard = calculateMESARiskCard(riskResult, patientInfo);
		
		expect(riskCard.riskText).toBe('Low CHD Risk');
		expect(riskCard.backgroundColor).toBe('#2ecc71');
		expect(riskCard.missingData).toBe(false);
		expect(riskCard.coronaryAge).toBe(55);
	});

	test('should calculate MESA risk card for borderline CHD risk', () => {
		const riskResult = {
			tenYearCHDRisk: 5.0,
			coronaryAge: 62
		};
		const patientInfo = createValidPatientInfo();
		
		const riskCard = calculateMESARiskCard(riskResult, patientInfo);
		
		expect(riskCard.riskText).toBe('Borderline CHD Risk');
		expect(riskCard.backgroundColor).toBe('#ffff7e');
		expect(riskCard.missingData).toBe(false);
		expect(riskCard.coronaryAge).toBe(62);
	});

	test('should calculate MESA risk card for intermediate CHD risk', () => {
		const riskResult = {
			tenYearCHDRisk: 10.0,
			coronaryAge: 68
		};
		const patientInfo = createValidPatientInfo();
		
		const riskCard = calculateMESARiskCard(riskResult, patientInfo);
		
		expect(riskCard.riskText).toBe('Intermediate CHD Risk');
		expect(riskCard.backgroundColor).toBe('#fcbb41');
		expect(riskCard.missingData).toBe(false);
		expect(riskCard.coronaryAge).toBe(68);
	});

	test('should calculate MESA risk card for high CHD risk', () => {
		const riskResult = {
			tenYearCHDRisk: 20.0,
			coronaryAge: 75
		};
		const patientInfo = createValidPatientInfo();
		
		const riskCard = calculateMESARiskCard(riskResult, patientInfo);
		
		expect(riskCard.riskText).toBe('High CHD Risk');
		expect(riskCard.backgroundColor).toBe('#f64747');
		expect(riskCard.missingData).toBe(false);
		expect(riskCard.coronaryAge).toBe(75);
	});

	test('should handle invalid risk result', () => {
		const patientInfo = createValidPatientInfo();
		
		const riskCard = calculateMESARiskCard(null, patientInfo);
		
		expect(riskCard.riskText).toBe('Invalid Data');
		expect(riskCard.backgroundColor).toBe('#f64747');
		expect(riskCard.missingData).toBe(true);
	});

	test('should return no validation errors for valid patient', () => {
		const patientInfo = createValidPatientInfo();
		const errors = validateMESAInputs(patientInfo);
		
		expect(errors).toEqual([]);
	});
});