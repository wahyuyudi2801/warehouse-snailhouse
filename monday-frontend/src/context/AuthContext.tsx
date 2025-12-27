/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.tsx

import { sanctumRequest } from "@/services/sanctumRequest";
import type { MerchantType } from "@/types/merchant";
import React, { createContext, useContext, useState } from "react";

// Tipe data untuk pengguna
interface User {
  id: number;
  name: string;
  role: "manager" | "keeper"; // Kunci: Peran harus sesuai dengan yang dikirim backend
  merchant: MerchantType;
}

// Tipe data untuk Auth Context
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, apiToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Komponen
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Ambil dari LocalStorage jika ada (untuk menjaga sesi setelah refresh)
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const isAuthenticated = !!user && !!token;

  const login = (userData: User, apiToken: string) => {
    setUser(userData);
    setToken(apiToken);
    // Simpan di LocalStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", apiToken);
  };

  const logout = async () => {
    try {
      await sanctumRequest("POST", "/logout");

      setUser(null);
      setToken(null);

      // Hapus dari LocalStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan saat logout.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom untuk menggunakan konteks
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
