import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit3, FileCheck, Clock } from "lucide-react"
import eopApi from "@/lib/api/eop.api"
import type { EOPReport } from "@/types"

export default function EditReportPage() {
  const [report, setReport] = useState<EOPReport | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    // Get the report from sessionStorage (set by CreateEOPReport page)
    const storedReport = sessionStorage.getItem('currentEOPReport')
    if (storedReport) {
      const parsedReport = JSON.parse(storedReport) as EOPReport
      setReport(parsedReport)
      setEditedContent(parsedReport.content)
    }
  }, [])

  const handleSaveChanges = () => {
    if (report) {
      setReport(prev => prev ? { ...prev, content: editedContent } : null)
      alert("Changes saved locally. Click 'Confirm Report' to finalize.")
    }
  }

  const handleConfirmReport = async () => {
    if (!report) return

    setIsConfirming(true)
    
    try {
      await eopApi.confirmEOP({
        reportId: report.id,
        updatedContent: editedContent
      })

      // Store the final report and navigate to display page
      const finalReport = { ...report, content: editedContent, status: "confirmed" as const }
      sessionStorage.setItem('finalEOPReport', JSON.stringify(finalReport))
      sessionStorage.removeItem('currentEOPReport')
      
      window.location.href = `/eop/report?reportId=${report.id}`
    } catch (error) {
      console.error("Failed to confirm EOP:", error)
      alert("Failed to confirm EOP report. Please try again.")
    } finally {
      setIsConfirming(false)
    }
  }

  if (!report) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            No Report Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please generate an EOP report first.
          </p>
          <Button onClick={() => window.location.href = '/eop/create'}>
            Generate New Report
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Edit Emergency Operation Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review and modify your generated EOP report before final confirmation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Info Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Report Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {report.title}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Generated At</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(report.generatedAt).toLocaleString()}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge variant="secondary">
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Disaster Information</Label>
                <div className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{report.disasterInfo.disasterType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Severity:</span>
                    <span className="font-medium">{report.disasterInfo.severityLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Area:</span>
                    <span className="font-medium">{report.disasterInfo.affectedArea}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>

        {/* Editor Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Edit Report Content
              </CardTitle>
              <CardDescription>
                Modify the generated report content as needed. The report uses Markdown formatting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportContent">Report Content (Markdown)</Label>
                <Textarea
                  id="reportContent"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={25}
                  className="font-mono text-sm"
                  placeholder="Edit your EOP report content here..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSaveChanges}
                  variant="outline"
                >
                  Save Changes
                </Button>
                
                <Button 
                  onClick={handleConfirmReport}
                  disabled={isConfirming}
                  className="flex-1"
                >
                  {isConfirming ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Confirming Report...
                    </>
                  ) : (
                    "Confirm Report"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}