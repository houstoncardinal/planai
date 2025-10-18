import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, UserPlus, Loader2, Sparkles, Zap, Target } from "lucide-react";
import { Seo } from "@/components/Seo";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created successfully!");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo 
        title="Sign In - App Planner"
        description="Sign in to access your app planning dashboard and manage your projects"
      />
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large gradient orbs */}
          <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-500/30 via-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Branding & Features */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Logo & Badge */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
                  <span className="text-sm font-medium text-white/90">AI-Powered Development Platform</span>
                </div>
                
                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                    <span className="text-white">Build.</span>{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                      Ship.
                    </span>{' '}
                    <span className="text-white">Scale.</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-slate-300/90 max-w-xl mx-auto lg:mx-0">
                    The ultimate development platform for modern teams. Plan, track, and ship projects with AI-powered insights.
                  </p>
                </div>
              </div>

              {/* Feature Cards - Hidden on mobile, shown on lg+ */}
              <div className="hidden lg:grid grid-cols-1 gap-4 pt-4">
                <div className="group relative overflow-hidden p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/50">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2 text-lg">Smart Project Management</h3>
                      <p className="text-sm text-slate-300/80">Track progress with intelligent insights and automated workflows that adapt to your team.</p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/50">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2 text-lg">AI-Powered Analysis</h3>
                      <p className="text-sm text-slate-300/80">Get real-time code insights, suggestions, and performance optimizations powered by AI.</p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/50">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2 text-lg">Continuous Learning</h3>
                      <p className="text-sm text-slate-300/80">Document insights and learnings automatically for team knowledge sharing.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats - Hidden on mobile */}
              <div className="hidden lg:flex items-center justify-center lg:justify-start gap-8 pt-4">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm text-slate-400">Active Users</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-sm text-slate-400">Projects Launched</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-slate-400">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right side - Auth form */}
            <div className="w-full">
              <div className="relative group">
                {/* Glow effect behind card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                
                <Card className="relative border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/90 overflow-hidden">
                  {/* Card header gradient */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
                  
                  <CardHeader className="text-center space-y-4 pb-6 pt-8 px-6 sm:px-8">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-pulse">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl sm:text-3xl font-bold text-white">Welcome Back</CardTitle>
                      <CardDescription className="text-base text-slate-300/80 mt-2">
                        Sign in to continue your journey
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-6 sm:px-8 pb-8">
                    <Tabs defaultValue="signin" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/50 border border-white/10 p-1">
                        <TabsTrigger 
                          value="signin" 
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-slate-400"
                        >
                          Sign In
                        </TabsTrigger>
                        <TabsTrigger 
                          value="signup"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-slate-400"
                        >
                          Sign Up
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="signin">
                        <form onSubmit={handleSignIn} className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="signin-email" className="text-sm font-medium text-white">Email Address</Label>
                            <Input
                              id="signin-email"
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              disabled={isLoading}
                              className="h-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signin-password" className="text-sm font-medium text-white">Password</Label>
                            <Input
                              id="signin-password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              disabled={isLoading}
                              minLength={6}
                              className="h-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                            />
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/60 hover:scale-[1.02]" 
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Signing in...
                              </>
                            ) : (
                              <>
                                <LogIn className="mr-2 h-5 w-5" />
                                Sign In
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="signup">
                        <form onSubmit={handleSignUp} className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="signup-name" className="text-sm font-medium text-white">Display Name</Label>
                            <Input
                              id="signup-name"
                              type="text"
                              placeholder="Your Name"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              required
                              disabled={isLoading}
                              className="h-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signup-email" className="text-sm font-medium text-white">Email Address</Label>
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              disabled={isLoading}
                              className="h-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signup-password" className="text-sm font-medium text-white">Password</Label>
                            <Input
                              id="signup-password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              disabled={isLoading}
                              minLength={6}
                              className="h-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                            />
                            <p className="text-xs text-slate-400">
                              Password must be at least 6 characters
                            </p>
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full h-12 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-[1.02]" 
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Creating account...
                              </>
                            ) : (
                              <>
                                <UserPlus className="mr-2 h-5 w-5" />
                                Create Account
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>

                    <div className="mt-8 pt-6 border-t border-white/10">
                      <p className="text-center text-xs text-slate-400">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
