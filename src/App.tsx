import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/MobileNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TutorialProvider, TutorialOverlay } from "@/components/TutorialSystem";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Learnings from "@/pages/Learnings";
import Analysis from "@/pages/Analysis";
import Goals from "@/pages/Goals";
import Insights from "@/pages/Insights";
import Ideas from "@/pages/Ideas";
import Settings from "@/pages/Settings";
import AIAssistantPage from "@/pages/AIAssistant";
import AIChat from "@/pages/AIChat";
import CodeReviewPage from "@/pages/CodeReview";
import PerformancePage from "@/pages/Performance";
import SecurityPage from "@/pages/Security";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import VoiceNotes from "@/pages/VoiceNotes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <TutorialProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen w-full bg-background">
                      <div className="hidden lg:block">
                        <AppSidebar />
                      </div>
                      <div className="flex-1 flex flex-col w-full min-w-0">
                        <header className="hidden lg:flex h-12 items-center border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
                          <SidebarTrigger />
                        </header>
                        <main className="flex-1 w-full pt-14 pb-20 lg:pt-0 lg:pb-0 overflow-x-hidden">
                          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                            <Routes>
                              <Route path="/" element={<Index />} />
                              <Route path="/projects" element={<Projects />} />
                              <Route path="/projects/:id" element={<ProjectDetail />} />
                              <Route path="/learnings" element={<Learnings />} />
                              <Route path="/analysis" element={<Analysis />} />
                              <Route path="/goals" element={<Goals />} />
                              <Route path="/insights" element={<Insights />} />
                              <Route path="/ideas" element={<Ideas />} />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/ai-assistant" element={<AIAssistantPage />} />
                              <Route path="/ai-chat" element={<AIChat />} />
                              <Route path="/code-review" element={<CodeReviewPage />} />
                              <Route path="/performance" element={<PerformancePage />} />
                              <Route path="/security" element={<SecurityPage />} />
                              <Route path="/voice-notes" element={<VoiceNotes />} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </div>
                        </main>
                      </div>
                    </div>
                    <MobileNav />
                    <TutorialOverlay />
                  </ProtectedRoute>
                } />
              </Routes>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </TutorialProvider>
  </ErrorBoundary>
);

export default App;
