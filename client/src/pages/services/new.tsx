import { useI18n } from "@/hooks/useI18n";
import { ServiceForm } from "@/components/services/ServiceForm";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NewService() {
  const { t } = useI18n();
  
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{t("services.new_service")}</h2>
        <Link href="/services">
          <Button variant="outline">{t("common.go_back")}</Button>
        </Link>
      </div>
      
      <ServiceForm />
    </div>
  );
}
