import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningLog } from "@/components/LearningLog";
import { BookOpen, TrendingUp, Lightbulb, Search, Filter, Calendar, Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Enhanced mock learning data
const mockLearnings = [
  {
    id: '1',
    title: 'TypeScript generics mastery',
    content: 'Finally understood how to use TypeScript generics effectively for reusable components. The key was starting simple and building up complexity.',
    type: 'insight' as const,
    date: '2 days ago',
    tags: ['typescript', 'components'],
    relatedStep: '1',
    project: 'E-commerce Platform'
  },
  {
    id: '2',
    title: 'Authentication flow complexity',
    content: 'Underestimated the complexity of handling token refresh and logout scenarios. Need to plan auth state management more carefully.',
    type: 'failure' as const,
    date: '1 day ago',
    tags: ['auth', 'state-management'],
    relatedStep: '3',
    project: 'Mobile App MVP'
  },
  {
    id: '3',
    title: 'React Native performance optimization',
    content: 'Discovered that FlatList with getItemLayout significantly improves performance for large lists. Also learned about InteractionManager for deferring expensive operations.',
    type: 'success' as const,
    date: '3 days ago',
    tags: ['react-native', 'performance'],
    relatedStep: '5',
    project: 'Mobile App MVP'
  },
  {
    id: '4',
    title: 'CSS Grid vs Flexbox decision framework',
    content: 'Created a mental model for choosing between CSS Grid and Flexbox: Grid for 2D layouts, Flexbox for 1D layouts and component spacing.',
    type: 'insight' as const,
    date: '5 days ago',
    tags: ['css', 'layout'],
    relatedStep: '2',
    project: 'Portfolio Website'
  },
  {
    id: '5',
    title: 'API rate limiting implementation',
    content: 'Successfully implemented exponential backoff for API calls. The key insight was adding jitter to prevent thundering herd problems.',
    type: 'success' as const,
    date: '1 week ago',
    tags: ['api', 'backend', 'scalability'],
    relatedStep: '7',
    project: 'AI Chat Bot'
  }
];

const Learnings = () => {
  const [learnings, setLearnings] = useState(mockLearnings);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const addLearning = (learning: any) => {
    const newLearning = {
      ...learning,
      id: Date.now().toString(),
      date: 'Just now'
    };
    setLearnings([newLearning, ...learnings]);
  };

  const filteredLearnings = learnings.filter(learning => {
    const matchesSearch = learning.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         learning.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         learning.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "all" || learning.type === typeFilter;
    const matchesTag = tagFilter === "all" || learning.tags.includes(tagFilter);
    
    return matchesSearch && matchesType && matchesTag;
  });

  const learningStats = {
    total: learnings.length,
    success: learnings.filter(l => l.type === 'success').length,
    failure: learnings.filter(l => l.type === 'failure').length,
    insight: learnings.filter(l => l.type === 'insight').length,
    thisWeek: learnings.filter(l => l.date.includes('day') || l.date.includes('Just now')).length
  };

  const allTags = [...new Set(learnings.flatMap(l => l.tags))];

  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full max-w-none px-4 md:px-6 py-6 space-y-6">{/* Fixed container */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Archive</h1>
          <p className="text-muted-foreground mt-1">
            Your development knowledge base and growth tracker
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{learningStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Learnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{learningStats.success}</div>
            <div className="text-sm text-muted-foreground">Successes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{learningStats.failure}</div>
            <div className="text-sm text-muted-foreground">Lessons</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{learningStats.insight}</div>
            <div className="text-sm text-muted-foreground">Insights</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{learningStats.thisWeek}</div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search learnings and tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failure">Lesson</SelectItem>
              <SelectItem value="insight">Insight</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Learning Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Learnings</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <LearningLog learnings={filteredLearnings} onAddLearning={addLearning} />
        </TabsContent>
        
        <TabsContent value="recent">
          <LearningLog 
            learnings={filteredLearnings.filter(l => l.date.includes('day') || l.date.includes('Just now'))} 
            onAddLearning={addLearning} 
          />
        </TabsContent>
        
        <TabsContent value="insights">
          <LearningLog 
            learnings={filteredLearnings.filter(l => l.type === 'insight')} 
            onAddLearning={addLearning} 
          />
        </TabsContent>
        
        <TabsContent value="patterns">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Learning Patterns
                </CardTitle>
                <CardDescription>
                  Identify trends and recurring themes in your development journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Most Common Tags */}
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Most Common Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 10).map(tag => {
                        const count = learnings.filter(l => l.tags.includes(tag)).length;
                        return (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag} ({count})
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Learning Velocity */}
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Learning Velocity</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-success/10 rounded-lg">
                        <div className="text-lg font-bold text-success">3.2</div>
                        <div className="text-xs text-muted-foreground">Learnings/Week</div>
                      </div>
                      <div className="text-center p-3 bg-primary/10 rounded-lg">
                        <div className="text-lg font-bold text-primary">75%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                      <div className="text-center p-3 bg-warning/10 rounded-lg">
                        <div className="text-lg font-bold text-warning">12</div>
                        <div className="text-xs text-muted-foreground">Topics Covered</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {filteredLearnings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No learnings found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || typeFilter !== "all" || tagFilter !== "all"
              ? "Try adjusting your filters to see more learnings."
              : "Start documenting your development learnings."}
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default Learnings;