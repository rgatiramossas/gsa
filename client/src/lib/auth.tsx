import React, { createContext, useState, useEffect } from "react";

type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  role: "admin" | "technician" | "manager";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

// Usuário padrão para demonstração
const DEFAULT_ADMIN_USER: User = {
  id: 1,
  username: "admin",
  name: "Administrador",
  email: "admin@eurodentexperts.com",
  role: "admin"
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Verificar sessão local
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    
    try {
      // Verificação de login simplificada para demonstração
      if (username === "admin" && password === "password") {
        localStorage.setItem("user", JSON.stringify(DEFAULT_ADMIN_USER));
        setUser(DEFAULT_ADMIN_USER);
        return;
      }
      
      throw new Error("Credenciais inválidas");
    } catch (error) {
      console.error("Erro de login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
