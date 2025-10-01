import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Seo from "@/components/Seo";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  targetDate?: string;
  progress: number; // 0-100
}

export default function Goals() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load goals from Supabase
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedGoals = (data || []).map((goal: any) => ({
        id: goal.id,
        title: goal.title,
        targetDate: goal.target_date || undefined,
        progress: goal.progress || 0,
      }));
      
      setGoals(formattedGoals);
    } catch (error: any) {
      toast.error(error.message || "Error loading goals");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = goals.length;
    const avg = total ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / total) : 0;
    const dueSoon = goals.filter((g) => g.targetDate && new Date(g.targetDate) <= new Date(Date.now() + 86400000 * 7)).length;
    const completed = goals.filter((g) => g.progress >= 100).length;
    return { total, avg, dueSoon, completed };
  }, [goals]);

  const isAddDisabled = useMemo(() => {
    if (!title.trim()) return true;
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(date);
      return d < today;
    }
    return false;
  }, [title, date]);

  async function addGoal() {
    const t = title.trim();
    if (!t) {
      toast.error("Please enter a goal title");
      return;
    }
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(date);
      if (d < today) {
        toast.error("Target date cannot be in the past");
        return;
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('goals')
        .insert({
          title: t,
          target_date: date || null,
          progress: 0,
          user_id: user.id,
        });

      if (error) throw error;

      await loadGoals();
      setTitle("");
      setDate("");
      toast.success("Goal added");
    } catch (error: any) {
      toast.error(error.message || "Error adding goal");
    }
  }

  async function updateProgress(id: string, value: number) {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ progress: value })
        .eq('id', id);

      if (error) throw error;
      await loadGoals();
    } catch (error: any) {
      toast.error(error.message || "Error updating progress");
    }
  }

  async function removeGoal(id: string) {
    const ok = window.confirm("Remove this goal?");
    if (!ok) return;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadGoals();
      toast.success("Goal removed");
    } catch (error: any) {
      toast.error(error.message || "Error removing goal");
    }
  }

  async function completeGoal(id: string) {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ progress: 100 })
        .eq('id', id);

      if (error) throw error;
      await loadGoals();
      toast.success("Goal marked complete");
    } catch (error: any) {
      toast.error(error.message || "Error completing goal");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Seo
        title="Goal Tracker – DevTracker"
        description="Track development goals, update progress, and stay on schedule with the Goal Tracker dashboard."
      />
      <header className="px-4 md:px-6 py-4 border-b border-border/50">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Goal Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">Plan, track, and complete your project goals.</p>
      </header>

      <main className="p-4 md:p-6 space-y-6 animate-fade-in">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-sm">Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-sm">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Progress value={stats.avg} className="flex-1" />
                <span className="text-sm text-muted-foreground w-10 text-right">{stats.avg}%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-sm">Due Soon (7d)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">{stats.dueSoon}</p>
            </CardContent>
          </Card>
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-sm">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">{stats.completed}</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Add new goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g., Implement auth flow"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addGoal();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-date">Target date</Label>
                  <Input id="goal-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().slice(0,10)} />
                </div>
                <div className="flex items-end">
                  <Button className="w-full hover-scale" onClick={addGoal} aria-label="Add goal" disabled={isAddDisabled}>
                    Add Goal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
          {goals.map((g) => (
            <Card key={g.id} className="overflow-hidden">
              <CardHeader className="flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {g.title}
                    {g.progress >= 100 ? (
                      <Badge variant="secondary">Done</Badge>
                    ) : g.targetDate ? (
                      <Badge variant="outline">Due {format(new Date(g.targetDate), "MMM d")}</Badge>
                    ) : null}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {g.targetDate ? `Target: ${format(new Date(g.targetDate), "PP")}` : "No target date"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {g.progress < 100 && (
                    <Button variant="secondary" onClick={() => completeGoal(g.id)} aria-label="Mark complete" className="hover-scale">
                      Complete
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => removeGoal(g.id)} aria-label="Remove goal" className="hover-scale">
                    Remove
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Progress value={g.progress} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12 text-right">{g.progress}%</span>
                </div>
                <div className="px-2">
                  <Label className="text-xs text-muted-foreground">Adjust progress</Label>
                  <Slider
                    value={[g.progress]}
                    max={100}
                    step={5}
                    onValueChange={(v) => updateProgress(g.id, v[0] ?? 0)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          {goals.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">No goals yet. Add your first goal above.</CardContent>
            </Card>
          )}
        </section>
      </main>
    </>
  );
}
