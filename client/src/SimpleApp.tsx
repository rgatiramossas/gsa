import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Simplificado para evitar erros
function StatCard({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string, color: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start">
        <div className={`p-2 rounded-full ${color} mr-3`}>
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

// Tela de login
function LoginScreen({ onLogin }: { onLogin: () => void }) {
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

// Dashboard com menu lateral
function Dashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Menu lateral */}
      <div className="bg-white border-r md:w-64 md:fixed md:h-screen md:flex md:flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Euro Dent Experts</h1>
          <p className="text-sm text-gray-500">Sistema de Gerenciamento</p>
        </div>
        
        <div className="hidden md:flex md:flex-col md:flex-1 p-4">
          <nav className="space-y-1">
            <div className="p-2 rounded-md text-white bg-primary">
              Dashboard
            </div>
            <div className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              Clientes
            </div>
            <div className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              Serviços
            </div>
            <div className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              Orçamentos
            </div>
            <div className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              Configurações
            </div>
          </nav>
        </div>
        
        <div className="hidden md:block p-4 border-t mt-auto">
          <Button 
            onClick={onLogout} 
            variant="outline" 
            className="w-full justify-center"
          >
            Sair
          </Button>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 md:ml-64">
        {/* Header para mobile */}
        <header className="bg-white p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold">Euro Dent Experts</h1>
          <Button variant="outline" onClick={onLogout}>Sair</Button>
        </header>
        
        <main className="p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-600">Gerencie os serviços da oficina de reparos</p>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <StatCard 
              icon={<span>⏰</span>}
              title="Serviços Pendentes" 
              value="8" 
              color="bg-red-100"
            />
            <StatCard 
              icon={<span>📋</span>}
              title="Serviços em Andamento" 
              value="5" 
              color="bg-blue-100"
            />
            <StatCard 
              icon={<span>✅</span>}
              title="Serviços Concluídos" 
              value="12" 
              color="bg-green-100"
            />
            <StatCard 
              icon={<span>💶</span>}
              title="Receita Total" 
              value="€4.860,00" 
              color="bg-yellow-100"
            />
          </div>
          
          {/* Botões de ação */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button className="bg-primary hover:bg-primary/90">
              Novo Serviço
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Novo Cliente
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Orçamentos
            </Button>
          </div>
          
          {/* Serviços recentes */}
          <Card className="p-4 mb-6">
            <h2 className="text-lg font-medium mb-4">Serviços Recentes</h2>
            <div className="space-y-3">
              {[
                { id: 1, client: "João Silva", vehicle: "BMW X5", status: "Pendente", date: "22/05/2025" },
                { id: 2, client: "Maria Oliveira", vehicle: "Mercedes C180", status: "Em Andamento", date: "21/05/2025" },
                { id: 3, client: "Carlos Ferreira", vehicle: "Audi A3", status: "Concluído", date: "20/05/2025" }
              ].map(service => (
                <div key={service.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{service.client}</p>
                    <p className="text-sm text-gray-500">{service.vehicle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      service.status === "Pendente" 
                        ? "bg-red-100 text-red-800" 
                        : service.status === "Em Andamento" 
                        ? "bg-amber-100 text-amber-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {service.status}
                    </span>
                    <span className="text-sm text-gray-500">{service.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Gráfico simplificado */}
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-4">Desempenho Mensal</h2>
            <div className="h-60 flex items-center justify-center">
              <div className="flex space-x-6 items-end h-40">
                <div className="flex flex-col items-center">
                  <div className="bg-primary w-10 h-20 rounded-t-md"></div>
                  <span className="text-xs mt-2">Jan</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-primary w-10 h-24 rounded-t-md"></div>
                  <span className="text-xs mt-2">Fev</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-primary w-10 h-16 rounded-t-md"></div>
                  <span className="text-xs mt-2">Mar</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-primary w-10 h-28 rounded-t-md"></div>
                  <span className="text-xs mt-2">Abr</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-primary w-10 h-32 rounded-t-md"></div>
                  <span className="text-xs mt-2">Mai</span>
                </div>
              </div>
            </div>
          </Card>
        </main>
        
        {/* Navegação móvel */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-2 md:hidden">
          <button className="flex flex-col items-center p-2 text-primary">
            <span>📊</span>
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <span>👥</span>
            <span className="text-xs">Clientes</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <span>🔧</span>
            <span className="text-xs">Serviços</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <span>📝</span>
            <span className="text-xs">Orçamentos</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

// Aplicativo principal
export default function SimpleApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div>
      {!isAuthenticated ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}