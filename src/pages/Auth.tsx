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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
        {/* Animated background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Branding */}
            <div className="hidden md:block space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Professional Development Planning</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-foreground">
                  Plan. Build. <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Launch.</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Strategic development planning and execution tracking for modern development teams.
                </p>
              </div>

              <div className="space-y-4 pt-8">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Project Management</h3>
                    <p className="text-sm text-muted-foreground">Track progress, manage tasks, and collaborate with your team</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">AI-Powered Insights</h3>
                    <p className="text-sm text-muted-foreground">Get intelligent recommendations and code analysis</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Learning Tracking</h3>
                    <p className="text-sm text-muted-foreground">Document learnings and insights for continuous improvement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Auth form */}
            <div className="w-full">
              <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95">
                <CardHeader className="text-center space-y-2 pb-4">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-2 shadow-lg">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">Welcome</CardTitle>
                  <CardDescription className="text-base">
                    Sign in to your account or create a new one to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                      <TabsTrigger value="signin" className="data-[state=active]:bg-background">Sign In</TabsTrigger>
                      <TabsTrigger value="signup" className="data-[state=active]:bg-background">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin">
                      <form onSubmit={handleSignIn} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">Email Address</Label>
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="h-11 bg-background border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">Password</Label>
                          <Input
                            id="signin-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength={6}
                            className="h-11 bg-background border-border"
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 font-medium shadow-lg transition-all duration-200 hover:shadow-xl" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-2 h-4 w-4" />
                              Sign In
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup">
                      <form onSubmit={handleSignUp} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name" className="text-sm font-medium text-foreground">Display Name</Label>
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Your Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            disabled={isLoading}
                            className="h-11 bg-background border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email Address</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="h-11 bg-background border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">Password</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength={6}
                            className="h-11 bg-background border-border"
                          />
                          <p className="text-xs text-muted-foreground">
                            Password must be at least 6 characters
                          </p>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 font-medium shadow-lg transition-all duration-200 hover:shadow-xl" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Create Account
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <p className="text-center text-xs text-muted-foreground">
                      By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
