import * as _ from 'lodash';
import React, { useState, useCallback, useEffect } from 'react';

import { AFRICAN_AMERICAN, FEMALE, IS_SMOKER, WHITE, HISPANIC, CHINESE_AMERICAN } from '../../ascvd/MESARisk';

import FormElement from '../FormElement/FormElement.jsx';
import HalfGroup from '../HalfGroup/HalfGroup.jsx';
import Feedback from '../Feedback/Feedback.jsx';

import MissingFields from '../MissingFields/MissingFields.jsx';
import RiskCard from '../RiskCard/RiskCard.jsx';

import { features, gitLastUpdated } from '../../config';

const { feedback } = features;

const get = (obj, path, otherwise) => {
	const result = _.get(obj, path);
	return result !== undefined && result !== null ? result : otherwise;
};

const notNullOrUndefined = (val) => {
	return val !== undefined && val !== null;
};

const formatDate = (date) => {
	let month = `${date.getMonth() + 1}`;
	let day = `${date.getDate()}`;
	const year = date.getFullYear();

	if (month.length < 2) {
		month = `0${month}`;
	}
	if (day.length < 2) {
		day = `0${day}`;
	}

	return [month, day, year].join('/');
};

export default function MESACalculator(props) {
	const { patientInfo, submitUserFeedback, loading, mesaRisk, mesaRiskText, mesaBackgroundColor, mesaMissingData, mesaMissingFields, goToEducator, goToEstimator } = props;
	
	const [feedbackModal, setFeedbackModal] = useState(false);
	const [notes, setNotes] = useState('');
	const [patientInfoState, setPatientInfoState] = useState(null);

	useEffect(() => {
		if (JSON.stringify(props.patientInfo) !== JSON.stringify(patientInfoState)) {
			setPatientInfoState(props.patientInfo);
		}
	}, [props.patientInfo, patientInfoState]);

	const onNotesChange = useCallback((e) => {
		setNotes(e.target.value);
	}, []);

	const toggleFeedbackModal = useCallback(() => {
		setFeedbackModal(prev => !prev);
	}, []);

	const handleSubmitUserFeedback = useCallback(() => {
		const feedbackNotes = notes || '';
		submitUserFeedback({ risk: mesaRisk?.tenYearCHDRisk, notes: feedbackNotes, riskText: mesaRiskText });
	}, [mesaRisk, notes, mesaRiskText, submitUserFeedback]);

	const gitLastUpdatedDate = new Date(gitLastUpdated);

	const missingValue = '--';

	const systolic = get(patientInfo, 'systolicBloodPressure.value', missingValue);
	const totalCholesterol = get(patientInfo, 'totalCholesterol.value', missingValue);
	const hdl = get(patientInfo, 'hdl.value', missingValue);
	const age = get(patientInfo, 'age', missingValue);

	const diabetic = get(patientInfo, 'relatedFactors.diabetic');
	const diabeticDisplay = notNullOrUndefined(diabetic) ? (diabetic ? 'Yes' : 'No') : missingValue;

	const smoker = get(patientInfo, 'relatedFactors.smoker');
	const smokerDisplay = notNullOrUndefined(smoker)
		? smoker === IS_SMOKER
			? 'Yes'
			: 'No'
		: missingValue;

	const sex = get(patientInfo, 'sex');
	const sexDisplay = sex !== null ? (sex === FEMALE ? 'Female' : 'Male') : missingValue;

	const race = get(patientInfo, 'relatedFactors.race');
	let raceDisplay = missingValue;
	if (race) {
		switch (race) {
			case WHITE:
				raceDisplay = 'White';
				break;
			case AFRICAN_AMERICAN:
				raceDisplay = 'African American';
				break;
			case HISPANIC:
				raceDisplay = 'Hispanic';
				break;
			case CHINESE_AMERICAN:
				raceDisplay = 'Chinese American';
				break;
			default:
				raceDisplay = 'Other';
		}
	}

	const infoText = !mesaMissingData ? (
		<div className="col-md-12 pt-3 pb-3">
			<p>
				The patient's MESA CHD risk score was calculated during the exam using the Multi-Ethnic Study of Atherosclerosis (MESA) risk calculator. 
				The patient's 10-year CHD risk score was found to be {mesaRisk?.tenYearCHDRisk}%, indicating a{' '}
				{mesaRiskText} level of coronary heart disease risk.
				{mesaRisk?.coronaryAge && (
					<> The patient's coronary age is estimated to be {mesaRisk.coronaryAge} years.</>
				)}
			</p>
		</div>
	) : null;

	const hypertensionTreatment = get(patientInfo, 'relatedFactors.hypertensive');
	const hypertensionTreatmentDisplay =
		hypertensionTreatment !== undefined
			? hypertensionTreatment === true
				? 'Yes'
				: 'No'
			: missingValue;

	const relativeCholesterolDate =
		patientInfo && patientInfo.cholesterolRelativeDate
			? patientInfo.cholesterolRelativeDate
			: missingValue;
	const relativeBloodPressureDate =
		patientInfo && patientInfo.bloodPressureRelativeDate
			? patientInfo.bloodPressureRelativeDate
			: missingValue;
	const cholesterolDate =
		patientInfo && patientInfo.cholesterolDate ? patientInfo.cholesterolDate : missingValue;
	const bloodPressureDate =
		patientInfo && patientInfo.bloodPressureDate ? patientInfo.bloodPressureDate : missingValue;

	let banner;
	if (!loading) {
		banner =
			mesaMissingData === false ? (
				<div className="col-md-12 text-center" style={{ fontSize: '14px' }}>
					Risk of Having Coronary Heart Disease within 10 Years
				</div>
			) : (
				<MissingFields simple fields={mesaMissingFields || []} />
			);
	}

	// MESA validation ranges
	const totalCholesterolValidRange = [130, 320];
	const systolicBloodPressureValidRange = [90, 200];
	const hdlCholesterolValidRange = [20, 100];
	const ageValidRange = [45, 85];

	return (
		<React.Fragment>
			<Feedback
				show={feedbackModal}
				handleClose={toggleFeedbackModal}
				handleSubmit={handleSubmitUserFeedback}
			/>
			<div className="row">
				<div className="col-md-8">
					<div className="row line-bottom">
						<HalfGroup>
							<FormElement name="Last Updated:" value={relativeCholesterolDate} />
							<FormElement
								name="Total Cholesterol (mg/dL):"
								value={totalCholesterol}
								date={cholesterolDate}
								min={totalCholesterolValidRange[0]}
								max={totalCholesterolValidRange[1]}
								loading={loading}
								dateHover
							/>
							<FormElement
								name="HDL Cholesterol (mg/dL):"
								value={hdl}
								date={cholesterolDate}
								min={hdlCholesterolValidRange[0]}
								max={hdlCholesterolValidRange[1]}
								loading={loading}
								dateHover
							/>
						</HalfGroup>
						<HalfGroup>
							<FormElement name="Last Updated:" value={relativeBloodPressureDate} />
							<FormElement
								name="Systolic Blood Pressure (mmHg):"
								value={systolic}
								date={bloodPressureDate}
								min={systolicBloodPressureValidRange[0]}
								max={systolicBloodPressureValidRange[1]}
								loading={loading}
								dateHover
							/>
						</HalfGroup>
					</div>
					<div className="row line-bottom">
						<HalfGroup>
							<FormElement
								name="Age:"
								value={age}
								loading={loading}
								min={ageValidRange[0]}
								max={ageValidRange[1]}
							/>
							<FormElement name="Sex:" value={sexDisplay} />
							<FormElement name="Race/Ethnicity:" value={raceDisplay} />
						</HalfGroup>
						<HalfGroup>
							<FormElement name="History of Diabetes:" value={diabeticDisplay} />
							<FormElement name="Smoker:" value={smokerDisplay} padding={15} />
							<FormElement name="Hypertension Treatment:" value={hypertensionTreatmentDisplay} />
						</HalfGroup>
					</div>
				</div>
				<div className="col-md-4 line-left pl-3 pt-3">
					{banner}
					<div className="col-md-12 pt-3 pb-3">
						<RiskCard
							risk={mesaRisk?.tenYearCHDRisk}
							riskText={mesaRiskText}
							backgroundColor={mesaBackgroundColor}
						/>
						{mesaRisk?.coronaryAge && !mesaMissingData && (
							<div className="text-center mt-3">
								<small><strong>Coronary Age: {mesaRisk.coronaryAge} years</strong></small>
							</div>
						)}
					</div>
					{!loading ? (
						<>
							{infoText}
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<button
									type="button"
									onClick={goToEducator}
									className="ml-2 btn btn-primary"
									style={{ fontSize: '18px' }}
								>
									Patient Risk Education Tool
								</button>
							</div>
						</>
					) : null}
				</div>
			</div>
			<div className="row">
				<div className="col-md-2 pt-2" style={{ textAlign: 'center' }}>
					<button
						type="button"
						onClick={goToEstimator}
						className="btn btn-link"
						style={{ padding: 0 }}
					>
						<h4 style={{ fontSize: '16px' }}>ASCVD Calculator</h4>
					</button>
				</div>
				{feedback ? (
					<div className="col-md-2 pt-2" style={{ textAlign: 'center' }}>
						<button
							type="button"
							onClick={toggleFeedbackModal}
							className="btn btn-link"
							style={{ padding: 0 }}
						>
							<h4 style={{ fontSize: '16px' }}>Provide Feedback</h4>
						</button>
					</div>
				) : null}
				<div className="col-md-2 pt-2" style={{ textAlign: 'center' }}>
					<h4 style={{ fontSize: '14px' }}>
						MESA calculations for ages 45-85. Last updated on{' '}
						{formatDate(gitLastUpdatedDate)}.
					</h4>
				</div>
			</div>
		</React.Fragment>
	);
}