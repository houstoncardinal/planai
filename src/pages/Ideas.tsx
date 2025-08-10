import { useMemo, useState } from "react";
import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Idea {
  id: string;
  title: string;
  category: string;
  createdAt: string;
}

const quickSuggestions: Idea[] = [
  { id: "q1", title: "Add dark mode toggle animation", category: "UI/UX", createdAt: new Date().toISOString() },
  { id: "q2", title: "Automated weekly progress summary email", category: "Product", createdAt: new Date().toISOString() },
  { id: "q3", title: "Keyboard shortcuts for navigation", category: "DevEx", createdAt: new Date().toISOString() },
];

export default function Ideas() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Product");
  const [ideas, setIdeas] = useState<Idea[]>(quickSuggestions);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return ideas.filter((i) => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  }, [ideas, query]);

  function addIdea() {
    if (!title.trim()) return;
    setIdeas((prev) => [
      { id: crypto.randomUUID(), title: title.trim(), category, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setTitle("");
    setCategory("Product");
  }

  function addQuickSuggestions() {
    setIdeas((prev) => [...quickSuggestions.map((q) => ({ ...q, id: crypto.randomUUID() })), ...prev]);
  }

  function removeIdea(id: string) {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <>
      <Seo
        title="Idea Generator – DevTracker"
        description="Capture and organize product ideas. Quickly add suggestions and filter by category or keywords."
      />

      <header className="px-4 md:px-6 py-4 border-b border-border/50">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Idea Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">Capture and organize ideas for future development.</p>
      </header>

      <main className="p-4 md:p-6 space-y-6">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Add a new idea</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idea-title">Title</Label>
                  <Input id="idea-title" placeholder="e.g., Export reports to CSV" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idea-category">Category</Label>
                  <Input id="idea-category" placeholder="Product, UI/UX, DevEx" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addIdea}>Add Idea</Button>
                <Button variant="secondary" onClick={addQuickSuggestions}>Quick suggestions</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search & filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="idea-search">Keywords</Label>
              <Input id="idea-search" placeholder="Search ideas..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <p className="text-xs text-muted-foreground">Search matches title or category.</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((i) => (
            <Card key={i.id}>
              <CardHeader className="flex-row items-center justify-between gap-4">
                <CardTitle className="text-base flex items-center gap-2">
                  {i.title}
                  <Badge variant="outline">{i.category}</Badge>
                </CardTitle>
                <Button variant="ghost" onClick={() => removeIdea(i.id)} aria-label="Remove idea">Remove</Button>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Added on {new Date(i.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">No ideas found. Try a different search.</CardContent>
            </Card>
          )}
        </section>
      </main>
    </>
  );
}
