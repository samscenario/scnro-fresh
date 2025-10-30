import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Shield, AlertTriangle, Info } from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";

export const SecurityAuditLog = () => {
  const { isAdmin } = useAdminCheck();

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['security-audit-log'],
    queryFn: async () => {
      if (!isAdmin) return [];
      
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin
  });

  if (!isAdmin) {
    return null;
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'insert':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'update':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'delete':
        return <Shield className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'insert':
        return 'bg-blue-100 text-blue-800';
      case 'update':
        return 'bg-yellow-100 text-yellow-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit Log
        </CardTitle>
        <CardDescription>
          Recent sensitive data access and modifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading audit logs...</div>
        ) : !auditLogs || auditLogs.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No audit logs found
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  {getActionIcon(log.action)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <span className="text-sm font-medium">{log.table_name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>User ID: {log.user_id || 'Unknown'}</div>
                      <div>Record ID: {log.record_id || 'N/A'}</div>
                      <div>Time: {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}</div>
                      {log.ip_address && (
                        <div>IP: {String(log.ip_address)}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};