import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Camera, Send, Clock, ThumbsUp } from "lucide-react";

type DisasterPhase = "before" | "during" | "after";

interface CommunityReport {
  id: string;
  author: string;
  location: string;
  message: string;
  timestamp: Date;
  type: "help_needed" | "safe" | "hazard" | "resource_available";
  upvotes: number;
  hasPhoto: boolean;
}

interface CommunityReportingProps {
  currentPhase: DisasterPhase;
}

export const CommunityReporting: React.FC<CommunityReportingProps> = ({
  currentPhase,
}) => {
  console.log("Current phase:", currentPhase); // Use currentPhase to avoid unused variable error
  const [reports, setReports] = useState<CommunityReport[]>([
    {
      id: "1",
      author: "Nguyen A",
      location: "Hai Chau District",
      message:
        "Water rising rapidly near Han Market. Need immediate evacuation assistance for elderly neighbors.",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: "help_needed",
      upvotes: 12,
      hasPhoto: true,
    },
    {
      id: "2",
      author: "Le B",
      location: "Son Tra District",
      message:
        "Family of 4 safely reached Community Center. Shelter has space and resources available.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: "safe",
      upvotes: 8,
      hasPhoto: false,
    },
    {
      id: "3",
      author: "Tran C",
      location: "Thanh Khe District",
      message:
        "Road blocked by fallen tree on Nguyen Van Linh Street. Alternative route needed.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: "hazard",
      upvotes: 15,
      hasPhoto: true,
    },
  ]);

  const [isReporting, setIsReporting] = useState(false);
  const [newReport, setNewReport] = useState({
    location: "",
    message: "",
    type: "safe" as CommunityReport["type"],
  });

  const handleSubmitReport = () => {
    if (!newReport.message.trim()) return;

    const report: CommunityReport = {
      id: Date.now().toString(),
      author: "You",
      location: newReport.location || "Current Location",
      message: newReport.message,
      timestamp: new Date(),
      type: newReport.type,
      upvotes: 0,
      hasPhoto: false,
    };

    setReports((prev) => [report, ...prev]);
    setNewReport({ location: "", message: "", type: "safe" });
    setIsReporting(false);
  };

  const handleUpvote = (reportId: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? { ...report, upvotes: report.upvotes + 1 }
          : report
      )
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "help_needed":
        return "bg-red-500 text-white";
      case "hazard":
        return "bg-orange-500 text-white";
      case "resource_available":
        return "bg-green-500 text-white";
      case "safe":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "help_needed":
        return "🆘";
      case "hazard":
        return "⚠️";
      case "resource_available":
        return "🤝";
      case "safe":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "help_needed":
        return "Help Needed";
      case "hazard":
        return "Hazard Report";
      case "resource_available":
        return "Resource Available";
      case "safe":
        return "Safety Check-In";
      default:
        return "Update";
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Community Updates
        </CardTitle>
        <CardDescription>
          Share and view local emergency updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Quick Report Button */}
        <Button
          onClick={() => setIsReporting(!isReporting)}
          className="w-full mb-4"
          variant={isReporting ? "secondary" : "default"}
        >
          <Send className="h-4 w-4 mr-2" />
          {isReporting ? "Cancel Report" : "Share Update"}
        </Button>

        {/* Report Form */}
        {isReporting && (
          <div className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="text-xs font-medium text-gray-600">
                Location
              </label>
              <Input
                placeholder="Your current location"
                value={newReport.location}
                onChange={(e) =>
                  setNewReport((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">
                Report Type
              </label>
              <select
                value={newReport.type}
                onChange={(e) =>
                  setNewReport((prev) => ({
                    ...prev,
                    type: e.target.value as CommunityReport["type"],
                  }))
                }
                className="w-full p-2 border rounded text-sm"
              >
                <option value="safe">I'm Safe</option>
                <option value="help_needed">Need Help</option>
                <option value="hazard">Report Hazard</option>
                <option value="resource_available">Offer Help</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">
                Message
              </label>
              <Textarea
                placeholder="Share your situation or local conditions..."
                value={newReport.message}
                onChange={(e) =>
                  setNewReport((prev) => ({ ...prev, message: e.target.value }))
                }
                className="text-sm h-20"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSubmitReport} className="flex-1">
                Submit
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Camera className="h-3 w-3 mr-1" />
                Add Photo
              </Button>
            </div>
          </div>
        )}

        {/* Community Reports Feed */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {reports.slice(0, 5).map((report) => (
            <Card key={report.id} className="text-sm">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(report.type)}</span>
                    <Badge className={`text-xs ${getTypeColor(report.type)}`}>
                      {getTypeLabel(report.type)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={() => handleUpvote(report.id)}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span className="ml-1 text-xs">{report.upvotes}</span>
                  </Button>
                </div>

                <p className="text-xs text-gray-600 mb-2">{report.message}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{report.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{report.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-medium">{report.author}</span>
                  {report.hasPhoto && (
                    <Badge variant="outline" className="text-xs">
                      <Camera className="h-2 w-2 mr-1" />
                      Photo
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-3 text-center">
          <Button variant="ghost" size="sm" className="text-xs">
            View All Reports ({reports.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
