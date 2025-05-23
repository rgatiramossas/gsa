import { useI18n } from "@/hooks/useI18n";
import { ClientForm } from "@/components/clients/ClientForm";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Client } from "@shared/schema";

interface EditClientProps {
  id: string;
}

export default function EditClient({ id }: EditClientProps) {
  const { t } = useI18n();
  
  const { data: client, isLoading } = useQuery<Client>({
    queryKey: [`/api/clients/${id}`],
  });
  
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {isLoading ? t("common.loading") : t("clients.edit_client_name", { name: client?.name })}
        </h2>
        <Link href={`/clients/${id}`}>
          <Button variant="outline">{t("common.go_back")}</Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-md w-full"></div>
          <div className="h-40 bg-gray-200 rounded-md w-full"></div>
        </div>
      ) : client ? (
        <ClientForm client={client} isEditing={true} />
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">{t("clients.not_found")}</h3>
          <p className="text-gray-500">{t("clients.not_found_description")}</p>
          <Link href="/clients">
            <Button className="mt-4">{t("common.go_back_to_clients")}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
