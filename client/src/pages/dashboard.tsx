import { useI18n } from "@/hooks/useI18n";
import { StatCard } from "@/components/dashboard/StatCard";
import { ServicesList } from "@/components/dashboard/ServicesList";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ClockIcon, ClipboardListIcon, CheckIcon, EuroIcon, PlusIcon, UserPlusIcon, FileTextIcon } from "lucide-react";

export default function Dashboard() {
  const { t } = useI18n();
  
  const { data: stats, isLoading } = useQuery<{
    pendingServices: number;
    inProgressServices: number;
    completedServices: number;
    totalRevenue: number;
  }>({
    queryKey: ['/api/dashboard/stats'],
  });
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">{t("dashboard.title")}</h2>
        <p className="text-gray-600">{t("dashboard.subtitle")}</p>
      </div>
      
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          icon={<ClockIcon />}
          title={t("dashboard.pending_services")}
          value={isLoading ? "..." : stats?.pendingServices.toString() || "0"}
          linkUrl="/services"
          linkText={t("dashboard.view_details")}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
        
        <StatCard
          icon={<ClipboardListIcon />}
          title={t("dashboard.in_progress_services")}
          value={isLoading ? "..." : stats?.inProgressServices.toString() || "0"}
          linkUrl="/services"
          linkText={t("dashboard.view_details")}
          iconColor="text-gray-600"
          iconBgColor="bg-gray-100"
        />
        
        <StatCard
          icon={<CheckIcon />}
          title={t("dashboard.completed_services")}
          value={isLoading ? "..." : stats?.completedServices.toString() || "0"}
          linkUrl="/services"
          linkText={t("dashboard.view_details")}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        
        <StatCard
          icon={<EuroIcon />}
          title={t("dashboard.revenue")}
          value={isLoading ? "..." : formatCurrency(stats?.totalRevenue || 0)}
          linkUrl="/services"
          linkText={t("dashboard.view_details")}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link href="/services/new">
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary-dark">
            <PlusIcon className="h-4 w-4" />
            <span>{t("services.new_service")}</span>
          </Button>
        </Link>
        
        <Link href="/clients/new">
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <UserPlusIcon className="h-4 w-4" />
            <span>{t("clients.new_client")}</span>
          </Button>
        </Link>
        
        <Link href="/budget">
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <FileTextIcon className="h-4 w-4" />
            <span>{t("budget.title")}</span>
          </Button>
        </Link>
      </div>
      
      {/* Recent Services */}
      <ServicesList />
      
      {/* Performance Chart */}
      <PerformanceChart />
    </div>
  );
}
