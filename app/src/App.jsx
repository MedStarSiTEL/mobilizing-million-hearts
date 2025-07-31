import './App.css';

import FhirClient from 'fhirclient';
import React, { useState, useEffect, useCallback } from 'react';
import {
	ascvdScore,
	missingInformation,
	smartOnFhirIssue,
	wentToEducator,
	wentToEstimator,
	wentToMedstarGuideliens,
	wentToACCGuidelines,
	userFeedback,
} from './common/auditevents';
import { calculateRiskCard, canCalculateScore } from './ascvd/ASCVDValidator';

import AuditEventService from './services/AuditEventService';
import ErrorTranslator from './services/ErrorTranslator';
import Disclaimer from './components/Disclaimer/Disclaimer.jsx';
import DeveloperLog from './components/DeveloperInfo/DeveloperLog.jsx';
import Educator from './components/Educator/Educator.jsx';
import Estimator from './components/Estimator/Estimator.jsx';
import MESACalculator from './components/MESACalculator/MESACalculator.jsx';
import Loader from './components/Loader/Loader.jsx';
import PatientInfo from './ascvd/PatientInfo';
import RiskService from './services/RiskService';
import { computeTenYearScore } from './ascvd/ASCVDRisk';
import { computeMESATenYearScore } from './ascvd/MESARisk';
import { canCalculateMESAScore, calculateMESARiskCard } from './ascvd/MESAValidator';
import { features, medstarGuidelines, accGuidelines } from './config';

const pages = {
	estimator: 'Estimator',
	mesa: 'MESACalculator',
	educator: 'Educator',
	developerLog: 'DeveloperLog',
};

const titles = {
	Educator: 'Patient Risk Educator',
	Estimator: 'ASCVD Risk Estimator',
	MESACalculator: 'MESA Risk Calculator',
	DeveloperLog: 'Developer Log',
};

const unpackAuditInformationFromClient = (client) => {
	const { id: patient } = client.patient;
	const { tokenResponse } = client.state;
	const { encounter, user, tenant } = tokenResponse;
	return { patient, encounter, user, tenant };
};

export default function App() {
	const [state, setState] = useState({
		patientInfo: new PatientInfo(),
		page: pages.estimator,
		risk: null,
		mesaRisk: null,
		errored: false,
		loading: true,
		riskText: '',
		mesaRiskText: '',
		backgroundColor: 'white',
		mesaBackgroundColor: 'white',
		missingData: false,
		mesaMissingData: false,
		missingFields: [],
		mesaMissingFields: [],
		developerInfo: [],
	});

	const [auditEventService, setAuditEventService] = useState(new AuditEventService());
	const [errorTranslator] = useState(new ErrorTranslator());

	useEffect(() => {
		FhirClient.oauth2
			.ready()
			.then((client) => {
				const riskService = new RiskService(client, log);
				const auditInformation = unpackAuditInformationFromClient(client);
				const newAuditEventService = new AuditEventService(auditInformation);
				setAuditEventService(newAuditEventService);

				return riskService.getRiskInformation(client.patient.id).then(async (patientInfo) => {
					// Calculate ASCVD Risk
					const tenYearRisk = canCalculateScore(patientInfo)
						? computeTenYearScore(patientInfo)
						: null;
					const cardInfo = calculateRiskCard(tenYearRisk, patientInfo);
					
					// Calculate MESA Risk
					const mesaTenYearRisk = canCalculateMESAScore(patientInfo)
						? computeMESATenYearScore(patientInfo)
						: null;
					const mesaCardInfo = calculateMESARiskCard(mesaTenYearRisk, patientInfo);
					
					if (cardInfo.missingData) {
						await submitMissingInformationEvent(cardInfo.missingFields, newAuditEventService);
					} else {
						await submitScoreAuditEvent(tenYearRisk, newAuditEventService);
					}
					setState(prevState => ({
						...prevState,
						risk: tenYearRisk,
						mesaRisk: mesaTenYearRisk,
						loading: false,
						smart: client,
						patientInfo,
						...cardInfo,
						mesaRiskText: mesaCardInfo.riskText,
						mesaBackgroundColor: mesaCardInfo.backgroundColor,
						mesaMissingData: mesaCardInfo.missingData,
						mesaMissingFields: mesaCardInfo.missingFields,
						...auditInformation,
					}));
				});
			})
			.catch(async (e) => {
				const display = errorTranslator.translate(e.toString());
				setState(prevState => ({ ...prevState, errored: display, loading: false }));
				await submitErrorEvent(e, auditEventService);
			});
	}, []);

	const submitGoToEducatorEvent = useCallback(async (service = auditEventService) => {
		const { name, description } = wentToEducator;
		return service.create(name, { description });
	}, [auditEventService]);

	const submitGoToEstimatorEvent = useCallback(async (service = auditEventService) => {
		const { name, description } = wentToEstimator;
		return service.create(name, { description });
	}, [auditEventService]);

	const submitGoToMedstarGuidelinesEvent = useCallback(async (service = auditEventService) => {
		const { name, description } = wentToMedstarGuideliens;
		return service.create(name, { description });
	}, [auditEventService]);

	const submitGoToACCGuidelinesEvent = useCallback(async (service = auditEventService) => {
		const { name, description } = wentToACCGuidelines;
		return service.create(name, { description });
	}, [auditEventService]);

	const submitScoreAuditEvent = useCallback(async (risk, service = auditEventService) => {
		const { name, description } = ascvdScore;
		return service.create(name, { content: `${risk}`, description });
	}, [auditEventService]);

	const submitErrorEvent = useCallback(async (error, service = auditEventService) => {
		const { name, description } = smartOnFhirIssue;
		return service.create(name, { content: error.toString(), description });
	}, [auditEventService]);

	const submitUserFeedbackEvent = useCallback(async (feedback, service = auditEventService) => {
		const { name, description } = userFeedback;
		return service.create(name, { content: feedback, description });
	}, [auditEventService]);

	const submitMissingInformationEvent = useCallback(async (missingFields, service = auditEventService) => {
		const { name, description } = missingInformation;
		const missingFieldsFormatted = missingFields.join(', ');
		return service.create(name, { content: missingFieldsFormatted, description });
	}, [auditEventService]);

	const goToEducator = useCallback(async () => {
		await submitGoToEducatorEvent();
		setState(prevState => ({ ...prevState, page: pages.educator }));
	}, [submitGoToEducatorEvent]);

	const goToEstimator = useCallback(async () => {
		await submitGoToEstimatorEvent();
		setState(prevState => ({ ...prevState, page: pages.estimator }));
	}, [submitGoToEstimatorEvent]);

	const goToMESACalculator = useCallback(async () => {
		// Using the same audit event as estimator for now
		await submitGoToEstimatorEvent();
		setState(prevState => ({ ...prevState, page: pages.mesa }));
	}, [submitGoToEstimatorEvent]);

	const goToMedstarGuidelines = useCallback(async () => {
		await submitGoToMedstarGuidelinesEvent();
		window.open(medstarGuidelines);
	}, [submitGoToMedstarGuidelinesEvent]);

	const goToACCGuidelines = useCallback(async () => {
		await submitGoToACCGuidelinesEvent();
		window.open(accGuidelines);
	}, [submitGoToACCGuidelinesEvent]);

	const log = useCallback((value) => {
		setState(prevState => ({
			...prevState,
			developerInfo: prevState.developerInfo.concat(JSON.parse(JSON.stringify(value)))
		}));
	}, []);

	const { page, loading, errored, developerInfo } = state;
	const title = titles[page];

	let pageToRender;
	let logComponent;

	// Have to manage what "page" we are on manually, as we cannot use a Router in the EHR
	if (page === pages.estimator) {
		pageToRender = (
			<Estimator
				goToEducator={goToEducator}
				goToMESACalculator={goToMESACalculator}
				goToMedstarGuidelines={goToMedstarGuidelines}
				goToACCGuidelines={goToACCGuidelines}
				submitUserFeedback={submitUserFeedbackEvent}
				log={log}
				{...state}
			/>
		);
	} else if (page === pages.mesa) {
		pageToRender = (
			<MESACalculator
				goToEducator={goToEducator}
				goToEstimator={goToEstimator}
				submitUserFeedback={submitUserFeedbackEvent}
				log={log}
				{...state}
			/>
		);
	} else if (page === pages.educator) {
		pageToRender = <Educator log={log} {...state} />;
	} else {
		pageToRender = <DeveloperLog log={developerInfo} />;
	}

	if (features.developerLog) {
		const { page: currentPage } = state;
		logComponent =
			currentPage === 'DeveloperInfo' ? (
				<button
					type="button"
					className="ml-2 btn btn-primary"
					style={{ fontSize: '14px' }}
					onClick={() => goToEstimator()}
				>
					Back to Estimator
				</button>
			) : (
				<button
					type="button"
					className="ml-2 btn btn-primary"
					style={{ fontSize: '14px' }}
					onClick={() => setState(prevState => ({ ...prevState, page: 'DeveloperInfo' }))}
				>
					Developer Log
				</button>
			);
	}

	return (
		<div className="App">
			<Loader active={loading} spinner>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12 line-bottom">
							{errored ? (
								<div
									className="alert alert-danger"
									style={{ display: 'inline-block' }}
									role="alert"
								>
									{errored.toString()}
								</div>
							) : null}
							<h1 style={{ fontSize: '24px', marginTop: '12px' }}>
								{title}
								{page === pages.estimator || page === pages.mesa ? (
									<p hidden />
								) : (
									<button
										type="button"
										className="ml-2 btn btn-primary"
										style={{ fontSize: '14px' }}
										onClick={goToEstimator}
									>
										Back to ASCVD
									</button>
								)}
							</h1>
							<Disclaimer />
						</div>
					</div>
					{pageToRender}
				</div>
			</Loader>
			{logComponent}
		</div>
	);
}