import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18n } from "@/hooks/useI18n";
import { useAuth } from "@/hooks/useAuth";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Service, Client } from "@shared/schema";
import { useLocation } from "wouter";
import { ImageUploader } from "../common/ImageUploader";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Custom validation schema for service form
const serviceFormSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  vehicleName: z.string().min(1, "Vehicle is required"),
  vehiclePlate: z.string().optional(),
  vehicleChassis: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  technicianId: z.string().min(1, "Technician is required"),
  technicianName: z.string().min(1, "Technician name is required"),
  serviceType: z.string().min(1, "Service type is required"),
  serviceValue: z.string().min(1, "Service value is required"),
  administrativeValue: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  images: z.array(z.string()).optional(),
}).refine(data => data.vehiclePlate || data.vehicleChassis, {
  message: "Either plate or chassis must be provided",
  path: ["vehiclePlate"],
});

type ServiceFormProps = {
  service?: Service;
  isEditing?: boolean;
};

export function ServiceForm({ service, isEditing = false }: ServiceFormProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [images, setImages] = useState<string[]>(service?.images || []);
  
  // Fetch clients for dropdown
  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });
  
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      clientId: service ? String(service.clientId) : "",
      vehicleName: service?.vehicleName || "",
      vehiclePlate: service?.vehiclePlate || "",
      vehicleChassis: service?.vehicleChassis || "",
      date: service ? new Date(service.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      technicianId: service ? String(service.technicianId) : user ? String(user.id) : "",
      technicianName: service?.technicianName || (user ? user.name : ""),
      serviceType: service?.serviceType || "",
      serviceValue: service ? String(service.serviceValue / 100) : "",
      administrativeValue: service?.administrativeValue ? String(service.administrativeValue / 100) : "",
      status: service?.status || "pending",
      images: service?.images || [],
    },
  });
  
  const onSubmit = async (data: z.infer<typeof serviceFormSchema>) => {
    try {
      // Convert string values to appropriate types
      const formattedData = {
        ...data,
        clientId: Number(data.clientId),
        technicianId: Number(data.technicianId),
        serviceValue: Math.round(parseFloat(data.serviceValue) * 100), // Convert to cents
        administrativeValue: data.administrativeValue ? Math.round(parseFloat(data.administrativeValue) * 100) : undefined,
        images, // Use the images from state
      };
      
      if (isEditing && service) {
        // Update existing service
        await apiRequest("PATCH", `/api/services/${service.id}`, formattedData);
        queryClient.invalidateQueries({ queryKey: ['/api/services'] });
        queryClient.invalidateQueries({ queryKey: [`/api/services/${service.id}`] });
        
        toast({
          title: t("services.update_success"),
          description: t("services.service_updated"),
        });
        
        navigate(`/services/${service.id}`);
      } else {
        // Create new service
        const response = await apiRequest("POST", "/api/services", formattedData);
        const newService = await response.json();
        
        queryClient.invalidateQueries({ queryKey: ['/api/services'] });
        
        toast({
          title: t("services.create_success"),
          description: t("services.service_created"),
        });
        
        navigate(`/services/${newService.id}`);
      }
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        title: t("common.error"),
        description: t("services.save_error"),
        variant: "destructive",
      });
    }
  };
  
  const handleImageUpload = (uploadedImage: string) => {
    if (images.length < 6) {
      setImages([...images, uploadedImage]);
      form.setValue("images", [...images, uploadedImage]);
    } else {
      toast({
        title: t("services.upload_limit"),
        description: t("services.max_images_warning"),
        variant: "destructive",
      });
    }
  };
  
  const handleImageRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    form.setValue("images", newImages);
  };
  
  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("services.client")} <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("services.select_client")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={String(client.id)}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("services.vehicle")} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder={t("services.vehicle_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehiclePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("services.plate")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("services.plate_placeholder")} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("services.plate_or_chassis_required")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicleChassis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("services.chassis")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("services.chassis_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("services.date")} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="technicianName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("services.technician")} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      readOnly={user?.role !== "admin"} 
                      className={user?.role !== "admin" ? "bg-gray-100" : ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {user?.role !== "admin" && t("services.technician_auto_filled")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("services.type")} <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("services.select_type")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="street_dent">{t("services.types.street_dent")}</SelectItem>
                      <SelectItem value="hail">{t("services.types.hail")}</SelectItem>
                      <SelectItem value="other">{t("services.types.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("services.value")} (€) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {user?.role === "admin" && (
              <FormField
                control={form.control}
                name="administrativeValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("services.administrative_value")} (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>
                      {t("services.administrative_value_description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("services.status")} <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("services.select_status")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">{t("services.status.pending")}</SelectItem>
                      <SelectItem value="in_progress">{t("services.status.in_progress")}</SelectItem>
                      <SelectItem value="completed">{t("services.status.completed")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="col-span-1 md:col-span-2">
              <FormLabel className="block text-sm font-medium mb-2">
                {t("services.images")} ({t("services.max_images", { count: 6 })})
              </FormLabel>
              <ImageUploader 
                images={images} 
                onUpload={handleImageUpload}
                onRemove={handleImageRemove}
                maxImages={6}
              />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(isEditing && service ? `/services/${service.id}` : "/services")}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {isEditing ? t("common.save") : t("services.create_service")}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
