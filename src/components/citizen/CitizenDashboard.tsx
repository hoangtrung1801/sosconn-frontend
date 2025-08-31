import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Shield,
  MapPin,
  List,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { DisasterMapCitizen } from "./DisasterMapCitizen";
import { AlertSystem } from "./AlertSystem";
import { EmergencyChecklist } from "./EmergencyChecklist";
import { EvacuationRoutes } from "./EvacuationRoutes";
import { EmergencyChatbot } from "./EmergencyChatbot";
import { SOSButton } from "./SOSButton";
import { CommunityReporting } from "./CommunityReporting";
import { RecoveryHub } from "./RecoveryHub";

type DisasterPhase = "before" | "during" | "after";

export default function CitizenDashboard() {
  const [currentPhase, setCurrentPhase] = useState<DisasterPhase>("before");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [emergencyLevel, setEmergencyLevel] = useState<
    "low" | "medium" | "high" | "critical"
  >("low");

  // Simulate emergency status
  const isEmergencyActive =
    emergencyLevel === "high" || emergencyLevel === "critical";
  const emergencyLocation = "Da Nang City";
  const emergencyType = "Severe Flooding";

  useEffect(() => {
    // Simulate phase changes based on emergency level
    if (emergencyLevel === "critical" || emergencyLevel === "high") {
      setCurrentPhase("during");
    } else if (emergencyLevel === "medium") {
      setCurrentPhase("after");
    } else {
      setCurrentPhase("before");
    }
  }, [emergencyLevel]);

  const getPhaseColor = (phase: DisasterPhase) => {
    switch (phase) {
      case "before":
        return "bg-blue-500";
      case "during":
        return "bg-red-500";
      case "after":
        return "bg-green-500";
    }
  };

  const getPhaseText = (phase: DisasterPhase) => {
    switch (phase) {
      case "before":
        return "Preparedness";
      case "during":
        return "Response";
      case "after":
        return "Recovery";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Emergency Alert Banner */}
      {isEmergencyActive && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600 text-white p-4 text-center font-medium"
        >
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            🚨 EMERGENCY ACTIVE: {emergencyType} in {emergencyLocation}
            <AlertTriangle className="h-5 w-5 animate-pulse" />
          </div>
        </motion.div>
      )}

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Emergency Dashboard
              </h1>
              <p className="text-gray-600">
                Current Phase: {getPhaseText(currentPhase)} • Stay prepared,
                stay safe
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`${getPhaseColor(currentPhase)} text-white`}>
                {getPhaseText(currentPhase).toUpperCase()}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant={emergencyLevel === "low" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEmergencyLevel("low")}
                >
                  Normal
                </Button>
                <Button
                  variant={emergencyLevel === "medium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEmergencyLevel("medium")}
                >
                  Recovery
                </Button>
                <Button
                  variant={emergencyLevel === "high" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEmergencyLevel("high")}
                >
                  Emergency
                </Button>
                <Button
                  variant={
                    emergencyLevel === "critical" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setEmergencyLevel("critical")}
                >
                  Critical
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className=""></div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white border border-gray-200 rounded-lg p-1">
              <TabsTrigger
                value="dashboard"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Map</span>
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="flex items-center space-x-2 data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger
                value="checklist"
                className="flex items-center space-x-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Checklist</span>
              </TabsTrigger>
              <TabsTrigger
                value="routes"
                className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Routes</span>
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex items-center space-x-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Help</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="min-h-96 space-y-6">
              <TabsContent value="dashboard" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DisasterMapCitizen
                    currentPhase={currentPhase}
                    emergencyLevel={emergencyLevel}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="alerts" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertSystem
                    currentPhase={currentPhase}
                    emergencyLevel={emergencyLevel}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="checklist" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmergencyChecklist
                    currentPhase={currentPhase}
                    emergencyLevel={emergencyLevel}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="routes" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <EvacuationRoutes
                    currentPhase={currentPhase}
                    emergencyLevel={emergencyLevel}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="chat" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmergencyChatbot
                    currentPhase={currentPhase}
                    emergencyLevel={emergencyLevel}
                  />
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Additional Components - Display directly on page */}
          <div className="mt-8 space-y-6">
            {/* SOS Button - Show during emergency */}
            {currentPhase === "during" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-lg border p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Emergency SOS
                  </h3>
                </div>
                <SOSButton />
              </motion.div>
            )}

            <div className="my-4">
              <CommunityReporting currentPhase={currentPhase} />
            </div>

            {/* Recovery Hub - Show after emergency */}
            {currentPhase === "after" && <RecoveryHub />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
