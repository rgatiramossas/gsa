import { useI18n } from "@/hooks/useI18n";
import { ServiceForm } from "@/components/services/ServiceForm";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

interface EditServiceProps {
  id: string;
}

export default function EditService({ id }: EditServiceProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  
  const { data: service, isLoading } = useQuery<Service>({
    queryKey: [`/api/services/${id}`],
  });
  
  // Check if user can edit this service
  const canEdit = () => {
    if (!user || !service) return false;
    if (user.role === "admin") return true;
    return service.technicianId === user.id;
  };
  
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {isLoading ? t("common.loading") : t("services.edit_service")}
        </h2>
        <Link href={`/services/${id}`}>
          <Button variant="outline">{t("common.go_back")}</Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-md w-full"></div>
          <div className="h-40 bg-gray-200 rounded-md w-full"></div>
        </div>
      ) : service ? (
        canEdit() ? (
          <ServiceForm service={service} isEditing={true} />
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">{t("common.unauthorized")}</h3>
            <p className="text-gray-500">{t("services.cannot_edit")}</p>
            <Link href={`/services/${id}`}>
              <Button className="mt-4">{t("common.go_back")}</Button>
            </Link>
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">{t("services.not_found")}</h3>
          <p className="text-gray-500">{t("services.not_found_description")}</p>
          <Link href="/services">
            <Button className="mt-4">{t("common.go_back_to_services")}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
