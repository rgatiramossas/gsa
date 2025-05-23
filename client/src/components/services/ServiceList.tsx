import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service } from "@shared/schema";
import { SearchIcon, EyeIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

export function ServiceList() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  // Format currency (euros)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };
  
  // Filter services based on search term and filters
  const filteredServices = services?.filter(service => {
    // Search term filter
    const matchesSearch = 
      service.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.vehiclePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.technicianName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || service.status === statusFilter;
    
    // Type filter
    const matchesType = typeFilter === "all" || service.serviceType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
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
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded-md w-full"></div>
        <div className="h-64 bg-gray-200 rounded-md w-full"></div>
      </div>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t("services.search_placeholder")}
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t("services.all_statuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("services.all_statuses")}</SelectItem>
                <SelectItem value="pending">{t("services.status.pending")}</SelectItem>
                <SelectItem value="in_progress">{t("services.status.in_progress")}</SelectItem>
                <SelectItem value="completed">{t("services.status.completed")}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t("services.all_types")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("services.all_types")}</SelectItem>
                <SelectItem value="street_dent">{t("services.types.street_dent")}</SelectItem>
                <SelectItem value="hail">{t("services.types.hail")}</SelectItem>
                <SelectItem value="other">{t("services.types.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Services list */}
      <div className="overflow-x-auto">
        {filteredServices && filteredServices.length > 0 ? (
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-3 text-gray-600 font-medium">{t("common.client")}</th>
                <th className="text-left p-3 text-gray-600 font-medium">{t("common.vehicle")}</th>
                <th className="text-left p-3 text-gray-600 font-medium">{t("services.date")}</th>
                <th className="text-left p-3 text-gray-600 font-medium">{t("common.type")}</th>
                <th className="text-left p-3 text-gray-600 font-medium">{t("common.value")}</th>
                <th className="text-left p-3 text-gray-600 font-medium">{t("common.status")}</th>
                <th className="text-left p-3 text-gray-600 font-medium">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{service.clientId}</td> {/* This would be client name in a real app */}
                  <td className="p-3">
                    {service.vehicleName}
                    {service.vehiclePlate && ` (${service.vehiclePlate})`}
                  </td>
                  <td className="p-3">{formatDate(service.date)}</td>
                  <td className="p-3">{getServiceTypeName(service.serviceType)}</td>
                  <td className="p-3">{formatCurrency(service.serviceValue)}</td>
                  <td className="p-3">{getStatusBadge(service.status)}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Link href={`/services/${service.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 h-8 w-8 p-0">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/services/edit/${service.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark h-8 w-8 p-0">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>{t("services.no_services_found")}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
