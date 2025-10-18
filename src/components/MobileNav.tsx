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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 
                className="text-lg font-bold text-foreground"
                style={{ 
                  fontFamily: 'Baskerville, "Baskerville Old Face", "Hoefler Text", Garamond, "Times New Roman", serif',
                }}
              >
                Plan.AI
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">AI-Powered Project Platform</p>
            </div>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white p-0 border-l border-gray-200">
              <div className="flex flex-col h-full">
                {/* Clean Header with User Profile */}
                <div className="border-b border-gray-200 bg-white">
                  <div className="px-6 pt-6 pb-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <h2 
                        className="text-2xl font-bold text-black"
                        style={{ 
                          fontFamily: 'Baskerville, "Baskerville Old Face", "Hoefler Text", Garamond, "Times New Roman", serif',
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
                      className="w-full bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-200 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-gray-300 group-hover:border-black transition-colors">
                          <AvatarFallback className="bg-black text-white font-bold text-base">
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-black">
                            {userName}
                          </h3>
                          <p className="text-xs text-gray-600 truncate">
                            {userEmail}
                          </p>
                        </div>
                        <Settings className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Navigation Section */}
                <div className="flex-1 overflow-y-auto py-4 px-4">
                  
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.title}
                        to={item.url}
                        end={item.url === "/"}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                            isActive
                              ? `bg-gradient-to-r ${item.bgColor} ${item.color} font-semibold shadow-lg border-l-4 border-current`
                              : "text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md hover:translate-x-1"
                          }`
                        }
                      >
                        <div className={`w-11 h-11 rounded-xl ${item.bgColor} flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-110`}>
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <span className="text-sm font-semibold">{item.title}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                
                {/* Theme Selector */}
                <div className="px-4 py-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Theme
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                        theme === "light"
                          ? "border-black bg-gray-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Sun className={`h-5 w-5 ${theme === "light" ? "text-black" : "text-gray-600"}`} />
                      <span className={`text-xs font-medium ${theme === "light" ? "text-black" : "text-gray-600"}`}>
                        Light
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                        theme === "dark"
                          ? "border-black bg-gray-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Moon className={`h-5 w-5 ${theme === "dark" ? "text-black" : "text-gray-600"}`} />
                      <span className={`text-xs font-medium ${theme === "dark" ? "text-black" : "text-gray-600"}`}>
                        Dark
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setTheme("system")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                        theme === "system"
                          ? "border-black bg-gray-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Monitor className={`h-5 w-5 ${theme === "system" ? "text-black" : "text-gray-600"}`} />
                      <span className={`text-xs font-medium ${theme === "system" ? "text-black" : "text-gray-600"}`}>
                        System
                      </span>
                    </button>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                
                {/* Bottom Section with Settings & Sign Out */}
                <div className="p-4 space-y-2 bg-gradient-to-t from-slate-100 to-transparent">
                  <NavLink
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? "bg-gradient-to-r bg-gray-100 text-gray-700 font-semibold shadow-lg border-l-4 border-gray-500"
                          : "text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md hover:translate-x-1"
                      }`
                    }
                  >
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                      <Settings className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-sm font-semibold">Settings</span>
                  </NavLink>
                  
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-3 px-4 py-3.5 h-auto rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-lg hover:translate-x-1 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold">Sign Out</span>
                  </Button>

                  {/* Footer Info */}
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                        <span className="text-xs font-medium text-gray-600">All systems operational</span>
                      </div>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Powered by Claude AI
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Bottom Bar - Simplified to 4 items */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const isActiveItem = isActive(item.url);
            const Icon = item.icon;
            
            if (item.url === "#") {
              // More button opens the sheet
              return (
                <Sheet key={item.title} open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <button className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50">
                      <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center transition-all duration-200`}>
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{item.title}</span>
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
                  isActiveItem ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center transition-all duration-200 ${
                  isActiveItem ? 'shadow-md scale-110' : ''
                }`}>
                  <Icon className={`h-5 w-5 ${item.color} ${isActiveItem ? 'scale-110' : ''}`} />
                </div>
                <span className={`text-xs font-medium ${isActiveItem ? item.color : 'text-gray-600'}`}>
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
