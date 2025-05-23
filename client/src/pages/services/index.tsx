import { useI18n } from "@/hooks/useI18n";
import { ServiceList } from "@/components/services/ServiceList";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlusIcon } from "lucide-react";

export default function ServicesIndex() {
  const { t } = useI18n();
  
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">{t("services.title")}</h2>
          <p className="text-gray-600">{t("services.subtitle")}</p>
        </div>
        <Link href="/services/new">
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            <span>{t("services.new_service")}</span>
          </Button>
        </Link>
      </div>
      
      <ServiceList />
    </div>
  );
}
