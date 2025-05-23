import { useLocation, Link } from "wouter";
import { useI18n } from "@/hooks/useI18n";
import { 
  HomeIcon, 
  Users, 
  Drill, 
  FileText 
} from "lucide-react";

export function BottomNavigation() {
  const [location] = useLocation();
  const { t } = useI18n();
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path === "/" && location === "/dashboard") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };
  
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-secondary text-white shadow-lg z-10">
      <div className="flex justify-around">
        <Link href="/dashboard">
          <a className={`flex flex-col items-center py-2 px-4 w-1/4 text-center ${isActive("/") ? "bg-secondary-dark" : ""}`}>
            <HomeIcon className="h-5 w-5" />
            <span className="text-xs mt-1">{t("navigation.dashboard")}</span>
          </a>
        </Link>
        
        <Link href="/clients">
          <a className={`flex flex-col items-center py-2 px-4 w-1/4 text-center ${isActive("/clients") ? "bg-secondary-dark" : ""}`}>
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">{t("navigation.clients")}</span>
          </a>
        </Link>
        
        <Link href="/services">
          <a className={`flex flex-col items-center py-2 px-4 w-1/4 text-center ${isActive("/services") ? "bg-secondary-dark" : ""}`}>
            <Drill className="h-5 w-5" />
            <span className="text-xs mt-1">{t("navigation.services")}</span>
          </a>
        </Link>
        
        <Link href="/budget">
          <a className={`flex flex-col items-center py-2 px-4 w-1/4 text-center ${isActive("/budget") ? "bg-secondary-dark" : ""}`}>
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">{t("navigation.budget")}</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
