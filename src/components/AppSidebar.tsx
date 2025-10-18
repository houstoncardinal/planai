import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  FolderOpen, 
  BookOpen, 
  BarChart3, 
  Target, 
  Lightbulb, 
  Settings, 
  Sparkles,
  Bot,
  Code,
  TrendingUp,
  Users,
  Database,
  Globe,
  Smartphone,
  Zap,
  Brain,
  Palette,
  Shield,
  Clock,
  Calendar,
  FileText,
  GitBranch,
  Layers,
  MessageSquare,
  LogOut,
  Mic
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    glow: "hover:shadow-blue-500/25"
  },
  {
    title: "AI Agent",
    href: "/ai-agent",
    icon: Brain,
    color: "text-green-500",
    bgColor: "bg-green-100",
    glow: "hover:shadow-green-500/25"
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderOpen,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100",
    glow: "hover:shadow-emerald-500/25"
  },
  {
    title: "Learnings",
    href: "/learnings",
    icon: BookOpen,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    glow: "hover:shadow-purple-500/25"
  },
  {
    title: "Analysis",
    href: "/analysis",
    icon: BarChart3,
    color: "text-cyan-500",
    bgColor: "bg-cyan-100",
    glow: "hover:shadow-cyan-500/25"
  },
  {
    title: "Goals",
    href: "/goals",
    icon: Target,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    glow: "hover:shadow-orange-500/25"
  },
  {
    title: "Ideas",
    href: "/ideas",
    icon: Lightbulb,
    color: "text-pink-500",
    bgColor: "bg-pink-100",
    glow: "hover:shadow-pink-500/25"
  },
  {
    title: "Insights",
    href: "/insights",
    icon: TrendingUp,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100",
    glow: "hover:shadow-indigo-500/25"
  },
  {
    title: "Voice Notes",
    href: "/voice-notes",
    icon: Mic,
    color: "text-rose-500",
    bgColor: "bg-rose-100",
    glow: "hover:shadow-rose-500/25"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    glow: "hover:shadow-gray-500/25"
  }
];

const adminNavigationItem = {
  title: "Admin",
  href: "/admin",
  icon: Shield,
  color: "text-red-500",
  bgColor: "bg-red-100",
  glow: "hover:shadow-red-500/25"
};

const quickActions = [
  {
    title: "AI Agent",
    icon: Brain,
    color: "text-green-500",
    bgColor: "bg-green-100",
    glow: "hover:shadow-green-500/25",
    href: "/ai-agent"
  },
  {
    title: "AI Chat",
    icon: MessageSquare,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    glow: "hover:shadow-purple-500/25",
    href: "/ai-chat"
  },
  {
    title: "Code Review",
    icon: Code,
    color: "text-green-500",
    bgColor: "bg-green-100",
    glow: "hover:shadow-green-500/25",
    href: "/code-review"
  },
  {
    title: "Performance",
    icon: TrendingUp,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    glow: "hover:shadow-orange-500/25",
    href: "/performance"
  },
  {
    title: "Security",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-100",
    glow: "hover:shadow-red-500/25",
    href: "/security"
  }
];

const projectCategories = [
  {
    title: "Web Development",
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    count: 12
  },
  {
    title: "Mobile Development",
    icon: Smartphone,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    count: 8
  },
  {
    title: "AI/ML",
    icon: Brain,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100",
    count: 5
  },
  {
    title: "Backend",
    icon: Database,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    count: 15
  },
  {
    title: "DevOps",
    icon: Layers,
    color: "text-cyan-500",
    bgColor: "bg-cyan-100",
    count: 6
  }
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useUserRole();
  const [stats, setStats] = useState({
    activeProjects: 0,
    learnings: 0,
    avgProgress: 0,
    goals: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load projects
      const { data: projects } = await supabase
        .from('projects')
        .select('progress, status')
        .eq('user_id', user.id);

      // Load learnings
      const { data: learnings } = await supabase
        .from('learnings')
        .select('id')
        .eq('user_id', user.id);

      // Load goals
      const { data: goals } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', user.id);

      const activeProjects = projects?.filter(p => p.status === 'active' || p.status === 'in-progress' || p.status === 'planning').length || 0;
      const avgProgress = projects?.length ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0;

      setStats({
        activeProjects,
        learnings: learnings?.length || 0,
        avgProgress,
        goals: goals?.length || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center">
          <span 
            className="font-semibold text-xl tracking-wide text-foreground"
            style={{ 
              fontFamily: 'Baskerville, "Baskerville Old Face", "Hoefler Text", Garamond, "Times New Roman", serif',
            }}
          >
            Plan.AI
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-6 py-4">
          {/* Navigation */}
          <div className="space-y-2">
            <h3 className="px-2 text-sm font-medium text-muted-foreground">Navigation</h3>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 h-11 px-3 transition-all duration-300 group ${
                      isActive 
                        ? `${item.bgColor} ${item.color} dark:bg-white dark:text-black border-2 border-current/20 shadow-lg ${item.glow}` 
                        : "hover:bg-muted/50 hover:scale-105"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.bgColor} dark:bg-white/10 ${isActive ? "dark:bg-black/20" : ""} flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      isActive ? "shadow-md" : ""
                    }`}>
                      <Icon className={`h-4 w-4 ${item.color} dark:text-white ${isActive ? "dark:text-black" : ""} transition-all duration-300 group-hover:scale-110`} />
                    </div>
                    <span className={`font-medium ${isActive ? "dark:text-black" : ""}`}>{item.title}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-current animate-pulse"></div>
                    )}
                  </Button>
                </Link>
              );
            })}
            
            {/* Admin Link - Only visible to admins */}
            {role === "admin" && (
              <Link to={adminNavigationItem.href}>
                <Button
                  variant={location.pathname === adminNavigationItem.href ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-11 px-3 transition-all duration-300 group ${
                    location.pathname === adminNavigationItem.href
                      ? `${adminNavigationItem.bgColor} ${adminNavigationItem.color} dark:bg-white dark:text-black border-2 border-current/20 shadow-lg ${adminNavigationItem.glow}` 
                      : "hover:bg-muted/50 hover:scale-105"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${adminNavigationItem.bgColor} ${location.pathname === adminNavigationItem.href ? "dark:bg-black/20" : ""} flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    location.pathname === adminNavigationItem.href ? "shadow-md" : ""
                  }`}>
                    <Shield className={`h-4 w-4 ${adminNavigationItem.color} ${location.pathname === adminNavigationItem.href ? "dark:text-black" : ""} transition-all duration-300 group-hover:scale-110`} />
                  </div>
                  <span className={`font-medium ${location.pathname === adminNavigationItem.href ? "dark:text-black" : ""}`}>{adminNavigationItem.title}</span>
                  {location.pathname === adminNavigationItem.href && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-current animate-pulse"></div>
                  )}
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h3 className="px-2 text-sm font-medium text-muted-foreground">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                
                return (
                  <Button
                    key={action.title}
                    variant="ghost"
                    className="h-16 flex-col gap-1 p-2 hover:scale-105 transition-all duration-300 group"
                    onClick={() => navigate(action.href)}
                  >
                    <div className={`w-8 h-8 rounded-lg ${action.bgColor} dark:bg-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${action.glow}`}>
                      <Icon className={`h-4 w-4 ${action.color} dark:text-white transition-all duration-300 group-hover:scale-110`} />
                    </div>
                    <span className="text-xs font-medium">{action.title}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Project Categories */}
          <div className="space-y-2">
            <h3 className="px-2 text-sm font-medium text-muted-foreground">Categories</h3>
            {projectCategories.map((category) => {
              const Icon = category.icon;
              
              return (
                <Button
                  key={category.title}
                  variant="ghost"
                  className="w-full justify-between h-10 px-3 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-md ${category.bgColor} dark:bg-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                      <Icon className={`h-3 w-3 ${category.color} dark:text-white`} />
                    </div>
                    <span className="text-sm font-medium">{category.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="space-y-2">
            <h3 className="px-2 text-sm font-medium text-muted-foreground">Recent Activity</h3>
            <div className="space-y-2">
              {[
                { action: "Project Updated", time: "2h ago", color: "text-blue-500" },
                { action: "Learning Added", time: "4h ago", color: "text-purple-500" },
                { action: "Code Analysis", time: "6h ago", color: "text-emerald-500" },
                { action: "Goal Completed", time: "1d ago", color: "text-orange-500" }
              ].map((activity, index) => (
                <div key={index} className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium group-hover:text-foreground transition-colors duration-200">
                      {activity.action}
                    </span>
                    <span className={`text-xs ${activity.color} font-medium`}>
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <h3 className="px-2 text-sm font-medium text-muted-foreground">Stats</h3>
            <div className="grid grid-cols-2 gap-2 px-2">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-600/20 border border-blue-200 dark:border-blue-500/30">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.activeProjects}</div>
                <div className="text-xs text-blue-600/80 dark:text-blue-400/80">Active Projects</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/20 dark:to-green-600/20 border border-green-200 dark:border-green-500/30">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.learnings}</div>
                <div className="text-xs text-green-600/80 dark:text-green-400/80">Learnings</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/20 dark:to-purple-600/20 border border-purple-200 dark:border-purple-500/30">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.avgProgress}%</div>
                <div className="text-xs text-purple-600/80 dark:text-purple-400/80">Avg Progress</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-500/20 dark:to-orange-600/20 border border-orange-200 dark:border-orange-500/30">
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{stats.goals}</div>
                <div className="text-xs text-orange-600/80 dark:text-orange-400/80">Goals Set</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Logout Button */}
      <div className="border-t px-3 py-2">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 h-11 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>All systems operational</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Powered by Claude AI
        </div>
      </div>
    </div>
  );
}
