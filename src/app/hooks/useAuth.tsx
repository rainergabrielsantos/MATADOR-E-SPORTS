import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "Member" | "Player" | "Coach";

interface User {
  id: string;
  username: string;
  role: Role;
  csunId: string;
}

interface AuthContextType {
  user: User | null;
  login: (csunId: string, role: Role) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (csunId: string, role: Role) => {
    // Mock user creation based on login
    setUser({
      id: "1",
      username: `User_${csunId}`,
      role: role,
      csunId: csunId,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
