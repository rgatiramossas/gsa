import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";

// Importamos nossos componentes da pasta pages-new (estrutura simplificada)
import ClientsPage from "@/pages-new/clients";
import ClientDetailPage from "@/pages-new/client-detail";
import ClientNewPage from "@/pages-new/client-new";
import ClientEditPage from "@/pages-new/client-edit";
import { useAuth } from "./hooks/useAuth";
import { AppShell } from "./components/layout/AppShell";
import { useEffect } from "react";

// Protected route component
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <Component {...rest} /> : null;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/clients">
        <ProtectedRoute component={ClientsPage} />
      </Route>
      
      <Route path="/clients/new">
        <ProtectedRoute component={ClientNewPage} />
      </Route>
      
      <Route path="/clients/:id">
        {(params) => <ProtectedRoute component={ClientDetailPage} id={params.id} />}
      </Route>
      
      <Route path="/clients/edit/:id">
        {(params) => <ProtectedRoute component={ClientEditPage} id={params.id} />}
      </Route>
      
      {/* Desabilitadas temporariamente para foco nas páginas de clientes
      <Route path="/services">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/services/new">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/services/:id">
        {(params) => <ProtectedRoute component={Dashboard} id={params.id} />}
      </Route>
      
      <Route path="/services/edit/:id">
        {(params) => <ProtectedRoute component={Dashboard} id={params.id} />}
      </Route>
      */}
      
      <Route path="/budget">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {isAuthenticated ? (
          <AppShell>
            <Router />
          </AppShell>
        ) : (
          <Router />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
