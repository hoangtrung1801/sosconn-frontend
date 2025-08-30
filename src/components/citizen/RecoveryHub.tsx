import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  FileText,
  DollarSign,
  Users,
  Camera,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface RecoveryResource {
  id: string;
  name: string;
  type: "financial" | "medical" | "shelter" | "food" | "counseling";
  location: string;
  availability: "available" | "limited" | "full";
  description: string;
  contact: string;
}

interface RecoveryStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export const RecoveryHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"resources" | "steps" | "support">(
    "resources"
  );

  const [recoverySteps, setRecoverySteps] = useState<RecoveryStep[]>([
    {
      id: "1",
      title: "Safety Assessment",
      description: "Check for injuries and ensure immediate safety",
      completed: true,
      priority: "high",
    },
    {
      id: "2",
      title: "Damage Documentation",
      description: "Take photos and document all property damage",
      completed: false,
      priority: "high",
    },
    {
      id: "3",
      title: "Insurance Contact",
      description: "Contact your insurance company to start claims process",
      completed: false,
      priority: "high",
    },
    {
      id: "4",
      title: "Family Check-in",
      description: "Contact all family members and confirm safety",
      completed: true,
      priority: "medium",
    },
    {
      id: "5",
      title: "Utility Assessment",
      description: "Check water, electricity, and gas safety",
      completed: false,
      priority: "medium",
    },
  ]);

  const recoveryResources: RecoveryResource[] = [
    {
      id: "1",
      name: "Emergency Financial Aid",
      type: "financial",
      location: "City Hall - District 1",
      availability: "available",
      description: "Immediate financial assistance for disaster victims",
      contact: "0236-123-4567",
    },
    {
      id: "2",
      name: "Medical Support Center",
      type: "medical",
      location: "Da Nang General Hospital",
      availability: "available",
      description: "Free medical checkups and trauma counseling",
      contact: "0236-234-5678",
    },
    {
      id: "3",
      name: "Temporary Housing",
      type: "shelter",
      location: "Community Centers",
      availability: "limited",
      description: "Temporary accommodation for displaced families",
      contact: "0236-345-6789",
    },
    {
      id: "4",
      name: "Food Distribution",
      type: "food",
      location: "Various Points",
      availability: "available",
      description: "Free meals and essential supplies",
      contact: "0236-456-7890",
    },
    {
      id: "5",
      name: "Psychological Support",
      type: "counseling",
      location: "Mental Health Center",
      availability: "available",
      description: "Professional counseling for disaster trauma",
      contact: "0236-567-8901",
    },
  ];

  const toggleStep = (stepId: string) => {
    setRecoverySteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const completedSteps = recoverySteps.filter((step) => step.completed).length;
  const totalSteps = recoverySteps.length;
  const completionPercentage = (completedSteps / totalSteps) * 100;

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "financial":
        return <DollarSign className="h-4 w-4" />;
      case "medical":
        return <Heart className="h-4 w-4" />;
      case "shelter":
        return <MapPin className="h-4 w-4" />;
      case "food":
        return <Users className="h-4 w-4" />;
      case "counseling":
        return <Heart className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-500 text-white";
      case "limited":
        return "bg-yellow-500 text-white";
      case "full":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-green-600" />
          Recovery Support
        </CardTitle>
        <CardDescription>
          Resources and guidance for post-disaster recovery
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Overview */}
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Recovery Progress</span>
            <span className="text-sm font-bold text-green-600">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <Progress value={completionPercentage} className="w-full mb-2" />
          <p className="text-xs text-gray-600">
            {completedSteps} of {totalSteps} steps completed
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === "resources" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </Button>
          <Button
            variant={activeTab === "steps" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("steps")}
          >
            Steps
          </Button>
          <Button
            variant={activeTab === "support" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("support")}
          >
            Support
          </Button>
        </div>

        {/* Tab Content */}
        <div className="max-h-64 overflow-y-auto">
          {activeTab === "resources" && (
            <div className="space-y-3">
              {recoveryResources.map((resource) => (
                <Card key={resource.id} className="text-sm">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <span className="font-medium text-xs">
                          {resource.name}
                        </span>
                      </div>
                      <Badge
                        className={`text-xs ${getAvailabilityColor(
                          resource.availability
                        )}`}
                      >
                        {resource.availability.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-600 mb-2">
                      {resource.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{resource.location}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call: {resource.contact}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "steps" && (
            <div className="space-y-3">
              {recoverySteps.map((step) => (
                <Card
                  key={step.id}
                  className={`text-sm cursor-pointer ${
                    step.completed ? "bg-green-50 border-green-200" : ""
                  }`}
                  onClick={() => toggleStep(step.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        {step.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                        )}
                      </Button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`font-medium text-xs ${
                              step.completed ? "line-through text-gray-500" : ""
                            }`}
                          >
                            {step.title}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              step.priority === "high"
                                ? "border-red-500 text-red-600"
                                : step.priority === "medium"
                                ? "border-orange-500 text-orange-600"
                                : "border-yellow-500 text-yellow-600"
                            }`}
                          >
                            {step.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "support" && (
            <div className="space-y-3">
              <Card className="text-sm">
                <CardContent className="p-3">
                  <h4 className="font-medium text-xs mb-2">
                    📋 Document Everything
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Take photos of all damage for insurance claims
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                  >
                    <Camera className="h-3 w-3 mr-1" />
                    Start Photo Documentation
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-sm">
                <CardContent className="p-3">
                  <h4 className="font-medium text-xs mb-2">
                    🏘️ Community Support
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Connect with local volunteers and support groups
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Find Local Groups
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-sm">
                <CardContent className="p-3">
                  <h4 className="font-medium text-xs mb-2">💭 Mental Health</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Professional counseling and support available
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                  >
                    <Heart className="h-3 w-3 mr-1" />
                    Get Counseling Support
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200 text-sm">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-xs text-blue-800 mb-1">
                        Recovery Timeline
                      </h4>
                      <p className="text-xs text-blue-700">
                        Recovery is a process. Focus on immediate safety first,
                        then move through each step at your own pace.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
