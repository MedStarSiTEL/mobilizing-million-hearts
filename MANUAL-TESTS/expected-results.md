# MESA Risk Calculator - Expected Test Results

This file contains the expected results for our test patient scenarios to validate the implementation.

## Test Patient 1: Young Low-Risk Female
**URL**: `http://localhost:3001/mesa-risk?gender=female&age=45&calcification=0&race=caucasian&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=160&hdl=65&systolicBP=105&lipidMedication=no&hypertensionMedication=no`

### Manual Calculation:
**Variables**:
- age=45, gender=0 (female), chinese=0, black=0, hispanic=0
- diabetes=0, smoking=0, familyHistory=0
- totalCholesterol=160, hdlCholesterol=65, systolicBP=105
- lipidMedication=0, hypertensionMedication=0, calcification=0

**With CAC Linear Estimate**:
- (0.0172 × 45) + (0.4079 × 0) + (-0.3475 × 0) + (0.0353 × 0) + (-0.0222 × 0) + (0.3892 × 0) + (0.3717 × 0) + (0.0043 × 160) + (-0.0114 × 65) + (0.1206 × 0) + (0.0066 × 105) + (0.2278 × 0) + (0.3239 × 0) + (0.2743 × ln(1))
- = 0.774 + 0 + 0 + 0 + 0 + 0 + 0 + 0.688 + (-0.741) + 0 + 0.693 + 0 + 0 + 0
- = **1.414**

**With CAC Risk**:
- Risk = [1 - (0.99833^exp(1.414))] × 100
- Risk = [1 - (0.99833^4.112)] × 100
- Risk = [1 - 0.9314] × 100
- = **6.86%**

**Without CAC Linear Estimate**:
- (0.0455 × 45) + (0.7496 × 0) + (-0.5055 × 0) + (-0.2111 × 0) + (-0.1900 × 0) + (0.5168 × 0) + (0.4732 × 0) + (0.0053 × 160) + (-0.0140 × 65) + (0.2473 × 0) + (0.0085 × 105) + (0.3381 × 0) + (0.4522 × 0)
- = 2.0475 + 0 + 0 + 0 + 0 + 0 + 0 + 0.848 + (-0.91) + 0 + 0.8925 + 0 + 0
- = **2.878**

**Without CAC Risk**:
- Risk = [1 - (0.99963^exp(2.878))] × 100
- Risk = [1 - (0.99963^17.78)] × 100
- Risk = [1 - 0.8345] × 100
- = **16.55%**

### **Expected Results**:
- **10-Year CHD Risk (with CAC)**: **6.9%**
- **10-Year CHD Risk (without CAC)**: **16.6%** 
- **Coronary Age**: **~35-40 years** (younger than chronological age)
- **Age Difference**: **-5 to -10 years** (protective)

---

## Test Patient 2: Elderly High-Risk Male
**URL**: `http://localhost:3001/mesa-risk?gender=male&age=84&calcification=1500&race=caucasian&diabetes=yes&smoking=yes&familyHistory=yes&totalCholesterol=320&hdl=28&systolicBP=180&lipidMedication=no&hypertensionMedication=no`

### **Expected Results**:
- **10-Year CHD Risk (with CAC)**: **>40%**
- **10-Year CHD Risk (without CAC)**: **>30%**
- **Coronary Age**: **>90 years**
- **Age Difference**: **+5 to +15 years**

---

## Test Patient 3: Chinese Male - Ethnicity Testing
**URL**: `http://localhost:3001/mesa-risk?gender=male&age=63&calcification=120&race=chinese&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=205&hdl=45&systolicBP=135&lipidMedication=no&hypertensionMedication=no`

### Manual Calculation:
**Variables**: age=63, gender=1, chinese=1, other races=0, all risk factors moderate

**With CAC Linear Estimate**:
- Key components: (0.0172 × 63) + (0.4079 × 1) + (-0.3475 × 1) + ... + (0.2743 × ln(121))
- Chinese coefficient -0.3475 should reduce risk
- = **Lower estimate due to ethnicity**

### **Expected Results**:
- **10-Year CHD Risk (with CAC)**: **8-12%** (lower due to Chinese ethnicity)
- **10-Year CHD Risk (without CAC)**: **12-18%**
- **Coronary Age**: **60-68 years** (similar to chronological age)

---

## Test Patient 4: Zero CAC with Traditional Risk Factors
**URL**: `http://localhost:3001/mesa-risk?gender=male&age=68&calcification=0&race=caucasian&diabetes=yes&smoking=no&familyHistory=yes&totalCholesterol=245&hdl=35&systolicBP=155&lipidMedication=no&hypertensionMedication=yes`

### **Expected Results**:
- **10-Year CHD Risk (with CAC)**: **15-20%** (CAC=0 provides protection)
- **10-Year CHD Risk (without CAC)**: **25-35%** (high due to traditional factors)
- **Coronary Age**: **65-72 years** (CAC protection effect)
- **Age Difference**: **0 to +5 years**

---

## Validation Criteria

### ✅ **Correct Implementation Indicators**:
1. **CAC=0 provides risk reduction** vs traditional factors
2. **Chinese ethnicity coefficient** (-0.3475) reduces risk
3. **Female gender** shows lower baseline risk
4. **Age progression** shows reasonable risk increase
5. **Risk ranges** are clinically reasonable (0-50%)
6. **Coronary age** correlates with risk level

### ❌ **Incorrect Implementation Indicators**:
1. Static hardcoded values (12.5%, 72 years)
2. Risk doesn't change with different inputs
3. Unreasonable risk values (>100% or negative)
4. Coronary age older than actual age for optimal patients
5. CAC=0 doesn't provide protective effect

---

## Testing Instructions

1. **Start the application**: `npm run dev`
2. **Test each URL** in the browser
3. **Compare actual results** with expected ranges above
4. **Verify calculation logic** responds to parameter changes
5. **Check edge cases** (min/max ages, CAC scores)

### **Key Test Cases to Validate**:
- Patient 1: Should show **low risk** (~7%) with **younger coronary age**
- Patient 2: Should show **very high risk** (>40%) with **older coronary age**  
- Patient 3: Should show **ethnicity benefit** (lower risk than equivalent Caucasian)
- Patient 4: Should show **CAC protective effect** (lower risk with CAC=0)

If any of these patterns don't appear, the implementation needs further debugging.