# MESA CHD Risk Calculator Algorithm

This document outlines the algorithm used for calculating 10-year coronary heart disease (CHD) risk using the Multi-Ethnic Study of Atherosclerosis (MESA) risk calculator, which incorporates coronary artery calcium (CAC) scoring.

## Source

The MESA CHD Risk Calculator is based on the research published in:

**"Coronary artery calcium score and risk classification for coronary heart disease prediction"**
- **Authors**: McClelland RL, Jorgensen NW, Budoff M, et al.
- **Journal**: JAMA. 2010;303(16):1610-1616
- **DOI**: 10.1001/jama.2010.461
- **URL**: https://jamanetwork.com/journals/jama/fullarticle/185777

**Official Calculator**: https://www.mesa-nhlbi.org/CACReference.aspx

## Algorithm Overview

The MESA risk calculator provides two risk estimates:
1. **Traditional Risk** - Based on standard risk factors without CAC
2. **CAC-Enhanced Risk** - Incorporates coronary artery calcium score

## Input Variables

### Demographics
- **Age**: 45-85 years
- **Gender**: Male/Female
- **Race/Ethnicity**: 
  - Caucasian (1)
  - Chinese (2) 
  - African American (3)
  - Hispanic (4)

### Clinical Variables
- **Diabetes**: Yes/No
- **Current Smoking**: Yes/No
- **Family History of MI**: Yes/No (parents, siblings, or children)
- **Total Cholesterol**: mg/dL
- **HDL Cholesterol**: mg/dL
- **Systolic Blood Pressure**: mmHg
- **Lipid-Lowering Medication**: Yes/No
- **Hypertension Medication**: Yes/No

### Calcium Score
- **Coronary Artery Calcium (CAC)**: Agatston score (0-2000+)

## Mathematical Model

The MESA algorithm uses Cox proportional hazards regression models:

### Step 1: Calculate Traditional Risk (without CAC)

The baseline survival function and coefficients are race/gender specific:

**For White Men:**
- Baseline 10-year survival: 0.9665
- Age coefficient: 0.0302
- Total cholesterol coefficient: 0.0020
- HDL cholesterol coefficient: -0.0117
- Systolic BP coefficient: 0.0039
- Diabetes coefficient: 0.3909
- Smoking coefficient: 0.6065
- Family history coefficient: 0.4660
- Lipid medication coefficient: -0.1534
- BP medication coefficient: 0.1266

### Step 2: Calculate CAC-Enhanced Risk

The CAC score is incorporated through natural logarithm transformation:
- **CAC coefficient**: Varies by race/gender
- **CAC transformation**: ln(CAC + 1)

### Step 3: Risk Calculation Formula

```
Linear Predictor = Σ(βi × Xi) + βCAC × ln(CAC + 1)

10-year CHD Risk = 1 - S0^exp(Linear Predictor)
```

Where:
- βi = coefficient for variable i
- Xi = value of variable i
- S0 = baseline 10-year survival
- βCAC = CAC coefficient

### Step 4: Coronary Age Calculation

Coronary age represents the age of an average person with the same risk:
```
Coronary Age = Age + (Risk - Average_Risk_for_Age) / Risk_per_Year_of_Age
```

## MESA Risk Calculation Coefficients

The following coefficients are extracted from the official MESA study documentation and are used in the unified calculation model for all demographic groups.

### Unified Model Coefficients (All Demographics)

**Reference**: Lines 1179-1198 and 1213-1238 from MESA study documentation

#### With CAC (Coronary Artery Calcium)
- **Baseline 10-year survival**: 0.99833
- **Age coefficient**: 0.0172
- **Gender coefficient** (male=1, female=0): 0.4079
- **Chinese coefficient**: -0.3475
- **Black coefficient**: 0.0353
- **Hispanic coefficient**: -0.0222
- **Diabetes coefficient**: 0.3892
- **Smoking coefficient**: 0.3717
- **Total cholesterol coefficient**: 0.0043
- **HDL cholesterol coefficient**: -0.0114
- **Lipid medication coefficient**: 0.1206
- **Systolic BP coefficient**: 0.0066
- **Hypertension medication coefficient**: 0.2278
- **Family history coefficient**: 0.3239
- **CAC coefficient** (ln(CAC+1)): 0.2743

#### Without CAC (Traditional Risk Factors Only)
- **Baseline 10-year survival**: 0.99963
- **Age coefficient**: 0.0455
- **Gender coefficient** (male=1, female=0): 0.7496
- **Chinese coefficient**: -0.5055
- **Black coefficient**: -0.2111
- **Hispanic coefficient**: -0.1900
- **Diabetes coefficient**: 0.5168
- **Smoking coefficient**: 0.4732
- **Total cholesterol coefficient**: 0.0053
- **HDL cholesterol coefficient**: -0.0140
- **Lipid medication coefficient**: 0.2473
- **Systolic BP coefficient**: 0.0085
- **Hypertension medication coefficient**: 0.3381
- **Family history coefficient**: 0.4522

### Variable Encoding

#### Race/Ethnicity (Reference: White/Caucasian = 0)
- **Chinese**: chinese = 1, others = 0
- **Black/African American**: black = 1, others = 0  
- **Hispanic**: hisp = 1, others = 0
- **White/Caucasian**: All race variables = 0

#### Binary Variables (0 = No, 1 = Yes)
- **Gender**: female = 0, male = 1
- **Diabetes**: dm = 0 (no diabetes), dm = 1 (diabetes present)
- **Smoking**: smoke = 0 (non-smoker), smoke = 1 (current smoker)
- **Family History**: fhhx = 0 (no family history), fhhx = 1 (family history present)
- **Lipid Medication**: lipid1c = 0 (not taking), lipid1c = 1 (taking)
- **Hypertension Medication**: htnmed1c = 0 (not taking), htnmed1c = 1 (taking)

### Calculation Formulas

#### With CAC Score:
```
Linear Estimate = (0.0172 * age) + (0.4079 * gender) + (-0.3475 * chinese) + 
                  (0.0353 * black) + (-0.0222 * hispanic) + (0.3892 * diabetes) + 
                  (0.3717 * smoking) + (0.0043 * totalCholesterol) + 
                  (-0.0114 * hdlCholesterol) + (0.1206 * lipidMedication) + 
                  (0.0066 * systolicBP) + (0.2278 * hypertensionMedication) + 
                  (0.3239 * familyHistory) + (0.2743 * ln(CAC + 1))

10-Year CHD Risk (%) = [1 - (0.99833^exp(Linear Estimate))] * 100
```

#### Without CAC Score:
```
Linear Estimate = (0.0455 * age) + (0.7496 * gender) + (-0.5055 * chinese) + 
                  (-0.2111 * black) + (-0.1900 * hispanic) + (0.5168 * diabetes) + 
                  (0.4732 * smoking) + (0.0053 * totalCholesterol) + 
                  (-0.0140 * hdlCholesterol) + (0.2473 * lipidMedication) + 
                  (0.0085 * systolicBP) + (0.3381 * hypertensionMedication) + 
                  (0.4522 * familyHistory)

10-Year CHD Risk (%) = [1 - (0.99963^exp(Linear Estimate))] * 100
```

## Implementation Notes

1. **CAC Score Handling**: 
   - CAC = 0 is handled as ln(0 + 1) = ln(1) = 0
   - Maximum CAC typically capped at 2000+ for calculation purposes

2. **Cholesterol Units**:
   - Input in mg/dL
   - Convert from mmol/L: mg/dL = mmol/L × 38.67

3. **Blood Pressure Units**:
   - Input in mmHg
   - Convert from kPa: mmHg = kPa ÷ 0.133

4. **Missing Values**:
   - All required fields must be completed
   - No imputation for missing values

## Validation

The MESA risk calculator has been validated in multiple populations and shows improved risk prediction accuracy compared to traditional risk calculators when CAC scoring is available.

## Clinical Interpretation

- **Low Risk**: <5% 10-year CHD risk
- **Intermediate Risk**: 5-20% 10-year CHD risk  
- **High Risk**: >20% 10-year CHD risk

The incorporation of CAC scoring helps reclassify patients from intermediate risk categories into more appropriate risk stratification for clinical decision-making.