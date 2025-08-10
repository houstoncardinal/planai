import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Learnings from "./pages/Learnings";
import Analysis from "./pages/Analysis";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import Ideas from "./pages/Ideas";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

console.log('App component loading with new layout...');

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <div className="hidden md:block">
              <AppSidebar />
            </div>
            <div className="flex-1 flex flex-col">
              <header className="hidden md:flex h-12 items-center border-b px-4">
                <SidebarTrigger />
              </header>
              <main className="flex-1 md:pt-0 pt-16 pb-20 md:pb-0">
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
          <MobileNav />
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
