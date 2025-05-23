import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Client, Service } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Phone, Mail, MapPin, Car, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ClientDetailPage() {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const params = useParams();
  const clientId = params.id;

  const { data: client, isLoading: clientLoading, error: clientError } = useQuery<Client>({
    queryKey: [`/api/clients/${clientId}`],
    enabled: isAuthenticated && !!clientId,
  });

  const { data: services, isLoading: servicesLoading, error: servicesError } = useQuery<Service[]>({
    queryKey: [`/api/clients/${clientId}/services`],
    enabled: isAuthenticated && !!clientId,
  });

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  function getStatusText(status: string) {
    switch (status) {
      case "pending": return "Pendente";
      case "in_progress": return "Em andamento";
      case "completed": return "Concluído";
      case "canceled": return "Cancelado";
      default: return status;
    }
  }

  function getServiceTypeText(type: string) {
    switch (type) {
      case "repair": return "Reparo";
      case "maintenance": return "Manutenção";
      case "custom": return "Personalizado";
      default: return type;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "canceled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  }

  const isLoading = clientLoading || servicesLoading;
  const hasError = clientError || servicesError;

  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 gap-1" 
        onClick={() => setLocation("/clients")}
      >
        <ChevronLeft className="h-4 w-4" /> 
        Voltar
      </Button>

      {isLoading ? (
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div>
            <Skeleton className="h-6 w-1/3 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </div>
      ) : hasError ? (
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar dados do cliente. Tente novamente.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      ) : client ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation(`/clients/edit/${client.id}`)}
              className="flex items-center gap-1"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Editar</span>
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                  <span>{client.location}</span>
                </div>
                
                {client.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-0.5 text-gray-500" />
                    <span>{client.phone}</span>
                  </div>
                )}
                
                {client.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-gray-500" />
                    <span>{client.email}</span>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <Car className="h-4 w-4 mt-0.5 text-gray-500" />
                  <span>Cliente desde {formatDate(client.createdAt || new Date())}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-4">
            <h2 className="font-medium text-lg mb-3">Serviços</h2>
            {!services || services.length === 0 ? (
              <div className="text-center py-6 border border-dashed rounded-lg">
                <p className="text-gray-500">Nenhum serviço registrado</p>
                <Button className="mt-2" size="sm" onClick={() => setLocation("/services/new")}>
                  Novo serviço
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <Card key={service.id} className="w-full cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setLocation(`/services/${service.id}`)}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{service.title}</h3>
                          <p className="text-sm text-gray-500">{getServiceTypeText(service.type)}</p>
                          <p className="text-sm mt-1">
                            {formatDate(service.createdAt || new Date())}
                          </p>
                        </div>
                        <div>
                          <Badge className={getStatusColor(service.status)}>
                            {getStatusText(service.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p>Cliente não encontrado</p>
          <Button className="mt-4" onClick={() => setLocation("/clients")}>
            Voltar para lista
          </Button>
        </div>
      )}
    </div>
  );
}