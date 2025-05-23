import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ClientsIndex from "@/pages/clients/index";
import ClientDetail from "@/pages/clients/[id]";
import NewClient from "@/pages/clients/new";
import EditClient from "@/pages/clients/edit/[id]";
import ServicesIndex from "@/pages/services/index";
import ServiceDetail from "@/pages/services/[id]";
import NewService from "@/pages/services/new";
import EditService from "@/pages/services/edit/[id]";
import BudgetIndex from "@/pages/budget/index";
import Login from "@/pages/login";
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
        <ProtectedRoute component={ClientsIndex} />
      </Route>
      
      <Route path="/clients/new">
        <ProtectedRoute component={NewClient} />
      </Route>
      
      <Route path="/clients/:id">
        {(params) => <ProtectedRoute component={ClientDetail} id={params.id} />}
      </Route>
      
      <Route path="/clients/edit/:id">
        {(params) => <ProtectedRoute component={EditClient} id={params.id} />}
      </Route>
      
      <Route path="/services">
        <ProtectedRoute component={ServicesIndex} />
      </Route>
      
      <Route path="/services/new">
        <ProtectedRoute component={NewService} />
      </Route>
      
      <Route path="/services/:id">
        {(params) => <ProtectedRoute component={ServiceDetail} id={params.id} />}
      </Route>
      
      <Route path="/services/edit/:id">
        {(params) => <ProtectedRoute component={EditService} id={params.id} />}
      </Route>
      
      <Route path="/budget">
        <ProtectedRoute component={BudgetIndex} />
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
