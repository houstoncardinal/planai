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
  Layers
} from "lucide-react";

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
    title: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    glow: "hover:shadow-gray-500/25"
  }
];

const quickActions = [
  {
    title: "AI Assistant",
    icon: Bot,
    color: "text-violet-500",
    bgColor: "bg-violet-100",
    glow: "hover:shadow-violet-500/25",
    href: "/ai-assistant"
  },
  {
    title: "Code Review",
    icon: Code,
    color: "text-rose-500",
    bgColor: "bg-rose-100",
    glow: "hover:shadow-rose-500/25",
    href: "/code-review"
  },
  {
    title: "Performance",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    glow: "hover:shadow-amber-500/25",
    href: "/performance"
  },
  {
    title: "Security",
    icon: Shield,
    color: "text-lime-500",
    bgColor: "bg-lime-100",
    glow: "hover:shadow-lime-500/25",
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

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DevTracker
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
                        ? `${item.bgColor} ${item.color} border-2 border-current/20 shadow-lg ${item.glow}` 
                        : "hover:bg-muted/50 hover:scale-105"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      isActive ? "shadow-md" : ""
                    }`}>
                      <Icon className={`h-4 w-4 ${item.color} transition-all duration-300 group-hover:scale-110`} />
                    </div>
                    <span className="font-medium">{item.title}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-current animate-pulse"></div>
                    )}
                  </Button>
                </Link>
              );
            })}
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
                    <div className={`w-8 h-8 rounded-lg ${action.bgColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${action.glow}`}>
                      <Icon className={`h-4 w-4 ${action.color} transition-all duration-300 group-hover:scale-110`} />
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
                    <div className={`w-6 h-6 rounded-md ${category.bgColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                      <Icon className={`h-3 w-3 ${category.color}`} />
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
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <div className="text-lg font-bold text-blue-600">24</div>
                <div className="text-xs text-blue-600/80">Active Projects</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <div className="text-lg font-bold text-green-600">156</div>
                <div className="text-xs text-green-600/80">Learnings</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <div className="text-lg font-bold text-purple-600">89%</div>
                <div className="text-xs text-purple-600/80">Avg Progress</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                <div className="text-lg font-bold text-orange-600">12</div>
                <div className="text-xs text-orange-600/80">Goals Set</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

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