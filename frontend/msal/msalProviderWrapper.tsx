"use client"; // Mark this as a client component

import { MsalProvider, useMsal, useAccount } from "@azure/msal-react";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";
import { useEffect, useState } from "react";

const msalInstance = new PublicClientApplication(msalConfig);

export default function MsalProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
}
