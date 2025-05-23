import { useI18n } from "@/hooks/useI18n";
import { ClipboardListIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function ServicesList() {
  const { t } = useI18n();
  const { user } = useAuth();
  
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/dashboard/recent-services'],
  });
  
  const getServiceTypeName = (type: string) => {
    const types: Record<string, string> = {
      street_dent: t("services.types.street_dent"),
      hail: t("services.types.hail"),
      other: t("services.types.other"),
    };
    return types[type] || type;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="status-badge-pending">{t("services.status.pending")}</span>;
      case "in_progress":
        return <span className="status-badge-in-progress">{t("services.status.in_progress")}</span>;
      case "completed":
        return <span className="status-badge-completed">{t("services.status.completed")}</span>;
      default:
        return <span>{status}</span>;
    }
  };
  
  // Format currency (euros)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">{t("dashboard.recent_services")}</h3>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">{t("dashboard.recent_services")}</h3>
      
      {!services || services.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ClipboardListIcon className="mx-auto h-12 w-12 mb-3" />
          <p>{t("dashboard.no_recent_services")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 text-gray-600">{t("common.client")}</th>
                <th className="text-left py-2 px-3 text-gray-600">{t("common.vehicle")}</th>
                <th className="text-left py-2 px-3 text-gray-600">{t("common.type")}</th>
                <th className="text-left py-2 px-3 text-gray-600">{t("common.value")}</th>
                <th className="text-left py-2 px-3 text-gray-600">{t("common.status")}</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3">{service.clientId}</td>
                  <td className="py-3 px-3">
                    {service.vehicleName} 
                    {service.vehiclePlate && `(${service.vehiclePlate})`}
                  </td>
                  <td className="py-3 px-3">{getServiceTypeName(service.serviceType)}</td>
                  <td className="py-3 px-3">{formatCurrency(service.serviceValue)}</td>
                  <td className="py-3 px-3">{getStatusBadge(service.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
