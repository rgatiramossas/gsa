import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Client, insertClientSchema } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/layout/AppShell";
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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

// Estender o schema para validação do formulário
const formSchema = insertClientSchema.extend({
  // Os campos obrigatórios já estão definidos no schema original
});

export default function ClientFormPage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const params = useParams<{ id?: string }>();
  const [_, isEditPage] = useRoute("/clients/edit/:id");
  
  const isEditing = isEditPage && params.id;
  const clientId = isEditing && params.id ? parseInt(params.id, 10) : undefined;
  
  const { data: clientData, isLoading } = useQuery<Client>({
    queryKey: ['/api/clients', clientId],
    enabled: isAuthenticated && isEditing && clientId !== undefined,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      email: "",
      phone: "",
    },
  });

  // Atualizar os valores do formulário ao carregar os dados do cliente
  useEffect(() => {
    if (clientData) {
      form.reset({
        name: clientData.name,
        location: clientData.location,
        email: clientData.email || "",
        phone: clientData.phone || "",
      });
    }
  }, [clientData, form]);

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return apiRequest('/api/clients', 'POST', values);
    },
    onSuccess: () => {
      toast({
        title: "Cliente cadastrado",
        description: "O cliente foi cadastrado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      setLocation("/clients");
    },
    onError: (error) => {
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Ocorreu um erro ao cadastrar o cliente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return apiRequest(`/api/clients/${clientId}`, 'PATCH', values);
    },
    onSuccess: () => {
      toast({
        title: "Cliente atualizado",
        description: "O cliente foi atualizado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      if (clientId) {
        queryClient.invalidateQueries({ queryKey: ['/api/clients', clientId] });
      }
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

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AppShell>
      <div className="container px-4 py-6 max-w-md mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4 p-0 flex items-center gap-1 hover:bg-transparent"
          onClick={() => isEditing ? setLocation(`/clients/${clientId}`) : setLocation("/clients")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>

        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? "Editar Cliente" : "Novo Cliente"}
        </h1>

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
            
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Salvando..." : isEditing ? "Atualizar" : "Cadastrar"}
            </Button>
          </form>
        </Form>
      </div>
    </AppShell>
  );
}