export const getDefaultFormData = () => ({
  gender: "",
  age: 65,
  calcification: 100,
  ethnicity: "",
  diabetes: "",
  smoking: "",
  familyHistory: "",
  totalCholesterol: 200,
  totalCholesterolMmol: 5.2,
  hdlCholesterol: 50,
  hdlCholesterolMmol: 1.3,
  systolicBP: 120,
  systolicBPKpa: 16,
  lipidMedication: "",
  hypertensionMedication: ""
});

export const parseQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const defaults = getDefaultFormData();
  const parsed = { ...defaults };

  // Parse gender (accept 'm'/'male' or 'f'/'female')
  const gender = urlParams.get('gender') || urlParams.get('sex');
  if (gender) {
    const g = gender.toLowerCase();
    if (g === 'm' || g === 'male') parsed.gender = 'male';
    else if (g === 'f' || g === 'female') parsed.gender = 'female';
  }

  // Parse age
  const age = urlParams.get('age');
  if (age) {
    const ageNum = parseInt(age);
    if (!isNaN(ageNum) && ageNum >= 45 && ageNum <= 85) {
      parsed.age = ageNum;
    }
  }

  // Parse calcification (accept 'calc', 'calcification', 'cac')
  const calc = urlParams.get('calcification') || urlParams.get('calc') || urlParams.get('cac');
  if (calc) {
    const calcNum = parseInt(calc);
    if (!isNaN(calcNum) && calcNum >= 0 && calcNum <= 2000) {
      parsed.calcification = calcNum;
    }
  }

  // Parse race/ethnicity
  const race = urlParams.get('race') || urlParams.get('ethnicity');
  if (race) {
    const r = race.toLowerCase();
    if (r === 'caucasian' || r === 'white' || r === '1') parsed.ethnicity = '1';
    else if (r === 'chinese' || r === '2') parsed.ethnicity = '2';
    else if (r === 'african american' || r === 'black' || r === 'aa' || r === '3') parsed.ethnicity = '3';
    else if (r === 'hispanic' || r === 'latino' || r === '4') parsed.ethnicity = '4';
  }

  // Parse yes/no fields
  const parseBooleanField = (param) => {
    const value = urlParams.get(param);
    if (value) {
      const v = value.toLowerCase();
      if (v === 'yes' || v === 'y' || v === 'true' || v === '1') return 'yes';
      if (v === 'no' || v === 'n' || v === 'false' || v === '0') return 'no';
    }
    return "";
  };

  parsed.diabetes = parseBooleanField('diabetes');
  parsed.smoking = parseBooleanField('smoking') || parseBooleanField('smoke');
  parsed.familyHistory = parseBooleanField('familyHistory') || parseBooleanField('family') || parseBooleanField('fh');
  parsed.lipidMedication = parseBooleanField('lipidMedication') || parseBooleanField('lipid') || parseBooleanField('statin');
  parsed.hypertensionMedication = parseBooleanField('hypertensionMedication') || parseBooleanField('htn') || parseBooleanField('bp');

  // Parse cholesterol values
  const totalChol = urlParams.get('totalCholesterol') || urlParams.get('tchol') || urlParams.get('tc');
  if (totalChol) {
    const tcNum = parseInt(totalChol);
    if (!isNaN(tcNum) && tcNum >= 100 && tcNum <= 400) {
      parsed.totalCholesterol = tcNum;
      parsed.totalCholesterolMmol = Math.round((tcNum / 38.67) * 10) / 10;
    }
  }

  const hdlChol = urlParams.get('hdlCholesterol') || urlParams.get('hdl');
  if (hdlChol) {
    const hdlNum = parseInt(hdlChol);
    if (!isNaN(hdlNum) && hdlNum >= 20 && hdlNum <= 100) {
      parsed.hdlCholesterol = hdlNum;
      parsed.hdlCholesterolMmol = Math.round((hdlNum / 38.67) * 10) / 10;
    }
  }

  // Parse systolic blood pressure
  const sbp = urlParams.get('systolicBP') || urlParams.get('sbp') || urlParams.get('bp');
  if (sbp) {
    const sbpNum = parseInt(sbp);
    if (!isNaN(sbpNum) && sbpNum >= 90 && sbpNum <= 200) {
      parsed.systolicBP = sbpNum;
      parsed.systolicBPKpa = Math.round((sbpNum * 0.133) * 10) / 10;
    }
  }

  return parsed;
};