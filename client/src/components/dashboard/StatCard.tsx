import { Card } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";
import { Link } from "wouter";

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  linkUrl: string;
  linkText: string;
  iconColor: string;
  iconBgColor: string;
};

export function StatCard({
  icon,
  title,
  value,
  linkUrl,
  linkText,
  iconColor,
  iconBgColor,
}: StatCardProps) {
  const { t } = useI18n();
  
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start p-4">
        <div className={`w-12 h-12 rounded ${iconBgColor} flex items-center justify-center mr-3`}>
          <div className={`${iconColor} text-xl`}>{icon}</div>
        </div>
        <div className="flex-1">
          <h3 className="text-gray-500 font-medium">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
      <div className="border-t border-gray-100 p-2">
        <Link href={linkUrl}>
          <a className="text-primary text-sm flex items-center">
            <span>{linkText}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1 h-3 w-3"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        </Link>
      </div>
    </Card>
  );
}
