import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function SimpleNavigation() {
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }
  
  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Euro Dent Experts</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Menu de Navegação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => window.location.href = "/dashboard"} 
            className="w-full"
            variant="default"
          >
            Dashboard
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/clients"} 
            className="w-full"
            variant="outline"
          >
            Clientes
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/services"} 
            className="w-full"
            variant="outline"
          >
            Serviços
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/budget"} 
            className="w-full"
            variant="outline"
          >
            Orçamentos
          </Button>
        </CardContent>
      </Card>
      
      <p className="text-center text-sm text-gray-500">
        Esta é uma página de navegação alternativa para facilitar o acesso às funcionalidades do sistema.
      </p>
    </div>
  );
}