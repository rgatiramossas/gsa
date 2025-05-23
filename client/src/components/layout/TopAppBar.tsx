import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, EuroIcon, Calendar, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

export function TopAppBar() {
  const { user, logout } = useAuth();
  const { t, locale, setLocale, locales } = useI18n();
  const [, setLocation] = useLocation();
  
  const handleLogout = () => {
    logout();
    setLocation("/login");
  };
  
  // Create initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <h1 className="text-xl font-semibold">Euro Dent Experts</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-full hover:bg-primary-dark transition-colors">
              <Globe className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((l) => (
                <DropdownMenuItem
                  key={l.value}
                  onClick={() => setLocale(l.value)}
                  className={locale === l.value ? "bg-muted" : ""}
                >
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Currency display (just for UI, no dropdown) */}
          <button className="p-2 rounded-full hover:bg-primary-dark transition-colors">
            <EuroIcon className="h-5 w-5" />
          </button>
          
          {/* Calendar (just for UI, no dropdown) */}
          <button className="p-2 rounded-full hover:bg-primary-dark transition-colors">
            <Calendar className="h-5 w-5" />
          </button>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center">
              <div className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center">
                <span className="font-semibold">{user ? getInitials(user.name) : "U"}</span>
              </div>
              <span className="ml-2 hidden md:inline">{user?.name}</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-gray-500">
                {t("common.role")}: {t(`roles.${user?.role}`)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                {t("auth.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
