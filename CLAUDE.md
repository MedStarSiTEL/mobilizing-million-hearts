# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint with React-specific rules
- `npm run preview` - Preview production build
- `npx shadcn@latest add [component]` - Add new ShadCN UI components

## Testing Commands

- `npm test` - Run tests in watch mode
- `npm run test:run` - Run all tests once
- `npm run test:ui` - Run tests with UI interface
- `npm run test:watch` - Run tests in watch mode (alias for `npm test`)

## Project Architecture

This is a React-based MESA risk calculator application called "mesa-risk".

### MESA Risk Calculation Algorithm

For detailed information about the MESA CHD risk calculation algorithm, mathematical formulas, and clinical implementation, see [`MESA-CALCULATOR.md`](./MESA-CALCULATOR.md). This document contains the complete algorithm specification based on the Multi-Ethnic Study of Atherosclerosis research.

### Core Architecture

- **Frontend Framework**: React 19 with Vite build tool
- **UI Components**: ShadCN UI with "New York" style and neutral color theme
- **Styling**: Tailwind CSS 4.0 with custom `furia.css` (includes ShadCN theme variables)
- **Base Path**: Application serves from `/mesa-risk` route
- **Port**: Development server runs on port 3001

### Key Services

1. **HTTP Service** (`src/services/http.js`)
   - Axios-based HTTP client with interceptors
   - Handles 401/403 responses with logout callbacks
   - Network error handling with "ERR_NETWORK" detection
   - JWT token management via `x-auth-token` header
   - Includes `fastApiWrapper` for API response validation
   - `responsePromiseChainHandler` for promise chain management

2. **Logging Service** (`src/services/log.js`)
   - Configurable log levels (DEBUG, INFO, WARNING, ERROR, FATAL)
   - Multiple handlers (CONSOLE, with planned TALIS support)
   - Uses localStorage for debug mode and level configuration
   - Emergency debug mode with UUID key: `cef8d978-169e-4759-bddf-18b06007f11e`

### Configuration

- Environment variables loaded via `src/utilities/config.js` from Vite env vars:
  - `VITE_APP_LOG_HANDLER` - Sets logging handler (CONSOLE)
  - `VITE_APP_LOG_LEVEL` - Sets minimum log level (0-4)
  - `VITE_APP_AUTH_TOKEN_NAME` - Auth token identifier
- Development environment file: `developer.env` with default settings

### ShadCN UI Integration

- **Components Location**: `src/components/ui/` - All ShadCN UI components
- **Utility Functions**: `src/lib/utils.js` - Contains `cn()` function for class merging
- **Configuration**: `components.json` - ShadCN configuration with aliases and settings
- **Import Aliases**: `@/` prefix for clean imports (configured in `jsconfig.json` and `vite.config.js`)
- **Icon Library**: Lucide React for consistent iconography
- **Theme**: CSS variables in `furia.css` for light/dark mode support

### Build Configuration

- Vite config exposes `__APP_VERSION__` and `__APP_NAME__` globally
- Path aliases configured: `@/` maps to `./src/`
- Tailwind configured for all JS/JSX/TS/TSX files in src/
- ESLint setup with React hooks and refresh plugins
- ShadCN components use Radix UI primitives with Tailwind styling

## Query Parameter Support

The MESA Risk Calculator supports URL query parameters to pre-populate form fields. This allows for bookmarking, sharing, and automated testing of specific scenarios.

### Supported Parameters

#### Demographics
- `gender` or `sex` - Gender (`male`/`m` or `female`/`f`)
- `age` - Age in years (45-85)
- `race` or `ethnicity` - Race/ethnicity (`caucasian`/`white`/`1`, `chinese`/`2`, `african american`/`black`/`aa`/`3`, `hispanic`/`latino`/`4`)

#### Medical History (Yes/No fields)
- `diabetes` - Has diabetes (`yes`/`y`/`true`/`1` or `no`/`n`/`false`/`0`)
- `smoking` or `smoke` - Currently smoking
- `familyHistory`, `family`, or `fh` - Family history of heart attack

#### Laboratory Values
- `calcification`, `calc`, or `cac` - Coronary artery calcification score (0-2000)
- `totalCholesterol`, `tchol`, or `tc` - Total cholesterol in mg/dL (100-400)
- `hdlCholesterol` or `hdl` - HDL cholesterol in mg/dL (20-100)
- `systolicBP`, `sbp`, or `bp` - Systolic blood pressure in mmHg (90-200)

#### Medications (Yes/No fields)
- `lipidMedication`, `lipid`, or `statin` - Taking lipid-lowering medication
- `hypertensionMedication`, `htn`, or `bp` - Taking hypertension medication

### Example URLs

- Basic: `?age=57&sex=m`
- Comprehensive: `?gender=male&age=70&calcification=500&race=caucasian&diabetes=yes&smoking=no&totalCholesterol=250&hdl=40&systolicBP=140`
- Alternative names: `?sex=f&calc=200&fh=yes&statin=no&htn=yes`

See `test-urls.md` for extensive examples.

### Testing

The query parameter functionality includes comprehensive tests:
- **Integration tests**: `src/test/queryParams-integration.test.jsx` - Tests overall functionality
- **Test scenarios**: `test-urls.md` - Manual testing scenarios with sample URLs
- Run tests with `npm run test:run`
