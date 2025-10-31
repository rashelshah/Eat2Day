import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Mail, Phone, MapPin, FileText, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
}

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/admin/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        toast.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("An error occurred while fetching applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/admin/applications/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Application approved successfully!");
        fetchApplications();
        setSelectedApplication(null);
      } else {
        toast.error(data.message || "Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("An error occurred while approving the application");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/applications/${selectedApplication.id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rejectionReason }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Application rejected successfully!");
        fetchApplications();
        setShowRejectDialog(false);
        setSelectedApplication(null);
        setRejectionReason("");
      } else {
        toast.error(data.message || "Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("An error occurred while rejecting the application");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "ALL") return true;
    return app.status === filter;
  });

  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/admin")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Restaurant Applications</h1>
        <p className="text-muted-foreground mt-1">Review and manage restaurant partnership applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "ALL" ? "default" : "outline"}
          onClick={() => setFilter("ALL")}
        >
          All ({applications.length})
        </Button>
        <Button
          variant={filter === "PENDING" ? "default" : "outline"}
          onClick={() => setFilter("PENDING")}
        >
          Pending ({applications.filter((a) => a.status === "PENDING").length})
        </Button>
        <Button
          variant={filter === "APPROVED" ? "default" : "outline"}
          onClick={() => setFilter("APPROVED")}
        >
          Approved ({applications.filter((a) => a.status === "APPROVED").length})
        </Button>
        <Button
          variant={filter === "REJECTED" ? "default" : "outline"}
          onClick={() => setFilter("REJECTED")}
        >
          Rejected ({applications.filter((a) => a.status === "REJECTED").length})
        </Button>
      </div>

      {/* Applications Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Restaurant Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {app.email}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Phone className="h-3 w-3" />
                          {app.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(app.submittedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(app)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                {selectedApplication.name}
                {getStatusBadge(selectedApplication.status)}
              </DialogTitle>
              <DialogDescription>
                Application submitted on {formatDate(selectedApplication.submittedAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Email:</strong> {selectedApplication.email}</p>
                  <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </h3>
                <p className="text-sm">{selectedApplication.address}</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedApplication.description}
                </p>
              </div>

              {/* Submission Details */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Submission Details
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Submitted:</strong> {formatDate(selectedApplication.submittedAt)}</p>
                  {selectedApplication.processedAt && (
                    <>
                      <p><strong>Processed:</strong> {formatDate(selectedApplication.processedAt)}</p>
                      <p><strong>Processed By:</strong> {selectedApplication.processedBy}</p>
                    </>
                  )}
                  {selectedApplication.rejectionReason && (
                    <p className="text-red-600">
                      <strong>Rejection Reason:</strong> {selectedApplication.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {selectedApplication.status === "PENDING" && (
              <DialogFooter className="gap-2">
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isProcessing}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedApplication.id)}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isProcessing ? "Processing..." : "Approve"}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. This will be visible to the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason</Label>
            <Textarea
              id="reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Location not in our service area, incomplete information..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Applications;
