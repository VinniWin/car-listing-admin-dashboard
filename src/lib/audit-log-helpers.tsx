import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Edit, Plus, XCircle } from "lucide-react";

export const getActionIcon = (action: string) => {
  switch (action) {
    case "approve":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "reject":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "edit":
      return <Edit className="h-4 w-4 text-blue-600" />;
    case "create":
      return <Plus className="h-4 w-4 text-purple-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

export const getActionBadge = (action: string) => {
  const variants = {
    approve: "bg-green-100 text-green-800",
    reject: "bg-red-100 text-red-800",
    edit: "bg-blue-100 text-blue-800",
    create: "bg-purple-100 text-purple-800",
  };

  return (
    <Badge
      className={
        variants[action as keyof typeof variants] || "bg-gray-100 text-gray-800"
      }
    >
      {action.charAt(0).toUpperCase() + action.slice(1)}
    </Badge>
  );
};

export const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};

export const getFormattedActionMessage = (
  action: string,
  listingId: string
) => {
  switch (action) {
    case "approve":
      return `Approved listing ${listingId}`;
    case "reject":
      return `Rejected listing ${listingId}`;
    case "edit":
      return `Modified listing ${listingId}`;
    case "create":
      return `Created listing ${listingId}`;
    default:
      return "";
  }
};
