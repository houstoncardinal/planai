import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  FolderOpen, 
  BookOpen, 
  BarChart3, 
  Target,
  Lightbulb,
  Settings,
  Menu,
  Brain,
  TrendingUp,
  Mic,
  LogOut,
  User,
  Mail,
  Crown,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home, color: "text-blue-500", bgColor: "bg-blue-100" },
  { title: "AI Agent", url: "/ai-agent", icon: Brain, color: "text-green-500", bgColor: "bg-green-100" },
  { title: "Projects", url: "/projects", icon: FolderOpen, color: "text-emerald-500", bgColor: "bg-emerald-100" },
  { title: "Learnings", url: "/learnings", icon: BookOpen, color: "text-purple-500", bgColor: "bg-purple-100" },
  { title: "Analysis", url: "/analysis", icon: BarChart3, color: "text-cyan-500", bgColor: "bg-cyan-100" },
  { title: "Goals", url: "/goals", icon: Target, color: "text-orange-500", bgColor: "bg-orange-100" },
  { title: "Ideas", url: "/ideas", icon: Lightbulb, color: "text-pink-500", bgColor: "bg-pink-100" },
  { title: "Insights", url: "/insights", icon: TrendingUp, color: "text-indigo-500", bgColor: "bg-indigo-100" },
  { title: "Voice Notes", url: "/voice-notes", icon: Mic, color: "text-rose-500", bgColor: "bg-rose-100" },
];

const bottomNavItems = [
  { title: "Home", url: "/", icon: Home, color: "text-blue-500", bgColor: "bg-blue-100" },
  { title: "Projects", url: "/projects", icon: FolderOpen, color: "text-emerald-500", bgColor: "bg-emerald-100" },
  { title: "Voice Notes", url: "/voice-notes", icon: Mic, color: "text-rose-500", bgColor: "bg-rose-100" },
  { title: "More", url: "#", icon: Menu, color: "text-gray-500", bgColor: "bg-gray-100" },
];

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        // Extract name from email or use metadata
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    } catch (error) {
      console.error('Error loading user info:', error);
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 
                className="text-xl font-bold tracking-tight"
                style={{ 
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #14B8A6 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em',
                }}
              >
                Plan.AI
              </h1>
            </div>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background p-0 border-l border-border">
              <div className="flex flex-col h-full">
                {/* Clean Header with User Profile */}
                <div className="border-b border-border bg-background">
                  <div className="px-4 pt-4 pb-3">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-4">
                      <h2 
                        className="text-2xl font-bold tracking-tight"
                        style={{ 
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontWeight: 800,
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #14B8A6 100%)',
                          backgroundSize: '200% 100%',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        Plan.AI
                      </h2>
                    </div>

                    {/* User Profile Card - Interactive */}
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full bg-muted/50 hover:bg-muted rounded-lg p-3 border border-border transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10 border-2 border-border group-hover:border-primary transition-colors">
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm truncate">
                            {userName}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {userEmail}
                          </p>
                        </div>
                        <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Navigation Section */}
                <div className="flex-1 overflow-y-auto py-2 px-3">
                  <nav className="space-y-0.5">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.title}
                        to={item.url}
                        end={item.url === "/"}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-foreground hover:bg-muted"
                          }`
                        }
                      >
                        <div className={`w-8 h-8 rounded-lg ${item.bgColor} dark:bg-primary/20 flex items-center justify-center`}>
                          <item.icon className={`h-4 w-4 ${item.color} dark:text-primary`} />
                        </div>
                        <span className="text-sm">{item.title}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>

                <Separator />
                
                {/* Theme Selector */}
                <div className="px-3 py-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                        theme === "light"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <Sun className={`h-4 w-4 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs ${theme === "light" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                        Light
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                        theme === "dark"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <Moon className={`h-4 w-4 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs ${theme === "dark" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                        Dark
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setTheme("system")}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                        theme === "system"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <Monitor className={`h-4 w-4 ${theme === "system" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs ${theme === "system" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                        System
                      </span>
                    </button>
                  </div>
                </div>

                <Separator />
                
                {/* Bottom Section with Settings & Sign Out */}
                <div className="p-3 space-y-1">
                  <NavLink
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`
                    }
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Settings</span>
                  </NavLink>
                  
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2 px-3 py-2 h-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Sign Out</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Bottom Bar - Simplified to 4 items */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const isActiveItem = isActive(item.url);
            const Icon = item.icon;
            
            if (item.url === "#") {
              // More button opens the sheet
              return (
                <Sheet key={item.title} open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <button className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-muted">
                      <div className={`w-10 h-10 rounded-xl ${item.bgColor} dark:bg-primary/20 flex items-center justify-center transition-all duration-200`}>
                        <Icon className={`h-5 w-5 ${item.color} dark:text-primary`} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{item.title}</span>
                    </button>
                  </SheetTrigger>
                </Sheet>
              );
            }
            
            return (
              <button
                key={item.title}
                onClick={() => navigate(item.url)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActiveItem ? 'bg-muted' : 'hover:bg-muted'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${item.bgColor} dark:bg-primary/20 flex items-center justify-center transition-all duration-200 ${
                  isActiveItem ? 'shadow-md scale-110' : ''
                }`}>
                  <Icon className={`h-5 w-5 ${item.color} dark:text-primary ${isActiveItem ? 'scale-110' : ''}`} />
                </div>
                <span className={`text-xs font-medium ${isActiveItem ? item.color + ' dark:text-primary' : 'text-muted-foreground'}`}>
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
