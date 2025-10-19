import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Mic, 
  FolderOpen, 
  Target, 
  Lightbulb, 
  BookOpen,
  Sparkles,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Code,
  ArrowRight,
  Check,
  Star,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/Seo';

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: 'Context-Aware AI Agent',
      description: 'An intelligent assistant that knows your entire workspace - projects, goals, learnings, and ideas.',
      color: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500'
    },
    {
      icon: Mic,
      title: 'Voice to Task Intelligence',
      description: 'Speak naturally and watch AI convert your ideas into structured tasks with priorities and deadlines.',
      color: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500'
    },
    {
      icon: FolderOpen,
      title: 'Comprehensive Project Management',
      description: 'Track projects with rich details, team management, budget tracking, and time logging.',
      color: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500'
    },
    {
      icon: Target,
      title: 'Goal Setting & Tracking',
      description: 'Set ambitious goals, track meaningful progress, and celebrate achievements.',
      color: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500'
    },
    {
      icon: BookOpen,
      title: 'Learning Documentation',
      description: 'Document your growth, track your knowledge, and build your personal knowledge base.',
      color: 'from-indigo-500 to-purple-500',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500'
    },
    {
      icon: Lightbulb,
      title: 'Idea Management',
      description: 'Capture inspiration instantly, organize by priority, and nurture innovation.',
      color: 'from-yellow-500 to-orange-500',
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500'
    }
  ];

  const benefits = [
    '30% More Productive',
    'Reduced Stress',
    'Faster Learning',
    'Better Decisions',
    'Clear Progress',
    'Team Collaboration'
  ];

  const testimonials = [
    {
      quote: "Plan.AI transformed how we build software. The AI-powered insights have accelerated our development cycle by 3x.",
      author: "Sarah Chen",
      role: "CTO at TechVentures",
      avatar: "SC"
    },
    {
      quote: "The voice-to-task feature is a game changer. I can capture ideas while commuting and they're organized by the time I get to my desk.",
      author: "Marcus Rodriguez",
      role: "Freelance Developer",
      avatar: "MR"
    },
    {
      quote: "Finally, a project management tool that understands developers. The learning documentation feature alone is worth it.",
      author: "Priya Patel",
      role: "Team Lead at StartupCo",
      avatar: "PP"
    }
  ];

  return (
    <>
      <Seo 
        title="Plan.AI - AI-Powered Project Management"
        description="Transform your ideas into reality with AI-powered project management that learns from you and grows with you."
      />
      
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <motion.h1 
                  className="text-3xl font-bold tracking-tight"
                  style={{ 
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #14B8A6 100%)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 30px rgba(16, 185, 129, 0.5))',
                    letterSpacing: '-0.02em',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  Plan.AI
                </motion.h1>
              </Link>
              <div className="flex items-center gap-4">
                <Link to="/auth">
                  <Button variant="ghost" className="text-white hover:text-green-400">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/50">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-transparent" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div 
              className="text-center space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Project Management
              </Badge>
              
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
                Transform Ideas Into
                <br />
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Reality with AI
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                The intelligent workspace that understands you. Manage projects, track goals, document learnings, and capture ideas - all powered by advanced AI that learns from your work patterns.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-2xl shadow-green-500/50 text-lg px-8 py-6">
                    Start Free Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6">
                  Watch Demo
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Free forever plan
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Setup in 2 minutes
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent to-green-500/5">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mb-4">
                Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything You Need to
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Succeed</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Powerful features designed for developers, teams, and entrepreneurs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 h-full">
                      <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mb-4">
                  Benefits
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Work Smarter,
                  <br />
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Not Harder
                  </span>
                </h2>
                <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                  Join thousands of developers and teams who have transformed their productivity with Plan.AI
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-white font-medium">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-3xl" />
                <Card className="p-8 bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-xl relative">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                        <Zap className="h-8 w-8 text-green-400" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">3x</div>
                        <div className="text-slate-400">Faster Development</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                        <Users className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">10k+</div>
                        <div className="text-slate-400">Active Users</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">98%</div>
                        <div className="text-slate-400">Satisfaction Rate</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-green-500/5 to-transparent">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mb-4">
                Testimonials
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Loved by
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Developers</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-white/5 border-white/10 h-full">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-black font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.author}</div>
                        <div className="text-sm text-slate-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 blur-3xl" />
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    Ready to Transform Your Workflow?
                  </h2>
                  <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                    Join thousands of developers and teams using Plan.AI to build better software, faster.
                  </p>
                  <Link to="/auth">
                    <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-2xl shadow-green-500/50 text-lg px-8 py-6">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <p className="text-sm text-slate-400 mt-4">
                    No credit card required • Free forever plan • Setup in 2 minutes
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <motion.h1 
                  className="text-2xl font-bold tracking-tight mb-4"
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
                </motion.h1>
                <p className="text-slate-400 text-sm">
                  AI-powered project management that learns from you and grows with you.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-green-400 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors">Roadmap</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors">Changelog</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-green-400 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-green-400 transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-400">
                © 2025 Plan.AI. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
