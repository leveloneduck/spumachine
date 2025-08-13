import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SolanaWalletProvider } from "./solana/WalletProvider";
import { Toaster as HotToaster } from "react-hot-toast";
import PageFrame from "@/components/PageFrame";
import { PinAuthProvider, usePinAuth } from "@/contexts/PinAuthContext";
import PinCodeOverlay from "@/components/PinCodeOverlay";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, isLoading } = usePinAuth();

  if (isLoading) {
    return <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Checking access...</p>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return <PinCodeOverlay />;
  }

  return (
    <>
      <PageFrame />
      <HotToaster position="top-right" />
      <Toaster />
      <Sonner />
      <SolanaWalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SolanaWalletProvider>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PinAuthProvider>
        <AppContent />
      </PinAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
