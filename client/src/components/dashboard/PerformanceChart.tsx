import { useI18n } from "@/hooks/useI18n";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartBarIcon } from "lucide-react";

// Sample data (mocked for now, would be replaced with API data)
const performanceData = [
  { name: "A. Silva", completed: 12, pending: 2, cancelled: 1 },
  { name: "M. Müller", completed: 8, pending: 3, cancelled: 0 },
  { name: "J. Santos", completed: 15, pending: 1, cancelled: 2 },
  { name: "T. Schmidt", completed: 10, pending: 4, cancelled: 1 },
];

export function PerformanceChart() {
  const { t } = useI18n();
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{t("dashboard.team_performance")}</h3>
      
      {performanceData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar 
                dataKey="completed" 
                name={t("dashboard.completed_services")}
                fill="hsl(var(--chart-4))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="pending" 
                name={t("dashboard.pending_services")}
                fill="hsl(var(--chart-3))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="cancelled" 
                name={t("dashboard.cancelled_services")}
                fill="hsl(var(--chart-1))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <ChartBarIcon className="mx-auto h-12 w-12 mb-3" />
            <p>{t("dashboard.no_performance_data")}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
