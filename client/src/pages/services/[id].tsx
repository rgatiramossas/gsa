import { useI18n } from "@/hooks/useI18n";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";

interface ServicePageProps {
  id: string;
}

export default function ServicePage({ id }: ServicePageProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  
  const { data: service, isLoading } = useQuery<Service>({
    queryKey: [`/api/services/${id}`],
  });
  
  // Check if user can modify this service
  const canModify = () => {
    if (!user || !service) return false;
    if (user.role === "admin") return true;
    return service.technicianId === user.id;
  };
  
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {isLoading ? t("common.loading") : t("services.service_detail")}
          <span className="text-sm text-gray-500 font-normal ml-2">
            ID: {id}
          </span>
        </h2>
        <div className="flex space-x-2">
          <Link href="/services">
            <Button variant="outline">{t("common.go_back")}</Button>
          </Link>
          
          {!isLoading && service && canModify() && (
            <Link href={`/services/edit/${id}`}>
              <Button variant="default" className="bg-primary text-white">
                {t("services.edit_service")}
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <ServiceDetail serviceId={id} />
    </div>
  );
}
