import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Client, insertClientSchema } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const formSchema = insertClientSchema.extend({});

export default function EditClient() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const clientId = parseInt(params.id, 10);
  
  // Formulário com valores padrão vazios
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      email: "",
      phone: "",
    },
  });

  // Buscar dados do cliente
  const { data: client, isLoading, error } = useQuery<Client>({
    queryKey: ['/api/clients', clientId],
    enabled: isAuthenticated && !isNaN(clientId),
  });

  // Preencher o formulário quando os dados do cliente forem carregados
  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        location: client.location,
        email: client.email || "",
        phone: client.phone || "",
      });
    }
  }, [client, form]);

  // Atualizar cliente
  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar cliente');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cliente atualizado",
        description: "O cliente foi atualizado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clients', clientId] });
      setLocation(`/clients/${clientId}`);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar cliente",
        description: "Ocorreu um erro ao atualizar o cliente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate(values);
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (isNaN(clientId)) {
    setLocation("/clients");
    return null;
  }

  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4 p-0 flex items-center gap-1 hover:bg-transparent"
        onClick={() => setLocation(`/clients/${clientId}`)}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar</span>
      </Button>

      <h1 className="text-2xl font-bold mb-6">Editar Cliente</h1>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar informações do cliente.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local*</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade/Localização" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="email@exemplo.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Salvando..." : "Atualizar"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}