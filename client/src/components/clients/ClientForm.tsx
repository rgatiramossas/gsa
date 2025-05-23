import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@shared/schema";
import { useLocation } from "wouter";

// Extend the client schema with form validations
const clientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

type ClientFormProps = {
  client?: Client;
  isEditing?: boolean;
};

export function ClientForm({ client, isEditing = false }: ClientFormProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const form = useForm<z.infer<typeof clientFormSchema>>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client?.name || "",
      location: client?.location || "",
      email: client?.email || "",
      phone: client?.phone || "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof clientFormSchema>) => {
    try {
      if (isEditing && client) {
        // Update existing client
        await apiRequest("PATCH", `/api/clients/${client.id}`, data);
        queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
        queryClient.invalidateQueries({ queryKey: [`/api/clients/${client.id}`] });
        
        toast({
          title: t("clients.update_success"),
          description: t("clients.client_updated"),
        });
        
        navigate(`/clients/${client.id}`);
      } else {
        // Create new client
        const response = await apiRequest("POST", "/api/clients", data);
        const newClient = await response.json();
        
        queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
        
        toast({
          title: t("clients.create_success"),
          description: t("clients.client_created"),
        });
        
        navigate(`/clients/${newClient.id}`);
      }
    } catch (error) {
      console.error("Error saving client:", error);
      toast({
        title: t("common.error"),
        description: t("clients.save_error"),
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>{t("clients.name")} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder={t("clients.name_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>{t("clients.location")} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder={t("clients.location_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>{t("clients.email")}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t("clients.email_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>{t("clients.phone")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("clients.phone_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mt-6 pt-4 border-t flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(isEditing && client ? `/clients/${client.id}` : "/clients")}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {isEditing ? t("common.save") : t("clients.create_client")}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
