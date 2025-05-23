import { useI18n } from "@/hooks/useI18n";
import { ClientList } from "@/components/clients/ClientList";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlusIcon } from "lucide-react";

export default function ClientsIndex() {
  const { t } = useI18n();
  
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">{t("clients.title")}</h2>
          <p className="text-gray-600">{t("clients.subtitle")}</p>
        </div>
        <Link href="/clients/new">
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            <span>{t("clients.new_client")}</span>
          </Button>
        </Link>
      </div>
      
      <ClientList />
    </div>
  );
}
