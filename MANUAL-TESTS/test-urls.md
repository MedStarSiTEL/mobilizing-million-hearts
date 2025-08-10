# MESA Risk Calculator - Test URL Combinations

This file contains various URL parameter combinations to test the MESA risk calculator application.

## Base URL
`http://localhost:3001/mesa-risk`

## Parameter Reference

### Gender
- `gender=male` or `sex=m` - Male
- `gender=female` or `sex=f` - Female

### Age
- `age=57` - Age 57 (range: 45-85)

### Coronary Artery Calcification
- `calcification=100` or `calc=100` or `cac=100` - Calcification score (range: 0-2000)

### Race/Ethnicity
- `race=caucasian` or `ethnicity=white` or `race=1` - Caucasian
- `race=chinese` or `race=2` - Chinese
- `race=african american` or `race=black` or `race=aa` or `race=3` - African American
- `race=hispanic` or `race=latino` or `race=4` - Hispanic

### Medical History (Yes/No fields)
- `diabetes=yes` or `diabetes=y` or `diabetes=1` - Has diabetes
- `smoking=no` or `smoke=n` or `smoking=0` - Does not smoke
- `familyHistory=yes` or `family=y` or `fh=1` - Has family history
- `lipidMedication=yes` or `lipid=y` or `statin=1` - On lipid medication
- `hypertensionMedication=no` or `htn=n` or `bp=0` - Not on hypertension medication

### Laboratory Values
- `totalCholesterol=250` or `tchol=250` or `tc=250` - Total cholesterol (range: 100-400 mg/dL)
- `hdlCholesterol=40` or `hdl=40` - HDL cholesterol (range: 20-100 mg/dL)
- `systolicBP=140` or `sbp=140` or `bp=140` - Systolic blood pressure (range: 90-200 mmHg)

---

## Test URL Combinations

### 1. Default (No Parameters)
```
http://localhost:3001/mesa-risk
```

### 2. Basic Single Parameter Tests
```
http://localhost:3001/mesa-risk?age=57
http://localhost:3001/mesa-risk?sex=m
http://localhost:3001/mesa-risk?gender=female
http://localhost:3001/mesa-risk?race=caucasian
```

### 3. Two Parameter Combinations
```
http://localhost:3001/mesa-risk?sex=m&age=42
http://localhost:3001/mesa-risk?gender=female&race=hispanic
http://localhost:3001/mesa-risk?age=65&diabetes=yes
http://localhost:3001/mesa-risk?smoking=no&familyHistory=yes
```

### 4. Comprehensive Test Cases

#### High Risk Male Patient
```
http://localhost:3001/mesa-risk?gender=male&age=70&calcification=500&race=caucasian&diabetes=yes&smoking=yes&familyHistory=yes&totalCholesterol=280&hdl=35&systolicBP=160&lipidMedication=no&hypertensionMedication=no
```

#### Low Risk Female Patient
```
http://localhost:3001/mesa-risk?gender=female&age=50&calcification=0&race=hispanic&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=180&hdl=60&systolicBP=110&lipidMedication=no&hypertensionMedication=no
```

#### Moderate Risk with Medications
```
http://localhost:3001/mesa-risk?sex=m&age=65&calc=200&race=aa&diabetes=no&smoke=no&family=yes&tc=220&hdl=45&bp=135&statin=yes&htn=yes
```

#### Edge Case - Minimum Values
```
http://localhost:3001/mesa-risk?age=45&calcification=0&totalCholesterol=100&hdl=20&systolicBP=90
```

#### Edge Case - Maximum Values
```
http://localhost:3001/mesa-risk?age=85&calcification=2000&totalCholesterol=400&hdl=100&systolicBP=200
```

### 5. Alternative Parameter Name Tests
```
http://localhost:3001/mesa-risk?sex=f&calc=150&race=chinese
http://localhost:3001/mesa-risk?ethnicity=black&smoke=y&fh=n
http://localhost:3001/mesa-risk?tchol=250&hdl=50&sbp=130
http://localhost:3001/mesa-risk?lipid=1&bp=0&cac=300
```

### 6. Boolean Value Variations
```
http://localhost:3001/mesa-risk?diabetes=true&smoking=false
http://localhost:3001/mesa-risk?familyHistory=1&lipidMedication=0
http://localhost:3001/mesa-risk?diabetes=y&smoking=n&family=yes
```

### 7. Mixed Case Tests
```
http://localhost:3001/mesa-risk?gender=Male&race=CAUCASIAN
http://localhost:3001/mesa-risk?sex=F&ethnicity=Hispanic
http://localhost:3001/mesa-risk?diabetes=YES&smoking=NO
```

### 8. Invalid/Out of Range Values (Should Fall Back to Defaults)
```
http://localhost:3001/mesa-risk?age=30&calcification=3000&totalCholesterol=50
http://localhost:3001/mesa-risk?gender=other&race=unknown&diabetes=maybe
```

### 9. Realistic Clinical Scenarios

#### Scenario A: 57-year-old male with moderate risk
```
http://localhost:3001/mesa-risk?gender=male&age=57&calcification=150&race=caucasian&diabetes=no&smoking=no&familyHistory=yes&totalCholesterol=210&hdl=45&systolicBP=135&lipidMedication=no&hypertensionMedication=yes
```

#### Scenario B: 62-year-old female with diabetes
```
http://localhost:3001/mesa-risk?sex=f&age=62&calc=75&race=hispanic&diabetes=yes&smoke=no&fh=no&tc=240&hdl=50&bp=145&statin=yes&htn=yes
```

#### Scenario C: 48-year-old African American male smoker
```
http://localhost:3001/mesa-risk?gender=male&age=48&calcification=200&race=african%20american&diabetes=no&smoking=yes&familyHistory=yes&totalCholesterol=195&hdl=40&systolicBP=140&lipidMedication=no&hypertensionMedication=no
```

#### Scenario D: 72-year-old Chinese female
```
http://localhost:3001/mesa-risk?sex=f&age=72&cac=350&race=chinese&diabetes=yes&smoke=no&family=no&tchol=260&hdl=55&sbp=150&lipid=yes&htn=yes
```

### 10. URL Encoding Test
```
http://localhost:3001/mesa-risk?race=african%20american&familyHistory=yes&totalCholesterol=200
```

---

## Testing Instructions

1. Start the development server: `npm run dev`
2. Open each URL in your browser
3. Verify that the form fields are populated with the correct values from the URL parameters
4. Test edge cases and invalid values to ensure they fall back to defaults
5. Verify that both short and long parameter names work correctly
6. Check that boolean values accept various formats (yes/no, y/n, true/false, 1/0)