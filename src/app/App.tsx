import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./hooks/useAuth";
import { NotificationProvider } from "./context/NotificationContext";
import { Toaster } from "./components/ui/sonner";
import { isFirebaseInitialized } from "../lib/firebase";
import { AlertCircle } from "lucide-react";

export default function App() {
  if (!isFirebaseInitialized) {
    return (
      <div className="min-h-screen bg-[#0d0d12] flex flex-col items-center justify-center p-6">
        <div className="bg-[#131318] border border-red-500/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase italic tracking-wider">
            Configuration <span className="text-red-500">Error</span>
          </h1>
          <p className="text-[#a8b2bf] text-sm leading-relaxed">
            The application failed to connect to Firebase. This usually happens when the application is deployed to Vercel but the <strong>Environment Variables</strong> have not been added to the project settings.
          </p>
          <div className="text-left bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
            <p className="text-xs font-bold text-white uppercase mb-2">Required Variables:</p>
            <ul className="text-xs text-[#a8b2bf] space-y-1 font-mono">
              <li>VITE_FIREBASE_API_KEY</li>
              <li>VITE_FIREBASE_AUTH_DOMAIN</li>
              <li>VITE_FIREBASE_PROJECT_ID</li>
              <li>VITE_FIREBASE_STORAGE_BUCKET</li>
              <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>VITE_FIREBASE_APP_ID</li>
            </ul>
          </div>
          <p className="text-xs text-red-400">
            Please add these to your Vercel Dashboard and trigger a redeployment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
        <Toaster />
      </NotificationProvider>
    </AuthProvider>
  );
}
