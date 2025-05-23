import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ClockIcon, 
  ClipboardListIcon, 
  CheckIcon, 
  EuroIcon, 
  PlusIcon, 
  UserPlusIcon, 
  FileTextIcon, 
  BarChart3,
  LogOutIcon 
} from "lucide-react";

// Componente de cartão de estatísticas
function StatCard({ icon, title, value, iconColor, iconBgColor }) {
  return (
    <Card className="p-4">
      <div className="flex items-start">
        <div className={`p-2 rounded-full ${iconBgColor} ${iconColor} mr-3`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

// Componente de login
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setLoading(true);
    setError('');
    
    // Verificação simples
    if (username === 'admin' && password === 'password') {
      setTimeout(() => {
        setLoading(false);
        onLogin();
      }, 500);
    } else {
      setTimeout(() => {
        setLoading(false);
        setError('Credenciais inválidas. Use admin/password.');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6 mx-auto">
        <div className="text-center mb-6">
          <div className="inline-block p-2 rounded-full bg-primary text-white mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Euro Dent Experts</h1>
          <p className="text-gray-600">Sistema de Gerenciamento de Reparos</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Usuário</label>
            <Input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Digite seu usuário" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Senha</label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="********" 
            />
          </div>
          
          {error && (
            <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          <Button 
            className="w-full" 
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Carregando..." : "Entrar"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Componente de dashboard
function Dashboard({ onLogout }) {
  // Dados de demonstração
  const stats = {
    pendingServices: 8,
    inProgressServices: 5,
    completedServices: 12,
    totalRevenue: 486000, // 4,860 EUR
  };
  
  // Formatar moeda para exibição
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Euro Dent Experts</h1>
          <p className="text-sm text-gray-500">Sistema de Gerenciamento</p>
        </div>
        <Button 
          onClick={onLogout} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <LogOutIcon size={16} />
          <span>Sair</span>
        </Button>
      </header>
      
      <main className="p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-gray-600">Gerencie os serviços da oficina de reparos</p>
        </div>
        
        {/* Métricas do Dashboard */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            icon={<ClockIcon size={18} />}
            title="Serviços Pendentes"
            value={stats.pendingServices.toString()}
            iconColor="text-red-600"
            iconBgColor="bg-red-100"
          />
          
          <StatCard
            icon={<ClipboardListIcon size={18} />}
            title="Serviços em Andamento"
            value={stats.inProgressServices.toString()}
            iconColor="text-gray-600"
            iconBgColor="bg-gray-100"
          />
          
          <StatCard
            icon={<CheckIcon size={18} />}
            title="Serviços Concluídos"
            value={stats.completedServices.toString()}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
          
          <StatCard
            icon={<EuroIcon size={18} />}
            title="Receita Total"
            value={formatCurrency(stats.totalRevenue)}
            iconColor="text-amber-600"
            iconBgColor="bg-amber-100"
          />
        </div>
        
        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <PlusIcon className="h-4 w-4" />
            <span>Novo Serviço</span>
          </Button>
          
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <UserPlusIcon className="h-4 w-4" />
            <span>Novo Cliente</span>
          </Button>
          
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <FileTextIcon className="h-4 w-4" />
            <span>Orçamentos</span>
          </Button>
        </div>
        
        {/* Serviços Recentes */}
        <Card className="p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Serviços Recentes</h3>
            <Button variant="outline" size="sm">Ver Todos</Button>
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
        
        {/* Gráfico de Desempenho (Simplificado) */}
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
      </main>
      
      {/* Barra de navegação inferior para dispositivos móveis */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-2 md:hidden">
        <button className="flex flex-col items-center p-2 text-primary">
          <BarChart3 size={20} />
          <span className="text-xs">Dashboard</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-500">
          <UserPlusIcon size={20} />
          <span className="text-xs">Clientes</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-500">
          <ClipboardListIcon size={20} />
          <span className="text-xs">Serviços</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-500">
          <FileTextIcon size={20} />
          <span className="text-xs">Orçamentos</span>
        </button>
      </nav>
    </div>
  );
}

// Aplicativo principal
export default function DemoApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="text-foreground">
      {!isAuthenticated ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}