import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Client } from "@shared/schema";
import { PlusIcon, SearchIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

export function ClientList() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });
  
  // Filter clients based on search term
  const filteredClients = clients?.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded-md w-full"></div>
        <div className="h-20 bg-gray-200 rounded-md w-full"></div>
        <div className="h-20 bg-gray-200 rounded-md w-full"></div>
        <div className="h-20 bg-gray-200 rounded-md w-full"></div>
      </div>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      {/* Search and filter */}
      <div className="p-4 border-b">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={t("clients.search_placeholder")}
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Clients list */}
      {filteredClients && filteredClients.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {filteredClients.map((client) => (
            <li key={client.id} className="hover:bg-gray-50">
              <Link href={`/clients/${client.id}`}>
                <a className="block p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{client.name}</h3>
                      <p className="text-sm text-gray-600">{client.location}</p>
                    </div>
                    <div className="flex items-center">
                      <ChevronRightIcon className="text-gray-400 h-5 w-5" />
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <p>{t("clients.no_clients_found")}</p>
        </div>
      )}
    </Card>
  );
}
