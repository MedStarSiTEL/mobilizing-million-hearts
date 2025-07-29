import PatientInfo from './PatientInfo';
import { computeMESATenYearScore, computeMESAWithCAC } from './MESARisk';

describe('MESA Risk calculation tests', () => {
	test('MESA Risk should calculate for white female patient', () => {
		const patient = {
			firstName: 'Jane',
			lastName: 'Doe',
			birthDate: '1965-03-13T00:00:00.000Z',
			age: 59,
			sex: 'female',
			race: 'white',
		};

		const relatedFactors = {
			smoker: 'not',
		};

		const bloodPressure = {
			diastolicBloodPressure: { value: 80, unit: 'mmHg' },
			systolicBloodPressure: { value: 120, unit: 'mmHg' },
			bloodPressureDate: 'Oct 20, 2023',
			bloodPressureRelativeDate: '1 month ago',
		};

		const cholesterol = {
			hdl: { value: 55, unit: 'mg/dL' },
			ldl: { value: 120, unit: 'mg/dL' },
			total: { value: 180, unit: 'mg/dL' },
			cholesterolDate: 'Oct 13, 2023',
			cholesterolRelativeDate: '1 month ago',
		};

		const condition = { diabetic: false };

		const medication = { statin: false, aspirin: false, hypertensionMeds: false };

		const patientInfo = new PatientInfo({
			patient,
			cholesterol,
			bloodPressure,
			medication,
			condition,
			relatedFactors,
		});

		const result = computeMESATenYearScore(patientInfo);

		expect(result).not.toBeNull();
		expect(result.tenYearCHDRisk).toBeGreaterThan(0);
		expect(result.coronaryAge).toBeGreaterThanOrEqual(patient.age);
		expect(typeof result.tenYearCHDRisk).toBe('number');
		expect(typeof result.coronaryAge).toBe('number');
	});

	test('MESA Risk should calculate for African American male patient', () => {
		const patient = {
			firstName: 'John',
			lastName: 'Smith',
			birthDate: '1960-06-15T00:00:00.000Z',
			age: 64,
			sex: 'male',
			race: 'africanamerican',
		};

		const relatedFactors = {
			smoker: 'current',
		};

		const bloodPressure = {
			diastolicBloodPressure: { value: 90, unit: 'mmHg' },
			systolicBloodPressure: { value: 145, unit: 'mmHg' },
			bloodPressureDate: 'Oct 20, 2023',
			bloodPressureRelativeDate: '1 month ago',
		};

		const cholesterol = {
			hdl: { value: 40, unit: 'mg/dL' },
			ldl: { value: 160, unit: 'mg/dL' },
			total: { value: 220, unit: 'mg/dL' },
			cholesterolDate: 'Oct 13, 2023',
			cholesterolRelativeDate: '1 month ago',
		};

		const condition = { diabetic: true };

		const medication = { statin: true, aspirin: true, hypertensionMeds: true };

		const patientInfo = new PatientInfo({
			patient,
			cholesterol,
			bloodPressure,
			medication,
			condition,
			relatedFactors,
		});

		const result = computeMESATenYearScore(patientInfo);

		expect(result).not.toBeNull();
		expect(result.tenYearCHDRisk).toBeGreaterThan(0);
		expect(result.coronaryAge).toBeGreaterThan(patient.age); // Should be higher due to risk factors
		expect(typeof result.tenYearCHDRisk).toBe('number');
		expect(typeof result.coronaryAge).toBe('number');
	});

	test('MESA Risk should return null for patient under 45', () => {
		const patient = {
			firstName: 'Young',
			lastName: 'Patient',
			birthDate: '1985-03-13T00:00:00.000Z',
			age: 39,
			sex: 'male',
			race: 'white',
		};

		const relatedFactors = { smoker: 'not' };
		const bloodPressure = {
			diastolicBloodPressure: { value: 80, unit: 'mmHg' },
			systolicBloodPressure: { value: 120, unit: 'mmHg' },
		};
		const cholesterol = {
			hdl: { value: 50, unit: 'mg/dL' },
			ldl: { value: 100, unit: 'mg/dL' },
			total: { value: 170, unit: 'mg/dL' },
		};
		const condition = { diabetic: false };
		const medication = { hypertensionMeds: false };

		const patientInfo = new PatientInfo({
			patient,
			cholesterol,
			bloodPressure,
			medication,
			condition,
			relatedFactors,
		});

		const result = computeMESATenYearScore(patientInfo);

		expect(result).toBeNull();
	});

	test('MESA Risk should return null for patient over 85', () => {
		const patient = {
			firstName: 'Elderly',
			lastName: 'Patient',
			birthDate: '1935-03-13T00:00:00.000Z',
			age: 89,
			sex: 'female',
			race: 'white',
		};

		const relatedFactors = { smoker: 'not' };
		const bloodPressure = {
			diastolicBloodPressure: { value: 80, unit: 'mmHg' },
			systolicBloodPressure: { value: 140, unit: 'mmHg' },
		};
		const cholesterol = {
			hdl: { value: 60, unit: 'mg/dL' },
			ldl: { value: 120, unit: 'mg/dL' },
			total: { value: 200, unit: 'mg/dL' },
		};
		const condition = { diabetic: false };
		const medication = { hypertensionMeds: false };

		const patientInfo = new PatientInfo({
			patient,
			cholesterol,
			bloodPressure,
			medication,
			condition,
			relatedFactors,
		});

		const result = computeMESATenYearScore(patientInfo);

		expect(result).toBeNull();
	});

	test('MESA Risk with CAC score should include CAC data in result', () => {
		const patient = {
			firstName: 'Test',
			lastName: 'Patient',
			birthDate: '1975-03-13T00:00:00.000Z',
			age: 49,
			sex: 'female',
			race: 'white',
		};

		const relatedFactors = { smoker: 'not' };
		const bloodPressure = {
			diastolicBloodPressure: { value: 75, unit: 'mmHg' },
			systolicBloodPressure: { value: 115, unit: 'mmHg' },
		};
		const cholesterol = {
			hdl: { value: 65, unit: 'mg/dL' },
			ldl: { value: 100, unit: 'mg/dL' },
			total: { value: 170, unit: 'mg/dL' },
		};
		const condition = { diabetic: false };
		const medication = { hypertensionMeds: false };

		const patientInfo = new PatientInfo({
			patient,
			cholesterol,
			bloodPressure,
			medication,
			condition,
			relatedFactors,
		});

		// Test CAC functionality
		const resultWithCAC = computeMESAWithCAC(patientInfo, 100);
		
		expect(resultWithCAC.cacScore).toBe(100);
		expect(resultWithCAC.cacAdjusted).toBe(true);
		expect(resultWithCAC.tenYearCHDRisk).toBeGreaterThan(0);
		expect(resultWithCAC.coronaryAge).toBeGreaterThanOrEqual(patient.age);
	});

	test('MESA Risk should handle Hispanic female patient', () => {
		const patient = {
			firstName: 'Maria',
			lastName: 'Rodriguez',
			birthDate: '1968-08-20T00:00:00.000Z',
			age: 56,
			sex: 'female',
			race: 'hispanic',
		};

		const relatedFactors = { smoker: 'former' };
		const bloodPressure = {
			diastolicBloodPressure: { value: 85, unit: 'mmHg' },
			systolicBloodPressure: { value: 135, unit: 'mmHg' },
		};
		const cholesterol = {
			hdl: { value: 50, unit: 'mg/dL' },
			ldl: { value: 140, unit: 'mg/dL' },
			total: { value: 210, unit: 'mg/dL' },
		};
		const condition = { diabetic: false };
		const medication = { hypertensionMeds: true };

		const patientInfo = new PatientInfo({
			patient,
			cholesterol,
			bloodPressure,
			medication,
			condition,
			relatedFactors,
		});

		const result = computeMESATenYearScore(patientInfo);

		expect(result).not.toBeNull();
		expect(result.tenYearCHDRisk).toBeGreaterThan(0);
		expect(result.coronaryAge).toBeGreaterThanOrEqual(patient.age);
	});

	test('MESA Risk should handle Chinese American male patient', () => {
		const patient = {
			firstName: 'Wei',
			lastName: 'Chen',
			birthDate: '1972-12-05T00:00:00.000Z',
			age: 52,
			sex: 'male',
			race: 'chineseamerican',
		};

		const relatedFactors = { smoker: 'not' };
		const bloodPressure = {
			diastolicBloodPressure: { value: 78, unit: 'mmHg' },
			systolicBloodPressure: { value: 125, unit: 'mmHg' },
		};
		const cholesterol = {
			hdl: { value: 48, unit: 'mg/dL' },
			ldl: { value: 115, unit: 'mg/dL' },
			total: { value: 175, unit: 'mg/dL' },
		};
		const condition = { diabetic: false };
		const medication = { hypertensionMeds: false };

		const patientInfo = new PatientInfo({
			patient,
			cholesterol,
			bloodPressure,
			medication,
			condition,
			relatedFactors,
		});

		const result = computeMESATenYearScore(patientInfo);

		expect(result).not.toBeNull();
		expect(result.tenYearCHDRisk).toBeGreaterThan(0);
		expect(result.coronaryAge).toBeGreaterThanOrEqual(patient.age);
	});
});