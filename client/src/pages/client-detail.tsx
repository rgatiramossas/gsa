import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams, useRoute } from "wouter";
import { Client, Service } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Mail, MapPin, Phone, Trash2, Edit, Calendar, User, Car, Wrench, DollarSign } from "lucide-react";

export default function ClientDetailPage() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const clientId = parseInt(params.id, 10);
  
  const { data: client, isLoading: isLoadingClient, error: clientError } = useQuery<Client>({
    queryKey: ['/api/clients', clientId],
    enabled: isAuthenticated && !isNaN(clientId),
  });

  const { data: services, isLoading: isLoadingServices } = useQuery<Service[]>({
    queryKey: ['/api/clients', clientId, 'services'],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${clientId}/services`);
      if (!response.ok) throw new Error('Erro ao carregar serviços');
      return response.json();
    },
    enabled: isAuthenticated && !isNaN(clientId),
  });

  const deleteClient = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/clients/' + clientId, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso",
      });
      setLocation("/clients");
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir cliente",
        description: "Ocorreu um erro ao excluir o cliente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (isNaN(clientId)) {
    setLocation("/clients");
    return null;
  }

  const isAdmin = user?.role === "admin";

  function getStatusText(status: string) {
    switch(status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em andamento';
      case 'completed': return 'Concluído';
      default: return status;
    }
  }

  function getServiceTypeText(type: string) {
    switch(type) {
      case 'street_dent': return 'Amassado de rua';
      case 'hail': return 'Granizo';
      case 'other': return 'Outro';
      default: return type;
    }
  }

  function getStatusColor(status: string) {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  }

  return (
    <AppShell>
      <div className="container px-4 py-6 max-w-md mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4 p-0 flex items-center gap-1 hover:bg-transparent"
          onClick={() => setLocation("/clients")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>

        {isLoadingClient ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : clientError ? (
          <div className="text-center py-8">
            <p className="text-red-500">Erro ao carregar informações do cliente.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        ) : client ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold">{client.name}</h1>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{client.location}</span>
                  </div>
                  
                  {client.phone && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  
                  {client.email && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span>{client.email}</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-1">
                    Cliente desde {formatDate(client.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="icon" 
                  variant="outline"
                  onClick={() => setLocation(`/clients/edit/${clientId}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => deleteClient.mutate()}
                        >
                          {deleteClient.isPending ? "Excluindo..." : "Excluir"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>

            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="services">Atendimentos</TabsTrigger>
                <TabsTrigger value="vehicles">Veículos</TabsTrigger>
              </TabsList>
              <TabsContent value="services" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Histórico de atendimentos</h2>
                  <Button 
                    size="sm"
                    onClick={() => setLocation(`/services/new?clientId=${clientId}`)}
                  >
                    Novo
                  </Button>
                </div>

                {isLoadingServices ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : services?.length === 0 ? (
                  <div className="text-center py-6 border rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">Nenhum atendimento registrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services?.map((service) => (
                      <Card key={service.id} className="w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setLocation(`/services/${service.id}`)}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">{service.vehicleName}</CardTitle>
                              {service.vehiclePlate && <span className="text-xs text-gray-500">({service.vehiclePlate})</span>}
                            </div>
                            <Badge className={getStatusColor(service.status)}>
                              {getStatusText(service.status)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">{formatDate(service.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">{service.technicianName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Wrench className="h-3.5 w-3.5 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">{getServiceTypeText(service.serviceType)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {(service.serviceValue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="vehicles" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Veículos</h2>
                  <Button 
                    size="sm"
                    onClick={() => setLocation(`/vehicles/new?clientId=${clientId}`)}
                  >
                    Novo
                  </Button>
                </div>
                
                <div className="text-center py-6 border rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">Implementação de veículos em breve</p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}