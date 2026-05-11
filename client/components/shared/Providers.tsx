"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/lib/store/store";
import { ThemeProvider } from "./ThemeProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import dynamic from "next/dynamic";

const NextTopLoader = dynamic(() => import("nextjs-toploader"), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* Replace this with your actual Google Client ID from Google Cloud Console */}
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"}>
            <NextTopLoader color="hsl(var(--primary))" showSpinner={false} shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))" />
            {children}
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}