import AdminLayout from "@/components/sidebar-comp/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/ui/site-header";
import { fetchWrapper } from "@/lib/fetch-wrapper";
import { useEffect, useState } from "react";

import {
  formatTimestamp,
  getActionBadge,
  getFormattedActionMessage,
} from "@/lib/audit-log-helpers";
import { AuditLog } from "@/db/schema";

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<
    (AuditLog & { admin?: { name: string | null } })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  async function fetchAuditLogs() {
    try {
      const { data } = await fetchWrapper<{
        data: (AuditLog & { admin?: { name: string | null } })[];
      }>("/api/audit-logs");
      if (data?.data) {
        setAuditLogs(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const renderAuditLogsStatus = () => {
    if (isLoading) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading audit logs...
        </div>
      );
    }

    if (auditLogs.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No audit logs found
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {auditLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getActionBadge(log.action)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(log.timestamp as unknown as string)}
                </p>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {getFormattedActionMessage(log.action, log.listingId)}
              </p>

              {log.admin && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <strong>Performed by:</strong> {log.admin.name}
                </p>
              )}

              {log.details && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Changes:
                  </p>
                  <pre className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                    {log.details}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <SiteHeader title="Audit logs" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Card className="m-2">
              <CardHeader>
                <CardTitle className="">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>{renderAuditLogsStatus()}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
