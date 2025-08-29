import { DisasterMap } from "@/components/disaster/disaster-map";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockFloodData } from "@/lib/mock-data/flood-data";
import { mockRainData } from "@/lib/mock-data/rain-data";
import { FileText, Zap, AlertTriangle, Clock } from "lucide-react";

export default function Homepage() {
  const handleGenerateEOP = () => {
    window.location.href = "/eop/create";
  };

  // Emergency status simulation
  const isEmergency = true;
  const emergencyLocation = "Da Nang City";
  const emergencyType = "Severe Flooding";
  const emergencyStartTime = new Date().toLocaleTimeString();

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Emergency Alert Banner */}
        {isEmergency && (
          <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950/20 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 animate-pulse" />
                  <div>
                    <CardTitle className="text-red-800 dark:text-red-200">
                      🚨 EMERGENCY ACTIVE
                    </CardTitle>
                    <CardDescription className="text-red-700 dark:text-red-300">
                      {emergencyType} in {emergencyLocation}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="destructive" className="animate-pulse">
                  LIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300 mb-3">
                <Clock className="h-4 w-4" />
                Emergency declared at {emergencyStartTime}
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-md mb-3">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  Immediate Action Required: Generate Emergency Operation Plan (EOP) for coordinated disaster response
                </p>
              </div>
              <Button
                onClick={handleGenerateEOP}
                className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium"
                size="lg"
              >
                <FileText className="h-4 w-4 mr-2" />
                🚨 Generate Emergency EOP for {emergencyLocation}
              </Button>
            </CardContent>
          </Card>
        )}

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            Emergency Response Dashboard
            {isEmergency && (
              <Badge variant="destructive" className="animate-pulse">
                EMERGENCY MODE
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time disaster monitoring and response system
            {isEmergency && (
              <span className="text-red-600 dark:text-red-400 font-medium">
                {" "}• Currently responding to active emergency in {emergencyLocation}
              </span>
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                AI Emergency Response
              </CardTitle>
              <CardDescription>
                Generate comprehensive Emergency Operation Plans using AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleGenerateEOP}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate EOP Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>
                Current emergency situation overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active Incidents
                </span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {mockFloodData.filter((d) => d.status === "active").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  People Affected
                </span>
                <span className="text-sm font-medium">
                  {mockFloodData
                    .reduce((sum, d) => sum + d.affectedPeople, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Area
                </span>
                <span className="text-sm font-medium">
                  {mockFloodData
                    .reduce((sum, d) => sum + d.affectedArea, 0)
                    .toFixed(1)}
                  km²
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Active Disasters Map
          </h2>
          <DisasterMap disasters={mockFloodData} rainStations={mockRainData} className="shadow-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Active Incidents
            </h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {mockFloodData.filter((d) => d.status === "active").length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              People Affected
            </h3>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {mockFloodData
                .reduce((sum, d) => sum + d.affectedPeople, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Total Area
            </h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {mockFloodData
                .reduce((sum, d) => sum + d.affectedArea, 0)
                .toFixed(1)}
              km²
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
