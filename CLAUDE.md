# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mobilizing Million Hearts is a SMART on FHIR application for calculating and displaying cardiovascular risk. It consists of two main components:

- **Frontend App** (`app/`): React SPA that integrates with FHIR servers to calculate ASCVD (Atherosclerotic Cardiovascular Disease) risk
- **Backend Server** (`server/`): Express.js server providing audit event logging and serving the built frontend

## Architecture

### Frontend (`app/`)
- React application with Bootstrap UI components
- FHIR client integration using `fhirclient` library
- Core risk calculation logic in `src/ascvd/` directory
- Reusable UI components in `src/components/`
- Services layer in `src/services/` for FHIR data handling

### Backend (`server/`)
- Express.js server with SQLite database (Sequelize ORM)
- REST API for audit events in `src/rest/auditevent/`
- Database migrations in `migrations/`
- Serves built frontend app from `../app/build`

## Development Commands

### Frontend App (from `app/` directory)
```bash
yarn install          # Install dependencies
yarn start            # Start development server
yarn build             # Build production bundle
yarn test             # Run Jest tests with coverage
yarn lint             # Run ESLint
yarn prettier         # Format code with Prettier
```

### Backend Server (from `server/` directory)
```bash
yarn install          # Install dependencies
yarn migrate          # Run database migrations (creates ../data directory)
yarn start            # Start server (default port 3000, use -p flag to change)
yarn test             # Run Jest tests
yarn lint             # Run ESLint
yarn prettier         # Format code
```

### Docker Options
```bash
docker-compose up      # Run full stack
docker build -t hearts . && docker run -p 3000:3000 hearts  # Single container
```

## Configuration

### Required Environment Files
1. `app/.env` - SMART on FHIR configuration (CLIENT_ID, SCOPE, ISS, REDIRECT_URI required)
2. `server/.env` - Server configuration (DB_STORAGE, NODE_ENV optional)

### Key Configuration Variables
- `AUDITING=true` in app/.env enables usage statistics collection
- `ENABLE_DEVELOPERS_LOG=true` shows additional debug information
- `BLOODPRESSURE_CUTOFF` and `CHOLESTEROL_CUTOFF` control data age limits (default: 5 years)

## Testing Strategy

- Frontend: Jest with jsdom environment, coverage collection enabled
- Backend: Jest with controller/service/route testing
- Test files use `.test.js` suffix
- Frontend tests located alongside source files
- Backend tests in same directories as implementation

## Key Business Logic

### ASCVD Risk Calculation (`app/src/ascvd/`)
- `ASCVDRisk.js`: Core risk calculation algorithms
- `ASCVDValidator.js`: Input validation for patient data
- `PatientInfo.js`: Patient data processing and FHIR mapping

### FHIR Integration (`app/src/services/`)
- `RiskService.js`: Main service orchestrating FHIR data retrieval
- `AuditEventService.js`: Audit logging to backend API
- `DocumentReferenceService.js`: FHIR document creation
- `ErrorTranslator.js`: User-friendly error message handling

## Database Schema

Uses Sequelize ORM with SQLite. Single table:
- `auditevent`: Captures usage statistics when AUDITING enabled

Migration files in `server/migrations/` directory.