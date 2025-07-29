# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ASCVD Risk Calculator - Mobilizing Million Hearts

## Project Overview

This is a **SMART on FHIR** enabled React application for calculating cardiovascular disease risk scores in clinical settings. The application integrates with Electronic Health Records (EHRs) to automatically retrieve patient data and calculate both ASCVD (2013 AHA/ACC equations) and MESA (Multi-Ethnic Study of Atherosclerosis) risk scores.

## Tech Stack

- **React**: 18.2.0
- **Build Tool**: Vite 5.0.10
- **Styling**: Bootstrap 5.3.2, React Bootstrap 2.9.2
- **Charts**: Chart.js 4.4.1, React-Chartjs-2 5.2.0
- **FHIR Integration**: fhirclient 2.5.2
- **Testing**: Vitest (fully migrated from Jest)

## Common Commands

### Frontend Application (React + Vite)
```bash
# Development server with hot reload (port 3000, auto-open)
npm start  # or npm run dev

# Production build (outputs to ./build/)
npm run build

# Preview production build (port 3000)
npm run preview

# Run tests with Vitest
npm test
npm run test:coverage  # with coverage report (text, json, html)
npm run test:ui        # with browser UI

# Code quality (with Prettier integration)
npm run lint           # ESLint with auto-fix
npm run prettier       # Format code
```

### Backend Server (Express)
```bash
cd ../server

# Install dependencies and setup database  
yarn install
yarn migrate           # Initialize SQLite database

# Start server (serves built React app)
yarn start

# Run server tests
yarn test
```

### Full Application Setup
The application requires both frontend and backend components:

1. **Configure FHIR connection** - Create `.env` in `/app/` directory:
   ```bash
   CLIENT_ID=your-fhir-app-client-id
   SCOPE=patient/Patient.read patient/Observation.read patient/MedicationStatement.read patient/Condition.read
   ISS=https://your-fhir-server/
   REDIRECT_URI=http://where-your-app-is-deployed/
   ```

2. **Build and serve**: The Express server in `/server/` serves the built React app from `/app/build/`

3. **SMART Launch**: Application must be launched from a SMART on FHIR portal using `/launch.html` endpoint

## Key Features

### ASCVD Risk Calculator
- Calculates 10-year ASCVD risk based on patient data
- Supports various risk factors: age, gender, race, cholesterol levels, blood pressure, diabetes, smoking status
- Integrates with FHIR-based electronic health records

### MESA Risk Calculator
- Multi-Ethnic Study of Atherosclerosis risk calculator
- Supports ages 45-85
- Covers 4 ethnic groups: White, African American, Hispanic, Chinese American
- Located in `src/ascvd/` directory

### SMART on FHIR Integration
- Connects to FHIR-compliant EHR systems
- Retrieves patient data automatically
- Supports OAuth2 authentication flow

## Architecture

### High-Level Architecture
This is a **modular SMART on FHIR application** with clear separation between frontend (React SPA) and backend (Express server):

- **Frontend** (`/app/`): React 18 SPA that handles UI and risk calculations
- **Backend** (`/server/`): Express.js server for SMART launch, audit logging, and serving the built app
- **Integration**: SMART on FHIR OAuth2 flow for EHR connectivity
- **Data Flow**: EHR → FHIR Resources → Risk Calculations → Patient-facing UI

### Key Components Architecture

**1. Risk Calculation Engine (`/src/ascvd/`)**
- `ASCVDRisk.js` - Core 2013 AHA/ACC ASCVD risk equations with race/gender coefficients
- `MESARisk.js` - MESA risk calculations for 4 ethnic groups (ages 45-85)
- `PatientInfo.js` - Centralized patient data model
- `*Validator.js` - Input validation with clinical range checking

**2. FHIR Integration Layer (`/src/services/`)**
- `RiskService.js` - **Complex 847-line service** that orchestrates FHIR data retrieval
- Handles Patient, Observation, Condition, MedicationStatement resources
- Maps clinical codes across multiple systems (LOINC, SNOMED, ICD-9/10, RxNorm)
- Implements data freshness filtering (configurable cutoff periods)

**3. Clinical Code Mapping (`/src/common/fhirCodes.js`)**  
- **2,236-line mapping file** containing clinical terminology
- Maps concepts to multiple coding systems for interoperability
- Enables recognition of equivalent codes from different EHR vendors

**4. UI Components (`/src/components/`)**
- Class-based React components (legacy pattern, consider modernizing)
- `Estimator.jsx` - Main risk calculator interface  
- `Educator.jsx` - Patient education and "what-if" scenarios
- Bootstrap-based responsive design

### SMART on FHIR Launch Flow
1. **EHR Launch** → `launch.html` with OAuth2 authorization
2. **Token Exchange** → `fhirclient` library handles authentication  
3. **Resource Access** → Fetch Patient, Observations, Conditions, Medications
4. **Risk Calculation** → Process clinical data through ASCVD/MESA algorithms
5. **Display Results** → Patient-facing risk scores with educational content

### Data Processing Pipeline
```
FHIR Resources → Code Mapping → Validation → Risk Calculation → UI Display
```

- **FHIR Resources**: Raw clinical data from EHR
- **Code Mapping**: Normalize different coding systems using `fhirCodes.js`
- **Validation**: Check data completeness and ranges via `*Validator.js`  
- **Risk Calculation**: Apply clinical algorithms in `*Risk.js`
- **UI Display**: Present results with patient education

### Environment Configuration
```bash
# FHIR Server Configuration (Required)
CLIENT_ID=         # SMART app client identifier
SCOPE=            # FHIR resource permissions  
ISS=              # FHIR server base URL
REDIRECT_URI=     # OAuth2 callback URL

# Data Freshness (Optional)
BLOODPRESSURE_CUTOFF=5  # Years - how old BP data to accept
CHOLESTEROL_CUTOFF=5    # Years - how old lipid data to accept

# Features (Optional)  
AUDITING=true          # Enable usage tracking to SQLite
ENABLE_DEVELOPERS_LOG= # Debug logging for development
```

## Testing

### Test Architecture
The application uses **Vitest** (Vite-native testing) with comprehensive coverage:

```bash
# Run all tests
npm test

# Run with coverage report (text, json, html formats)
npm run test:coverage

# Interactive test UI
npm run test:ui

# Run single test file
npm test MESARisk.test.js
```

**Vitest Configuration** (in `vite.config.js`):
- Global test setup with jsdom environment  
- CSS processing enabled for component tests
- Setup file: `src/test/setup.js`
- Coverage excludes: test files, node_modules

### Test Coverage Areas
- **Risk Calculation Logic**: ASCVD and MESA algorithm validation
- **FHIR Data Processing**: Service layer and code mapping
- **Input Validation**: Clinical range checking and error handling  
- **Component Behavior**: UI components with Testing Library

### Key Test Files
- `src/ascvd/tests/` - Risk calculation algorithm tests
- `__fixtures__/` - FHIR resource test data (converted to ES6 modules)
- Various component `.test.js` files throughout codebase

## Deployment

### Docker Deployment (Recommended)
```bash  
# Development environment
docker-compose up

# Or build custom image
NODE_ENV=development docker build -t hearts .
docker run -p 3000:3000 hearts
```

### Manual Deployment
1. **Build React App**:
   ```bash
   cd app/
   npm run build  # Creates build/ directory
   ```

2. **Configure Server**:  
   ```bash
   cd ../server/
   yarn install
   yarn migrate    # Initialize SQLite database
   yarn start      # Serves app from ../app/build/
   ```

The Express server serves the built React app and handles SMART launch endpoints.

## Important Development Notes

### Vite Migration Changes
- **Build System**: Migrated from Create React App to Vite for faster development
- **Environment Variables**: No longer use `REACT_APP_` prefix - handled via `vite.config.js` define
- **Bundle Optimization**: Manual chunks configured for vendor, bootstrap, charts, fhir, utils
- **Dev Server**: Runs on port 3000 with CORS enabled and auto-open
- **Asset Handling**: Static assets output to `build/static/` directory
- **SCSS Support**: Bootstrap SCSS variables available globally

### FHIR Integration Complexity
- **RiskService.js** is the most complex file (847 lines) - handles all FHIR data retrieval
- **fhirCodes.js** contains extensive clinical code mappings (2,236 lines) - be cautious when modifying
- FHIR resource parsing logic handles multiple coding systems and data freshness validation

### Code Architecture Patterns  
- **Legacy React**: Uses class-based components (consider modernizing to hooks)
- **ES6 Modules**: All code uses modern import/export (migrated from CommonJS)
- **File Extensions**: React components use `.jsx` extension  
- **Testing**: Fully migrated to Vitest (no legacy Jest)
- **Build System**: Migrated from Create React App to Vite
- **Environment Variables**: Handled via Vite's `define` config (not `REACT_APP_` prefix)
- **Path Aliases**: `@/` configured for `./src/` directory

### Clinical Data Validation
- Input validation uses clinical ranges (e.g., BP: 90-200/60-130, Cholesterol: 130-320)
- Age restrictions: ASCVD (40-79), MESA (45-85)
- Data freshness cutoffs configurable via environment variables

### SMART on FHIR Requirements
- Must be launched from EHR portal (not direct URL access)
- Requires proper SMART app registration with correct scopes
- OAuth2 flow handled by `fhirclient` library
- Launch endpoint: `/launch.html`, redirect to `/`