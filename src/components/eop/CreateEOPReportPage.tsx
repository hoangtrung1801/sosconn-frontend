import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, AlertTriangle, FileText } from "lucide-react"
import eopApi from "@/lib/api/eop.api"
import type { CreateEOPRequest, DisasterType, DisasterSeverity } from "@/types"

export default function CreateEOPReportPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateEOPRequest>({
    dateFrom: "",
    dateTo: "",
    disasterType: "flood",
    affectedArea: "",
    severityLevel: "medium",
    additionalInfo: ""
  })

  const handleInputChange = (field: keyof CreateEOPRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.dateFrom || !formData.dateTo || !formData.affectedArea) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    
    try {
      const response = await eopApi.generateEOP(formData)
      
      // Store the report data temporarily in sessionStorage
      sessionStorage.setItem('currentEOPReport', JSON.stringify(response.report))
      
      // Navigate to edit report page
      window.location.href = `/eop/edit?reportId=${response.reportId}`
    } catch (error) {
      console.error("Failed to generate EOP:", error)
      alert("Failed to generate EOP report. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Generate Emergency Operation Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Provide disaster information to generate a comprehensive EOP report
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Disaster Information
          </CardTitle>
          <CardDescription>
            Fill in the details about the disaster event to generate your Emergency Operation Plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  From Date *
                </Label>
                <Input
                  id="dateFrom"
                  type="datetime-local"
                  value={formData.dateFrom}
                  onChange={(e) => handleInputChange("dateFrom", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  To Date *
                </Label>
                <Input
                  id="dateTo"
                  type="datetime-local"
                  value={formData.dateTo}
                  onChange={(e) => handleInputChange("dateTo", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Disaster Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Disaster Type *</Label>
              <RadioGroup
                value={formData.disasterType}
                onValueChange={(value) => handleInputChange("disasterType", value as DisasterType)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flood" id="flood" />
                  <Label htmlFor="flood">Flood</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="earthquake" id="earthquake" />
                  <Label htmlFor="earthquake">Earthquake</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fire" id="fire" />
                  <Label htmlFor="fire">Fire</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="storm" id="storm" />
                  <Label htmlFor="storm">Storm</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="landslide" id="landslide" />
                  <Label htmlFor="landslide">Landslide</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Affected Area */}
            <div className="space-y-2">
              <Label htmlFor="affectedArea" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Affected Area *
              </Label>
              <Input
                id="affectedArea"
                placeholder="e.g., District 1, Ho Chi Minh City"
                value={formData.affectedArea}
                onChange={(e) => handleInputChange("affectedArea", e.target.value)}
                required
              />
            </div>

            {/* Severity Level */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base font-medium">
                <AlertTriangle className="h-4 w-4" />
                Severity Level *
              </Label>
              <RadioGroup
                value={formData.severityLevel}
                onValueChange={(value) => handleInputChange("severityLevel", value as DisasterSeverity)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="critical" id="critical" />
                  <Label htmlFor="critical">Critical</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Any additional details about the disaster situation..."
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating EOP Report...
                  </>
                ) : (
                  "Generate EOP Report"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}