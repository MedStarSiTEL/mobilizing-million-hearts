# MESA Risk Calculator - Test Patient Scenarios

This file contains comprehensive test patient scenarios for the MESA risk calculator application. Each URL represents a realistic patient profile designed to test specific aspects of the risk assessment.

## Base URL
`http://localhost:3001/mesa-risk`

---

## Patient Test Scenarios

### 1. **Young Low-Risk Female** - Minimal Risk Profile
```
http://localhost:3001/mesa-risk?gender=female&age=45&calcification=0&race=caucasian&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=160&hdl=65&systolicBP=105&lipidMedication=no&hypertensionMedication=no
```
*Expected: Very low risk score*

### 2. **Elderly High-Risk Male** - Maximum Risk Factors
```
http://localhost:3001/mesa-risk?gender=male&age=84&calcification=1500&race=caucasian&diabetes=yes&smoking=yes&familyHistory=yes&totalCholesterol=320&hdl=28&systolicBP=180&lipidMedication=no&hypertensionMedication=no
```
*Expected: Very high risk score*

### 3. **Middle-Aged Diabetic Hispanic Female** - Diabetes Focus
```
http://localhost:3001/mesa-risk?gender=female&age=58&calcification=150&race=hispanic&diabetes=yes&smoking=no&familyHistory=yes&totalCholesterol=235&hdl=42&systolicBP=145&lipidMedication=yes&hypertensionMedication=yes
```
*Expected: Elevated risk due to diabetes*

### 4. **African American Male Smoker** - Smoking Impact
```
http://localhost:3001/mesa-risk?gender=male&age=52&calcification=220&race=african%20american&diabetes=no&smoking=yes&familyHistory=no&totalCholesterol=198&hdl=38&systolicBP=138&lipidMedication=no&hypertensionMedication=no
```
*Expected: Increased risk from smoking*

### 5. **Chinese Female with High CAC** - CAC Impact Testing
```
http://localhost:3001/mesa-risk?gender=female&age=66&calcification=800&race=chinese&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=190&hdl=55&systolicBP=125&lipidMedication=no&hypertensionMedication=no
```
*Expected: High risk despite favorable traditional risk factors*

### 6. **Well-Controlled Hypertensive Patient** - Medication Effects
```
http://localhost:3001/mesa-risk?gender=male&age=61&calcification=75&race=caucasian&diabetes=no&smoking=no&familyHistory=yes&totalCholesterol=185&hdl=48&systolicBP=128&lipidMedication=yes&hypertensionMedication=yes
```
*Expected: Moderate risk with medication benefits*

### 7. **Family History Dominant** - Genetic Risk Focus
```
http://localhost:3001/mesa-risk?gender=female&age=49&calcification=25&race=caucasian&diabetes=no&smoking=no&familyHistory=yes&totalCholesterol=175&hdl=58&systolicBP=118&lipidMedication=no&hypertensionMedication=no
```
*Expected: Risk primarily from family history*

### 8. **Zero CAC with Traditional Risk Factors** - CAC Protective Effect
```
http://localhost:3001/mesa-risk?gender=male&age=68&calcification=0&race=caucasian&diabetes=yes&smoking=no&familyHistory=yes&totalCholesterol=245&hdl=35&systolicBP=155&lipidMedication=no&hypertensionMedication=yes
```
*Expected: Risk reduction due to zero CAC*

### 9. **Hispanic Male with Metabolic Syndrome** - Multiple Risk Factors
```
http://localhost:3001/mesa-risk?gender=male&age=55&calcification=180&race=hispanic&diabetes=yes&smoking=no&familyHistory=no&totalCholesterol=260&hdl=32&systolicBP=148&lipidMedication=yes&hypertensionMedication=yes
```
*Expected: High risk from multiple metabolic factors*

### 10. **Chinese Male - Ethnicity Coefficient Testing**
```
http://localhost:3001/mesa-risk?gender=male&age=63&calcification=120&race=chinese&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=205&hdl=45&systolicBP=135&lipidMedication=no&hypertensionMedication=no
```
*Expected: Lower risk due to Chinese ethnicity coefficient*

### 11. **African American Female with CAC** - Race and Gender Interaction
```
http://localhost:3001/mesa-risk?gender=female&age=59&calcification=300&race=african%20american&diabetes=no&smoking=no&familyHistory=yes&totalCholesterol=220&hdl=48&systolicBP=142&lipidMedication=no&hypertensionMedication=yes
```
*Expected: Moderate risk with race-specific calculation*

### 12. **Extreme Age - Minimum (45 years)**
```
http://localhost:3001/mesa-risk?gender=female&age=45&calcification=50&race=hispanic&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=180&hdl=52&systolicBP=115&lipidMedication=no&hypertensionMedication=no
```
*Expected: Low risk due to young age*

### 13. **Extreme Age - Maximum (85 years)**
```
http://localhost:3001/mesa-risk?gender=male&age=85&calcification=400&race=caucasian&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=200&hdl=50&systolicBP=140&lipidMedication=yes&hypertensionMedication=yes
```
*Expected: High risk primarily from advanced age*

### 14. **High HDL Protective Effect** - Cholesterol Profile Testing
```
http://localhost:3001/mesa-risk?gender=male&age=56&calcification=100&race=caucasian&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=220&hdl=75&systolicBP=130&lipidMedication=no&hypertensionMedication=no
```
*Expected: Risk reduction from high HDL*

### 15. **Low HDL Risk Enhancement** - Poor Cholesterol Profile
```
http://localhost:3001/mesa-risk?gender=female&age=64&calcification=160&race=hispanic&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=280&hdl=28&systolicBP=135&lipidMedication=no&hypertensionMedication=no
```
*Expected: Increased risk from low HDL*

### 16. **Borderline Hypertension** - Blood Pressure Threshold Testing
```
http://localhost:3001/mesa-risk?gender=male&age=60&calcification=90&race=african%20american&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=195&hdl=44&systolicBP=139&lipidMedication=no&hypertensionMedication=no
```
*Expected: Moderate risk from borderline BP*

### 17. **Former Smoker Profile** - Smoking Status Verification
```
http://localhost:3001/mesa-risk?gender=female&age=67&calcification=250&race=caucasian&diabetes=no&smoking=no&familyHistory=yes&totalCholesterol=210&hdl=46&systolicBP=144&lipidMedication=yes&hypertensionMedication=yes
```
*Expected: Risk assessment for non-current smoker*

### 18. **Statin User with High Cholesterol** - Medication Paradox
```
http://localhost:3001/mesa-risk?gender=male&age=71&calcification=320&race=caucasian&diabetes=yes&smoking=no&familyHistory=yes&totalCholesterol=165&hdl=41&systolicBP=138&lipidMedication=yes&hypertensionMedication=yes
```
*Expected: Reflects both medication use and underlying risk*

### 19. **Pre-Diabetic Profile** - Borderline Diabetes Risk
```
http://localhost:3001/mesa-risk?gender=female&age=53&calcification=85&race=hispanic&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=215&hdl=44&systolicBP=132&lipidMedication=no&hypertensionMedication=no
```
*Expected: Moderate risk without diabetes diagnosis*

### 20. **Optimal Profile with Mild CAC** - Excellent Traditional Factors
```
http://localhost:3001/mesa-risk?gender=male&age=50&calcification=45&race=caucasian&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=170&hdl=60&systolicBP=110&lipidMedication=no&hypertensionMedication=no
```
*Expected: Very low risk despite some CAC*

### 21. **High CAC, Low Traditional Risk** - CAC Dominance Test
```
http://localhost:3001/mesa-risk?gender=female&age=61&calcification=1200&race=caucasian&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=165&hdl=65&systolicBP=115&lipidMedication=no&hypertensionMedication=no
```
*Expected: High risk driven primarily by CAC*

### 22. **Mixed Ethnicity Edge Case** - Alternative Race Paramters
```
http://localhost:3001/mesa-risk?gender=male&age=58&calcification=140&race=1&diabetes=no&smoking=yes&familyHistory=yes&totalCholesterol=230&hdl=39&systolicBP=146&lipidMedication=no&hypertensionMedication=no
```
*Expected: Test numeric race code (1=Caucasian)*

### 23. **Multiple Medication User** - Polypharmacy Profile
```
http://localhost:3001/mesa-risk?gender=female&age=69&calcification=275&race=african%20american&diabetes=yes&smoking=no&familyHistory=yes&totalCholesterol=180&hdl=46&systolicBP=135&lipidMedication=yes&hypertensionMedication=yes
```
*Expected: Complex risk with multiple medications*

### 24. **Extreme Low Risk** - Best Case Scenario
```
http://localhost:3001/mesa-risk?gender=female&age=45&calcification=0&race=chinese&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=150&hdl=80&systolicBP=95&lipidMedication=no&hypertensionMedication=no
```
*Expected: Lowest possible risk score*

### 25. **Extreme High Risk** - Worst Case Scenario
```
http://localhost:3001/mesa-risk?gender=male&age=85&calcification=2000&race=caucasian&diabetes=yes&smoking=yes&familyHistory=yes&totalCholesterol=350&hdl=22&systolicBP=190&lipidMedication=no&hypertensionMedication=no
```
*Expected: Highest possible risk score*

---

## Parameter Validation Tests

### 26. **Alternative Parameter Names** - Short Form Testing
```
http://localhost:3001/mesa-risk?sex=m&age=65&calc=200&race=aa&smoke=y&fh=y&tc=240&hdl=40&sbp=150&statin=y&htn=y
```
*Expected: All short parameter names work correctly*

### 27. **Boolean Variations** - Different True/False Formats
```
http://localhost:3001/mesa-risk?gender=female&age=55&diabetes=true&smoking=false&familyHistory=1&lipidMedication=0
```
*Expected: All boolean formats parse correctly*

### 28. **Case Insensitive** - Mixed Case Parameters
```
http://localhost:3001/mesa-risk?Gender=MALE&Race=HISPANIC&Diabetes=YES&Smoking=NO
```
*Expected: Case insensitive parameter parsing*

---

## Risk Calculation Verification

Each test scenario should be verified against the MESA coefficients:

**With CAC Formula:**
```
Risk = 1 - (0.99833^exp(Linear Estimate)) × 100%
```

**Without CAC Formula:**
```
Risk = 1 - (0.99963^exp(Linear Estimate)) × 100%
```

Where Linear Estimate includes all coefficient multiplications as defined in MESA-CALCULATOR.md.

---

## Testing Instructions

1. **Start Development Server**: `npm run dev`
2. **Test Each Scenario**: Copy each URL and open in browser
3. **Verify Form Population**: Check that all parameters populate form fields correctly
4. **Calculate Risk**: Click "Calculate" and verify risk scores are reasonable
5. **Compare Results**: Test both CAC-enhanced and traditional risk calculations
6. **Edge Case Validation**: Ensure out-of-range values default appropriately
7. **Clinical Validation**: Verify risk scores align with clinical expectations

### Expected Risk Ranges
- **Very Low Risk**: <2%
- **Low Risk**: 2-5% 
- **Intermediate Risk**: 5-15%
- **High Risk**: 15-30%
- **Very High Risk**: >30%

---

## Clinical Scenarios for Manual Validation

These scenarios can be used to validate the calculator against clinical intuition:

- **Scenario 1-5**: Should show clear risk stratification across age groups
- **Scenario 6-10**: Should demonstrate medication and CAC score impacts  
- **Scenario 11-15**: Should show ethnic and gender differences
- **Scenario 16-20**: Should test threshold effects and edge cases
- **Scenario 21-25**: Should validate extreme values and parameter handling