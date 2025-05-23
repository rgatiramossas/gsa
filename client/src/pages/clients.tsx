import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Client } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, MapPin, Phone, Mail, Eye } from "lucide-react";

export default function ClientsPage() {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  
  const { data: clients, isLoading, error } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return (
    <AppShell>
      <div className="container px-4 py-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <Button 
            onClick={() => setLocation("/clients/new")}
            className="flex items-center gap-1"
            size="sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Novo</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="w-full">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Erro ao carregar clientes. Tente novamente.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        ) : clients?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhum cliente cadastrado</p>
            <Button onClick={() => setLocation("/clients/new")}>
              Cadastrar cliente
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {clients?.map((client) => (
              <Card key={client.id} className="w-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2 text-sm">
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
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setLocation(`/clients/${client.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}