import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CheckCircle2, Timer } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const velocityData = [
  { sprint: "S1", points: 20 },
  { sprint: "S2", points: 24 },
  { sprint: "S3", points: 18 },
  { sprint: "S4", points: 28 },
  { sprint: "S5", points: 30 },
];

const completionData = [
  { month: "Jan", completed: 8 },
  { month: "Feb", completed: 12 },
  { month: "Mar", completed: 10 },
  { month: "Apr", completed: 14 },
  { month: "May", completed: 16 },
];

export default function Insights() {
  return (
    <>
      <Seo
        title="Progress Insights – DevTracker"
        description="Analyze your project performance with charts and KPIs. Track velocity, completion trends, and cycle times."
      />

      <header className="px-4 md:px-6 py-4 border-b border-border/50">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Progress Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Key metrics and trends across your projects.</p>
      </header>

      <main className="p-4 md:p-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex-row items-center gap-3">
              <TrendingUp className="h-5 w-5" />
              <CardTitle className="text-sm">Velocity (avg)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">24 pts</p>
              <p className="text-xs text-muted-foreground">Last 5 sprints</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3">
              <CheckCircle2 className="h-5 w-5" />
              <CardTitle className="text-sm">Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">62</p>
              <p className="text-xs text-muted-foreground">Last 5 months</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3">
              <Timer className="h-5 w-5" />
              <CardTitle className="text-sm">Cycle Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">3.4 days</p>
              <p className="text-xs text-muted-foreground">Median</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="h-80">
            <CardHeader>
              <CardTitle>Team Velocity</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={velocityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="points" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="h-80">
            <CardHeader>
              <CardTitle>Completion Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
