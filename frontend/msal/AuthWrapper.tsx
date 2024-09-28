// components/AuthWrapper.tsx
"use client";

import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { loginRequest } from "./msalConfig";

import Login from "@/app/login/login";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { instance, accounts } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [accounts]);

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((error) => {
      console.error("Login failed:", error);
    });
  };

  if (!isAuthenticated) {
    return (
      <Login />
    );
  }

  return <>
    {children}
  </>;
}
