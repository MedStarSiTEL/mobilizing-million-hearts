# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint with React-specific rules
- `npm run preview` - Preview production build
- `npx shadcn@latest add [component]` - Add new ShadCN UI components

## Project Architecture

This is a React-based MESA risk calculator application called "mesa-risk".

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
