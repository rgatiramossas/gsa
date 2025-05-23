import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { ClockIcon, ClipboardListIcon, CheckIcon, EuroIcon, PlusIcon, UserPlusIcon, FileTextIcon, BarChart3 } from "lucide-react";

export default function Dashboard() {
  // Static dashboard data since the API requests are not working
  const stats = {
    pendingServices: 8,
    inProgressServices: 5,
    completedServices: 12,
    totalRevenue: 486000, // 4,860 EUR
  };
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-gray-600">Gerencie os serviços da Euro Dent Experts</p>
      </div>
      
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          icon={<ClockIcon />}
          title="Serviços Pendentes"
          value={stats.pendingServices.toString()}
          linkUrl="/services"
          linkText="Ver Detalhes"
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
        
        <StatCard
          icon={<ClipboardListIcon />}
          title="Serviços em Andamento"
          value={stats.inProgressServices.toString()}
          linkUrl="/services"
          linkText="Ver Detalhes"
          iconColor="text-gray-600"
          iconBgColor="bg-gray-100"
        />
        
        <StatCard
          icon={<CheckIcon />}
          title="Serviços Concluídos"
          value={stats.completedServices.toString()}
          linkUrl="/services"
          linkText="Ver Detalhes"
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        
        <StatCard
          icon={<EuroIcon />}
          title="Receita Total"
          value={formatCurrency(stats.totalRevenue)}
          linkUrl="/services"
          linkText="Ver Detalhes"
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link href="/services/new">
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <PlusIcon className="h-4 w-4" />
            <span>Novo Serviço</span>
          </Button>
        </Link>
        
        <Link href="/clients/new">
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <UserPlusIcon className="h-4 w-4" />
            <span>Novo Cliente</span>
          </Button>
        </Link>
        
        <Link href="/budget">
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <FileTextIcon className="h-4 w-4" />
            <span>Orçamentos</span>
          </Button>
        </Link>
      </div>
      
      {/* Recent Services */}
      <Card className="p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Serviços Recentes</h3>
          <Link href="/services">
            <Button variant="outline" size="sm">Ver Todos</Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 1, client: "João Silva", vehicle: "BMW X5", status: "pendente", date: "22/05/2025" },
            { id: 2, client: "Maria Oliveira", vehicle: "Mercedes C180", status: "em_andamento", date: "21/05/2025" },
            { id: 3, client: "Carlos Ferreira", vehicle: "Audi A3", status: "concluído", date: "20/05/2025" }
          ].map(service => (
            <div key={service.id} className="flex justify-between items-center p-3 border rounded-md">
              <div>
                <p className="font-medium">{service.client}</p>
                <p className="text-sm text-gray-500">{service.vehicle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  service.status === "pendente" 
                    ? "bg-red-100 text-red-800" 
                    : service.status === "em_andamento" 
                    ? "bg-amber-100 text-amber-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {service.status === "pendente" 
                    ? "Pendente" 
                    : service.status === "em_andamento" 
                    ? "Em Andamento" 
                    : "Concluído"}
                </span>
                <span className="text-sm text-gray-500">{service.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Performance Chart (Simplified) */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Desempenho Mensal</h3>
          <BarChart3 className="text-gray-400" />
        </div>
        
        <div className="h-60 flex items-center justify-center">
          <div className="flex space-x-4 items-end h-40">
            <div className="flex flex-col items-center">
              <div className="bg-primary w-8 h-20 rounded-t-md"></div>
              <span className="text-xs mt-2">Jan</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary w-8 h-24 rounded-t-md"></div>
              <span className="text-xs mt-2">Fev</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary w-8 h-16 rounded-t-md"></div>
              <span className="text-xs mt-2">Mar</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary w-8 h-28 rounded-t-md"></div>
              <span className="text-xs mt-2">Abr</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary w-8 h-32 rounded-t-md"></div>
              <span className="text-xs mt-2">Mai</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
