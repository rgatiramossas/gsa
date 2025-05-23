import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent } from "@/components/ui/card";
import { FileTextIcon } from "lucide-react";

// This is a placeholder page for the future budget/quotes feature
export default function BudgetIndex() {
  const { t } = useI18n();
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">{t("budget.title")}</h2>
        <p className="text-gray-600">{t("budget.subtitle")}</p>
      </div>
      
      <Card className="md:max-w-md mx-auto">
        <CardContent className="pt-6 text-center py-12">
          <FileTextIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">{t("budget.coming_soon")}</h3>
          <p className="text-gray-500">{t("budget.description")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
