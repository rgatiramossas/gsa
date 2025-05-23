import React, { createContext, useState, useEffect } from "react";
import { apiRequest } from "./queryClient";

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

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        
        if (storedUser && storedToken) {
          // Validate token by making a request to /api/users/me
          const headers = new Headers();
          headers.append("x-user-id", JSON.parse(storedUser).id);
          
          const response = await fetch("/api/users/me", {
            method: "GET",
            headers,
            credentials: "include",
          });
          
          if (response.ok) {
            setUser(JSON.parse(storedUser));
          } else {
            // Clear invalid session
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/login", { username, password });
      const data = await response.json();
      
      // Store user and token in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      
      setUser(data.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
