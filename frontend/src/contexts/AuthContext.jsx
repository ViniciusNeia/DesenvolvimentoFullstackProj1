import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkSession() {
    setLoading(true);
    try {
      const resp = await fetch("/api/auth/me", { credentials: "include" });
      if (!resp.ok) {
        setUser(null);
      } else {
        const data = await resp.json();
        setUser(data);
      }
    } catch (err) {
      console.error("checkSession error", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkSession();
  }, []);

  async function login(email, password) {
    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.error || "Login failed");
      }

      await checkSession();
      return true;
    } catch (err) {
      throw err;
    }
  }

  async function register(email, password, nome) {
    try {
      const resp = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, nome }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.error || "Registration failed");
      }

      await checkSession();
      return true;
    } catch (err) {
      throw err;
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("logout error", err);
    } finally {
      setUser(null);
    }
  }

  return (
      <AuthContext.Provider value={{ user, loading, login, register, logout }}>
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;