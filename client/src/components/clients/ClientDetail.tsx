import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client, Vehicle, Service } from "@shared/schema";
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
import { EyeIcon } from "lucide-react";

type ClientDetailProps = {
  clientId: string | number;
};

export function ClientDetail({ clientId }: ClientDetailProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("vehicles");
  
  const { data: client, isLoading: isLoadingClient } = useQuery<Client>({
    queryKey: [`/api/clients/${clientId}`],
  });
  
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery<Vehicle[]>({
    queryKey: [`/api/clients/${clientId}/vehicles`],
  });
  
  const { data: services, isLoading: isLoadingServices } = useQuery<Service[]>({
    queryKey: [`/api/clients/${clientId}/services`],
  });
  
  const handleDeleteClient = async () => {
    try {
      await apiRequest("DELETE", `/api/clients/${clientId}`, undefined);
      
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      
      toast({
        title: t("clients.delete_success"),
        description: t("clients.client_deleted"),
      });
      
      navigate("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: t("common.error"),
        description: t("clients.delete_error"),
        variant: "destructive",
      });
    }
  };
  
  // Format timestamp to local date string
  const formatTimestamp = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  if (isLoadingClient) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded-md w-full"></div>
        <div className="h-40 bg-gray-200 rounded-md w-full"></div>
        <div className="h-40 bg-gray-200 rounded-md w-full"></div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">{t("clients.not_found")}</h3>
        <p className="text-gray-500">{t("clients.not_found_description")}</p>
        <Button className="mt-4" onClick={() => navigate("/clients")}>
          {t("common.go_back")}
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Client Information */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">{t("clients.information")}</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">{t("clients.name")}</p>
              <p>{client.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("clients.email")}</p>
              <p className={client.email ? "" : "italic text-gray-500"}>
                {client.email || t("common.not_provided")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("clients.phone")}</p>
              <p className={client.phone ? "" : "italic text-gray-500"}>
                {client.phone || t("common.not_provided")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("clients.location")}</p>
              <p>{client.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("clients.created_at")}</p>
              <p>{formatTimestamp(client.createdAt)}</p>
            </div>
          </div>
        </Card>

        {/* Related Information */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">{t("clients.related_info")}</h3>
          <p className="text-sm text-gray-600 mb-3">{t("clients.related_description")}</p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="vehicles" className="flex-1">
                {t("clients.vehicles")} ({vehicles?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="services" className="flex-1">
                {t("clients.services")} ({services?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex-1">
                {t("clients.quotes")} (0)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="vehicles">
              {isLoadingVehicles ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-8 bg-gray-200 rounded-md w-full"></div>
                  <div className="h-8 bg-gray-200 rounded-md w-full"></div>
                </div>
              ) : vehicles && vehicles.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 font-medium text-gray-600">{t("vehicles.brand_model")}</th>
                      <th className="py-2 font-medium text-gray-600">{t("vehicles.plate")}</th>
                      <th className="py-2 font-medium text-gray-600">{t("vehicles.color")}</th>
                      <th className="py-2 font-medium text-gray-600">{t("common.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-b">
                        <td className="py-3">{`${vehicle.brand} ${vehicle.model}`}</td>
                        <td className="py-3">{vehicle.plate || "N/A"}</td>
                        <td className="py-3">{vehicle.color || "N/A"}</td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm" className="text-primary h-8 w-8 p-0">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>{t("vehicles.no_vehicles")}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="services">
              {isLoadingServices ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-8 bg-gray-200 rounded-md w-full"></div>
                  <div className="h-8 bg-gray-200 rounded-md w-full"></div>
                </div>
              ) : services && services.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 font-medium text-gray-600">{t("services.date")}</th>
                      <th className="py-2 font-medium text-gray-600">{t("vehicles.vehicle")}</th>
                      <th className="py-2 font-medium text-gray-600">{t("services.type")}</th>
                      <th className="py-2 font-medium text-gray-600">{t("services.status")}</th>
                      <th className="py-2 font-medium text-gray-600">{t("common.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id} className="border-b">
                        <td className="py-3">{formatDate(service.date)}</td>
                        <td className="py-3">{service.vehicleName}</td>
                        <td className="py-3">{service.serviceType}</td>
                        <td className="py-3">{service.status}</td>
                        <td className="py-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary h-8 w-8 p-0"
                            onClick={() => navigate(`/services/${service.id}`)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>{t("services.no_services")}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="quotes">
              <div className="text-center py-4 text-gray-500">
                <p>{t("quotes.no_quotes")}</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("clients.confirm_delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("clients.delete_warning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-destructive text-destructive-foreground">
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
