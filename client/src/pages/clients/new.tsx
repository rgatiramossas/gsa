import { useI18n } from "@/hooks/useI18n";
import { ClientForm } from "@/components/clients/ClientForm";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NewClient() {
  const { t } = useI18n();
  
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{t("clients.new_client")}</h2>
        <Link href="/clients">
          <Button variant="outline">{t("common.go_back")}</Button>
        </Link>
      </div>
      
      <ClientForm />
    </div>
  );
}
