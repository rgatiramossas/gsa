import { useForm } from "react-hook-form";
import { useLocation, useParams } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Client, insertClientSchema } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Estendemos o schema para adicionar validação
const formSchema = insertClientSchema.extend({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  location: z.string().min(3, "Localização deve ter pelo menos 3 caracteres"),
  phone: z.string().nullable().optional(),
  email: z.string().email("Email inválido").nullable().optional(),
});

export default function ClientFormPage() {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const params = useParams();
  const clientId = params.id;
  const isEditing = location.includes('/edit/');
  
  const queryClient = useQueryClient();

  const { data: client, isLoading: clientLoading } = useQuery<Client>({
    queryKey: [`/api/clients/${clientId}`],
    enabled: isAuthenticated && isEditing && !!clientId,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client?.name || "",
      location: client?.location || "",
      email: client?.email || null,
      phone: client?.phone || null,
    },
  });

  // Atualizar os valores do formulário quando receber os dados do cliente
  import React from 'react';
  
  React.useEffect(() => {
    if (client && isEditing) {
      form.reset({
        name: client.name,
        location: client.location,
        email: client.email,
        phone: client.phone,
      });
    }
  }, [client, form, isEditing]);

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest('/api/clients', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response as Client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: "Cliente cadastrado",
        description: "Cliente foi cadastrado com sucesso.",
      });
      setLocation('/clients');
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cadastrar o cliente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest(`/api/clients/${clientId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response as Client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: "Cliente atualizado",
        description: "Cliente foi atualizado com sucesso.",
      });
      setLocation(`/clients/${clientId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o cliente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEditing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 gap-1" 
        onClick={() => setLocation(isEditing ? `/clients/${clientId}` : "/clients")}
      >
        <ChevronLeft className="h-4 w-4" /> 
        Voltar
      </Button>

      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Editar cliente" : "Novo cliente"}
      </h1>

      {(clientLoading && isEditing) ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
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
                    <Input 
                      placeholder="Nome do cliente" 
                      {...field} 
                    />
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
                  <FormLabel>Localização*</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Cidade, Estado" 
                      {...field} 
                    />
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
                    <Input 
                      placeholder="(00) 00000-0000" 
                      {...field} 
                      value={field.value || ""}
                    />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="cliente@email.com" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Salvando..."
                : isEditing
                  ? "Atualizar cliente"
                  : "Cadastrar cliente"
              }
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}