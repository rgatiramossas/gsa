import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MenuPage() {
  const [, navigate] = useLocation();
  
  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Menu de Navegação</h1>
      
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full"
            >
              Dashboard
            </Button>
            
            <Button
              onClick={() => navigate("/clients")}
              className="w-full"
              variant="outline"
            >
              Clientes
            </Button>
            
            <Button
              onClick={() => navigate("/services")}
              className="w-full"
              variant="outline"
            >
              Serviços
            </Button>
            
            <Button
              onClick={() => navigate("/budget")}
              className="w-full"
              variant="outline"
            >
              Orçamentos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}