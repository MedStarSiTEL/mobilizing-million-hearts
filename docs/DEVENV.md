# Development Environment Setup

This guide explains how to set up and run the Mobilizing Million Hearts ASCVD Risk Calculator application in your development environment without connecting to a real FHIR server, using fake patient data.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **Yarn**
- **Git** - [Download here](https://git-scm.com/)

You can verify your installations by running:
```bash
node --version   # Should be 18.x or higher
npm --version    # Should be 8.x or higher
git --version    # Any recent version
```

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mobilizing-million-hearts/app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all the required packages including React, Bootstrap, Chart.js, FHIR client, and testing dependencies.

### 3. Configure Environment Variables

The application uses environment variables for configuration. For development with fake data, you can use the provided `.env` file:

```bash
# The .env file should already exist with these settings:
CLIENT_ID=test-client-id
SCOPE=patient/Patient.read patient/Observation.read patient/MedicationStatement.read patient/Condition.read
ISS=https://test-server/
REDIRECT_URI=http://localhost:3000/

# Enable developer features
ENABLE_DEVELOPERS_LOG=true
AUDITING=false

# Data cutoff periods (in years)
BLOODPRESSURE_CUTOFF=5
CHOLESTEROL_CUTOFF=5
```

**Important**: These are test values and will enable the application to run with fake patient data instead of connecting to a real FHIR server.

### 4. Enable Developer Mode

The application has a developer mode that allows you to work with fake patient data. This is controlled by the `ENABLE_DEVELOPERS_LOG=true` setting in your `.env` file.

When developer mode is enabled:
- The app uses mock patient data from the `__fixtures__` directory
- No real FHIR server connection is required
- You can access a developer log interface
- Fake patient information is automatically loaded

### 5. Start the Development Server

```bash
npm start
```

Or alternatively:
```bash
npm run dev
```

This will:
- Start the Vite development server
- Open your browser automatically to `http://localhost:3000`
- Enable hot module replacement (HMR) for instant updates
- Enable source maps for debugging

### 6. Access the Application

Once the server starts, you can access:

- **Main Application**: http://localhost:3000
- **ASCVD Risk Estimator**: The default landing page
- **MESA Calculator**: Click "MESA Calculator" button
- **Patient Risk Education Tool**: Click "Patient Risk Education Tool" button

## Working with Fake Patient Data

### Default Test Patient

The application comes with pre-configured test patient data in the `__fixtures__` directory:

**Patient Details:**
- **Name**: ZZZTESTONC, HEART
- **DOB**: January 5, 1954 (Age: ~70)
- **Gender**: Male (configurable)
- **Race**: African American (configurable)
- **Status**: Active

**Sample Health Data:**
- Blood pressure readings
- Cholesterol levels (Total, HDL, LDL)
- Medical conditions
- Medication statements
- Risk factors (diabetes, smoking status, etc.)

### Customizing Test Data

You can modify the fake patient data by editing files in the `__fixtures__` directory:

- `patient.js` - Patient demographic information
- `observation.js` - Vital signs and lab results
- `condition.js` - Medical conditions
- `medicationstatement.js` - Current medications
- `bundle.js` - FHIR bundle structure

Example of modifying patient demographics:
```javascript
// In __fixtures__/patient.js
const customPatient = patientFixture({ 
  race: [{ url: 'ombCategory', valueCoding: { code: '2106-3', display: 'White' } }],
  gender: 'female',
  birthDate: '1965-03-15'
});
```

### Testing Different Scenarios

You can test various ASCVD risk scenarios by modifying the observation data:

```javascript
// High risk scenario
const highRiskData = {
  age: 65,
  totalCholesterol: 280,
  hdlCholesterol: 35,
  systolicBloodPressure: 160,
  diabetic: true,
  smoker: true
};

// Low risk scenario  
const lowRiskData = {
  age: 45,
  totalCholesterol: 180,
  hdlCholesterol: 55,
  systolicBloodPressure: 120,
  diabetic: false,
  smoker: false
};
```

## Available Development Scripts

- `npm start` / `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run preview` - Preview production build locally
- `npm test` - Run test suite
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint code analysis
- `npm run prettier` - Format code with Prettier

## Developer Features

When `ENABLE_DEVELOPERS_LOG=true` is set, you get access to:

### Developer Log Interface
Access the developer log by adding `?page=developerLog` to the URL:
```
http://localhost:3000/?page=developerLog
```

### Features Available:
- View application logs and debug information
- Monitor FHIR client interactions
- Track risk calculation steps
- Inspect patient data processing
- View audit events (if enabled)

## Debugging Tips

### Browser Developer Tools
- Open Chrome/Firefox Developer Tools (F12)
- Use the Console tab to see application logs
- Use the Network tab to monitor API calls
- Use the React Developer Tools extension for component inspection

### Common Issues and Solutions

**Issue**: Application won't start
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

**Issue**: Environment variables not loading
- Ensure `.env` file exists in the `/app` directory
- Restart the development server after changing `.env`
- Check that variable names match exactly (case-sensitive)

**Issue**: Fake data not appearing
- Verify `ENABLE_DEVELOPERS_LOG=true` in `.env`
- Check browser console for errors
- Ensure fixture files are properly formatted JSON/JavaScript

### Hot Reload
The development server supports hot module replacement:
- Changes to React components update instantly
- CSS changes apply immediately
- Configuration changes may require a server restart

## Testing Your Changes

### Run the Test Suite
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Test Categories
- **Unit Tests**: Component logic and utilities
- **Integration Tests**: Component interactions
- **ASCVD Risk Tests**: Risk calculation accuracy
- **MESA Risk Tests**: MESA algorithm validation

## Production Build

To create a production build:

```bash
npm run build
```

This creates optimized files in the `build/` directory:
- Minified JavaScript and CSS
- Optimized assets
- Source maps (if enabled)
- Vendor code splitting for better caching

Preview the production build:
```bash
npm run preview
```

## Next Steps

Once you have the development environment running:

1. **Explore the Application**: Try different patient scenarios
2. **Modify Test Data**: Create your own patient fixtures
3. **Run Tests**: Ensure your changes don't break existing functionality  
4. **Check Documentation**: Review other docs for architecture details
5. **Contribute**: Follow the CONTRIBUTING.md guidelines for pull requests

## Need Help?

- Check the main [README.md](../README.md) for general information
- Review [CONFIGURATION.md](./CONFIGURATION.md) for advanced settings
- Look at existing tests for usage examples
- Check the browser console for error messages

## Security Notes

- Never commit real patient data to the repository
- The `.env` file contains test values only
- For production deployment, use proper environment variable management
- Ensure HIPAA compliance when working with real healthcare data

---

**Happy Coding!** =€

The application should now be running at http://localhost:3000 with fake patient data, ready for development and testing.