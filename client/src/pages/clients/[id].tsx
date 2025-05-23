import { useI18n } from "@/hooks/useI18n";
import { ClientDetail } from "@/components/clients/ClientDetail";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Client } from "@shared/schema";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClientPageProps {
  id: string;
}

export default function ClientPage({ id }: ClientPageProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { data: client, isLoading } = useQuery<Client>({
    queryKey: [`/api/clients/${id}`],
  });
  
  const handleDeleteClient = async () => {
    try {
      await apiRequest("DELETE", `/api/clients/${id}`, undefined);
      
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      
      toast({
        title: t("clients.delete_success"),
        description: t("clients.client_deleted"),
      });
      
      window.location.href = "/clients";
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: t("common.error"),
        description: t("clients.delete_error"),
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {isLoading ? t("common.loading") : client?.name}
          <span className="text-sm text-gray-500 font-normal ml-2">
            {t("common.details")}
          </span>
        </h2>
        <div className="flex space-x-2">
          <Link href="/clients">
            <Button variant="outline">{t("common.go_back")}</Button>
          </Link>
          <Link href={`/clients/edit/${id}`}>
            <Button variant="default" className="bg-primary text-white">
              {t("clients.edit_client")}
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
          >
            {t("clients.delete_client")}
          </Button>
        </div>
      </div>
      
      <ClientDetail clientId={id} />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("clients.confirm_delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("clients.delete_warning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-destructive text-destructive-foreground">
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
