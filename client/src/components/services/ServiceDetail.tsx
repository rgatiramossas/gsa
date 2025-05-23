import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Service, Client } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

type ServiceDetailProps = {
  serviceId: string | number;
};

export function ServiceDetail({ serviceId }: ServiceDetailProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { data: service, isLoading: isLoadingService } = useQuery<Service>({
    queryKey: [`/api/services/${serviceId}`],
  });
  
  const { data: client } = useQuery<Client>({
    queryKey: [`/api/clients/${service?.clientId}`],
    enabled: !!service?.clientId,
  });
  
  const handleDeleteService = async () => {
    try {
      await apiRequest("DELETE", `/api/services/${serviceId}`, undefined);
      
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/recent-services'] });
      
      toast({
        title: t("services.delete_success"),
        description: t("services.service_deleted"),
      });
      
      navigate("/services");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: t("common.error"),
        description: t("services.delete_error"),
        variant: "destructive",
      });
    }
  };
  
  // Check if user can edit/delete this service
  const canModify = () => {
    if (!user || !service) return false;
    if (user.role === "admin") return true;
    return service.technicianId === user.id;
  };
  
  // Format currency (euros)
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "N/A";
    
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };
  
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
  
  if (isLoadingService) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded-md w-full"></div>
        <div className="h-40 bg-gray-200 rounded-md w-full"></div>
        <div className="h-40 bg-gray-200 rounded-md w-full"></div>
      </div>
    );
  }
  
  if (!service) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">{t("services.not_found")}</h3>
        <p className="text-gray-500">{t("services.not_found_description")}</p>
        <Button className="mt-4" onClick={() => navigate("/services")}>
          {t("common.go_back")}
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Service Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("services.details")}</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">{t("services.client")}</p>
                <p className="font-medium">{client?.name || service.clientId}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">{t("services.vehicle")}</p>
                <p>{service.vehicleName}</p>
                <div className="flex space-x-4 mt-1">
                  <span className="text-sm">
                    <span className="text-gray-500">{t("services.plate")}:</span> {service.vehiclePlate || t("common.not_provided")}
                  </span>
                  <span className="text-sm">
                    <span className="text-gray-500">{t("services.chassis")}:</span> {service.vehicleChassis || t("common.not_provided")}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">{t("services.date")}</p>
                <p>{formatDate(service.date)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">{t("services.technician")}</p>
                <p>{service.technicianName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">{t("services.type")}</p>
                <p>{getServiceTypeName(service.serviceType)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">{t("services.value")}</p>
                <p className="font-medium">{formatCurrency(service.serviceValue)}</p>
              </div>
              
              {user?.role === "admin" && (
                <div>
                  <p className="text-sm text-gray-500">{t("services.administrative_value")}</p>
                  <p>{formatCurrency(service.administrativeValue)}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">{t("services.status")}</p>
                <div className="mt-1">{getStatusBadge(service.status)}</div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Images */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("services.images")}</h3>
            
            {service.images && service.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {service.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img 
                      src={image} 
                      alt={`Service image ${index + 1}`} 
                      className="object-cover rounded-md w-full h-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center border rounded-md border-dashed">
                <p className="text-gray-500">{t("services.no_images")}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Action buttons */}
      {canModify() && (
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/services")}
          >
            {t("common.go_back")}
          </Button>
          <Button 
            variant="default" 
            onClick={() => navigate(`/services/edit/${service.id}`)}
          >
            {t("common.edit")}
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
          >
            {t("common.delete")}
          </Button>
        </div>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("services.confirm_delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("services.delete_warning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService} className="bg-destructive text-destructive-foreground">
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
