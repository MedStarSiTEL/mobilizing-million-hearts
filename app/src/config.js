export const clientId = process.env.CLIENT_ID;
export const scope = process.env.SCOPE;
export const iss = process.env.ISS;
export const redirectUri = process.env.REDIRECT_URI;

export const bloodPressureCutoff = process.env.BLOODPRESSURE_CUTOFF || 5; // years
export const cholesterolCutoff = process.env.CHOLESTEROL_CUTOFF || 5;

export const accGuidelines = 'http://www.onlinejacc.org/sites/default/files/additional_assets/guidelines/Prevention-Guidelines-Made-Simple.pdf';
export const medstarGuidelines = '/MedStarGuidelines.pdf';
export const riskEnhancingFactors = '/RiskEnhancingFactors.pdf';

export const documentReferenceConfiguration = {
	coding: [
		{
			system: 'http://loinc.org',
			code: '34133-9', // -> External CCDA Document
			// code: '3374547', -> Depart Summary
		},
	],
	docStatus: {
		coding: [{ system: 'http://hl7.org/fhir/composition-status', code: 'final' }],
	},
};

export const features = {
	auditing: process.env.AUDITING === 'true' || false,
	developerLog: process.env.ENABLE_DEVELOPERS_LOG === 'true' || false,
	feedback: true,
};

export const gitLastUpdated = process.env.GIT_LAST_UPDATED || new Date().toString();

// Default export for backwards compatibility
export default {
	clientId,
	scope,
	iss,
	redirectUri,
	bloodPressureCutoff,
	cholesterolCutoff,
	accGuidelines,
	medstarGuidelines,
	riskEnhancingFactors,
	documentReferenceConfiguration,
	features,
	gitLastUpdated,
};
