# Package Upgrade Testing Instructions

This document outlines the testing process to verify the successful upgrade of dependencies in the Mobilizing Million Hearts application.

## Setup

1. Install all dependencies with the updated package.json:

```bash
cd app
npm install
```

## Testing Steps

### 1. Verify Build Process

```bash
npm run build
```

Ensure the build completes successfully with no errors.

### 2. Run Development Server

```bash
npm start
```

Verify the application launches correctly in development mode.

### 3. Test SMART on FHIR Integration

Since this is a SMART on FHIR application, you'll need to test the FHIR integration:

- Test the launch flow using your FHIR server
- Verify patient data is correctly loaded
- Check that FHIR resources are properly retrieved and displayed

### 4. Test Core Functionality

#### Risk Calculation

- Test ASCVD risk calculations for different patient scenarios
- Test MESA risk calculations for supported ethnic groups
- Verify risk cards display properly

#### Date Handling (Critical for date-fns Migration)

- Verify date display in patient information
- Check relative date displays (e.g., "1 year ago" format)
- Test timezone conversions for EST/EDT display

#### Form Interaction

- Test all sliders for proper function
- Verify button groups for demographic data
- Test numerical input fields (age, etc.)

### 5. Test Chart Display

- Verify charts render correctly
- Check tooltips and labels display properly
- Test responsiveness at different screen sizes

### 6. Verify ESLint Configuration

```bash
npm run lint
```

Ensure linting runs successfully with the downgraded ESLint version.

### 7. Run Tests

```bash
npm test
```

All tests should pass with the updated dependencies.

### 8. Browser Compatibility

Test the application in multiple browsers:
- Chrome (latest)
- Firefox (latest) 
- Safari (if available)

## Known Issues

- If chart.js adapters don't load properly, check browser console for errors related to date-fns adapter
- ESLint may show different warnings than before due to the version change
- Timezone handling might be slightly different between moment.js and date-fns

## Rollback Procedure

If issues are found:

1. Revert package.json changes:
```bash
git checkout -- app/package.json
```

2. Revert code changes:
```bash
git checkout -- app/src/services/RiskService.js
git checkout -- app/src/services/DocumentReferenceService.js
git checkout -- app/src/components/Educator/Educator.jsx
```

3. Reinstall dependencies:
```bash
npm install
```