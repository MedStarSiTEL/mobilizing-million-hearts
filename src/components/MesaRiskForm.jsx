import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Heart, Calculator, BarChart3 } from "lucide-react";

export default function MesaRiskForm({ 
  formData, 
  updateFormData, 
  showResults, 
  riskResults,
  onCalculate, 
  onStartOver 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            MESA CHD Risk Calculator
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            10-Year Coronary Heart Disease Risk with Coronary Artery Calcification
          </p>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Calculator className="h-4 w-4 mr-2" />
            Medical Risk Assessment Tool
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2" />
                  Patient Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Please fill in all required fields to calculate the CHD risk score
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                
                {/* Demographics Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Demographics</h3>
                    <Separator className="flex-1" />
                  </div>
                  
                  {/* Gender */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">1</Badge>
                      Gender
                    </Label>
                    <RadioGroup 
                      value={formData.gender} 
                      onValueChange={(value) => updateFormData({gender: value})}
                      className="flex gap-8"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Age */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">2</Badge>
                      Age <span className="text-sm text-gray-500 font-normal">(45-85 years)</span>
                    </Label>
                    <div className="space-y-3">
                      <Slider
                        value={[formData.age]}
                        onValueChange={(value) => updateFormData({age: value[0]})}
                        max={85}
                        min={45}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">45 years</span>
                        <Badge variant="secondary" className="px-3 py-1">
                          {formData.age} years
                        </Badge>
                        <span className="text-sm text-gray-500">85 years</span>
                      </div>
                    </div>
                  </div>

                  {/* Coronary Artery Calcification */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">3</Badge>
                      Coronary Artery Calcification
                    </Label>
                    <div className="space-y-3">
                      <Slider
                        value={[formData.calcification]}
                        onValueChange={(value) => updateFormData({calcification: value[0]})}
                        max={2000}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">0</span>
                        <Badge variant="secondary" className="px-3 py-1">
                          {formData.calcification} Agatston
                        </Badge>
                        <span className="text-sm text-gray-500">2000+</span>
                      </div>
                    </div>
                  </div>

                  {/* Race/Ethnicity */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">4</Badge>
                      Race/Ethnicity
                    </Label>
                    <Select value={formData.ethnicity} onValueChange={(value) => updateFormData({ethnicity: value})}>
                      <SelectTrigger className="w-64 h-11">
                        <SelectValue placeholder="Choose One" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Caucasian</SelectItem>
                        <SelectItem value="2">Chinese</SelectItem>
                        <SelectItem value="3">African American</SelectItem>
                        <SelectItem value="4">Hispanic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Medical History Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
                    <Separator className="flex-1" />
                  </div>

                  {/* Diabetes */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">5</Badge>
                      Diabetes
                    </Label>
                    <ToggleGroup className="justify-start w-fit">
                      <ToggleGroupItem 
                        value="yes" 
                        selected={formData.diabetes === "yes"}
                        onSelect={(value) => updateFormData({diabetes: value})}
                      >
                        Yes
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="no" 
                        selected={formData.diabetes === "no"}
                        onSelect={(value) => updateFormData({diabetes: value})}
                      >
                        No
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Currently Smoke */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">6</Badge>
                      Currently Smoke
                    </Label>
                    <ToggleGroup className="justify-start w-fit">
                      <ToggleGroupItem 
                        value="yes" 
                        selected={formData.smoking === "yes"}
                        onSelect={(value) => updateFormData({smoking: value})}
                      >
                        Yes
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="no" 
                        selected={formData.smoking === "no"}
                        onSelect={(value) => updateFormData({smoking: value})}
                      >
                        No
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Family History */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-base font-medium flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">7</Badge>
                        Family History of Heart Attack
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1 ml-8">
                        History in parents, siblings, or children
                      </p>
                    </div>
                    <ToggleGroup className="justify-start w-fit ml-8">
                      <ToggleGroupItem 
                        value="yes" 
                        selected={formData.familyHistory === "yes"}
                        onSelect={(value) => updateFormData({familyHistory: value})}
                      >
                        Yes
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="no" 
                        selected={formData.familyHistory === "no"}
                        onSelect={(value) => updateFormData({familyHistory: value})}
                      >
                        No
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>

                <Separator />

                {/* Laboratory Values Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Laboratory Values</h3>
                    <Separator className="flex-1" />
                  </div>

                  {/* Total Cholesterol */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">8</Badge>
                      Total Cholesterol
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700">mg/dL</div>
                        <Slider
                          value={[formData.totalCholesterol]}
                          onValueChange={(value) => updateFormData({
                            totalCholesterol: value[0], 
                            totalCholesterolMmol: Math.round((value[0] / 38.67) * 10) / 10
                          })}
                          max={400}
                          min={100}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">100</span>
                          <Badge variant="secondary" className="px-3 py-1">
                            {formData.totalCholesterol} mg/dL
                          </Badge>
                          <span className="text-sm text-gray-500">400</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700">mmol/L</div>
                        <Slider
                          value={[formData.totalCholesterolMmol]}
                          onValueChange={(value) => updateFormData({
                            totalCholesterolMmol: value[0], 
                            totalCholesterol: Math.round(value[0] * 38.67)
                          })}
                          max={10.3}
                          min={2.6}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">2.6</span>
                          <Badge variant="secondary" className="px-3 py-1">
                            {formData.totalCholesterolMmol} mmol/L
                          </Badge>
                          <span className="text-sm text-gray-500">10.3</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* HDL Cholesterol */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">9</Badge>
                      HDL Cholesterol
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700">mg/dL</div>
                        <Slider
                          value={[formData.hdlCholesterol]}
                          onValueChange={(value) => updateFormData({
                            hdlCholesterol: value[0], 
                            hdlCholesterolMmol: Math.round((value[0] / 38.67) * 10) / 10
                          })}
                          max={100}
                          min={20}
                          step={2}
                          className="w-full"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">20</span>
                          <Badge variant="secondary" className="px-3 py-1">
                            {formData.hdlCholesterol} mg/dL
                          </Badge>
                          <span className="text-sm text-gray-500">100</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700">mmol/L</div>
                        <Slider
                          value={[formData.hdlCholesterolMmol]}
                          onValueChange={(value) => updateFormData({
                            hdlCholesterolMmol: value[0], 
                            hdlCholesterol: Math.round(value[0] * 38.67)
                          })}
                          max={2.6}
                          min={0.5}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">0.5</span>
                          <Badge variant="secondary" className="px-3 py-1">
                            {formData.hdlCholesterolMmol} mmol/L
                          </Badge>
                          <span className="text-sm text-gray-500">2.6</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Systolic Blood Pressure */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">10</Badge>
                      Systolic Blood Pressure
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700">mmHg</div>
                        <Slider
                          value={[formData.systolicBP]}
                          onValueChange={(value) => updateFormData({
                            systolicBP: value[0], 
                            systolicBPKpa: Math.round((value[0] * 0.133) * 10) / 10
                          })}
                          max={200}
                          min={90}
                          step={2}
                          className="w-full"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">90</span>
                          <Badge variant="secondary" className="px-3 py-1">
                            {formData.systolicBP} mmHg
                          </Badge>
                          <span className="text-sm text-gray-500">200</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700">kPa</div>
                        <Slider
                          value={[formData.systolicBPKpa]}
                          onValueChange={(value) => updateFormData({
                            systolicBPKpa: value[0], 
                            systolicBP: Math.round(value[0] / 0.133)
                          })}
                          max={26.7}
                          min={12.0}
                          step={0.3}
                          className="w-full"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">12.0</span>
                          <Badge variant="secondary" className="px-3 py-1">
                            {formData.systolicBPKpa} kPa
                          </Badge>
                          <span className="text-sm text-gray-500">26.7</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Medications Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
                    <Separator className="flex-1" />
                  </div>

                  {/* Lipid Lowering Medication */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">11</Badge>
                      Lipid Lowering Medication
                    </Label>
                    <ToggleGroup className="justify-start w-fit">
                      <ToggleGroupItem 
                        value="yes" 
                        selected={formData.lipidMedication === "yes"}
                        onSelect={(value) => updateFormData({lipidMedication: value})}
                      >
                        Yes
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="no" 
                        selected={formData.lipidMedication === "no"}
                        onSelect={(value) => updateFormData({lipidMedication: value})}
                      >
                        No
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Hypertension Medication */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">12</Badge>
                      Hypertension Medication
                    </Label>
                    <ToggleGroup className="justify-start w-fit">
                      <ToggleGroupItem 
                        value="yes" 
                        selected={formData.hypertensionMedication === "yes"}
                        onSelect={(value) => updateFormData({hypertensionMedication: value})}
                      >
                        Yes
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="no" 
                        selected={formData.hypertensionMedication === "no"}
                        onSelect={(value) => updateFormData({hypertensionMedication: value})}
                      >
                        No
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>

                {/* Calculate Button */}
                <div className="flex justify-center pt-8">
                  <Button 
                    onClick={onCalculate}
                    size="lg"
                    className="px-12 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate 10-year CHD Risk
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Results Section */}
              {showResults && (
                <Card className="shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                    <CardTitle className="text-xl">Risk Assessment Results</CardTitle>
                    <CardDescription className="text-green-100">
                      Based on coronary artery calcium score
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">10-Year CHD Risk</div>
                        <div className="text-2xl font-bold text-green-600">
                          {riskResults ? `${riskResults.riskWithCAC}%` : '---'}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">Coronary Age</div>
                        <div className="text-xl font-semibold text-blue-600">
                          {riskResults ? `${riskResults.coronaryAge} years` : '--- years'}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">Age Difference</div>
                        <div className="text-xl font-semibold text-orange-600">
                          {riskResults ? (riskResults.ageDifference >= 0 ? `+${riskResults.ageDifference} years` : `${riskResults.ageDifference} years`) : '--- years'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {showResults && (
                <Card className="shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-t-lg">
                    <CardTitle className="text-xl">Without Calcium Score</CardTitle>
                    <CardDescription className="text-gray-100">
                      Traditional risk factors only
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">10-Year CHD Risk</div>
                        <div className="text-2xl font-bold text-gray-600">
                          {riskResults ? `${riskResults.riskWithoutCAC}%` : '---'}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">Coronary Age</div>
                        <div className="text-xl font-semibold text-blue-600">
                          {riskResults ? `${Math.round(formData.age + (riskResults.riskWithoutCAC - riskResults.riskWithCAC) / 2)} years` : '--- years'}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">Age Difference</div>
                        <div className="text-xl font-semibold text-orange-600">
                          {riskResults ? `+${Math.round((riskResults.riskWithoutCAC - riskResults.riskWithCAC) / 2)} years` : '--- years'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {showResults && (
                <div className="flex justify-center">
                  <Button 
                    onClick={onStartOver}
                    variant="outline" 
                    size="lg"
                    className="px-8 py-4 shadow-md"
                  >
                    Start Over
                  </Button>
                </div>
              )}

              {/* Info Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">About MESA Calculator</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>
                    The MESA risk calculator uses coronary artery calcium scoring to provide more accurate cardiovascular risk assessment.
                  </p>
                  <p>
                    This tool helps healthcare providers make informed decisions about preventive therapy and lifestyle interventions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}