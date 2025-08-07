import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, XCircle, Plus, Calendar } from "lucide-react";

interface Learning {
  id: string;
  title: string;
  content: string;
  type: 'success' | 'failure' | 'insight';
  date: string;
  tags: string[];
  relatedStep?: string;
}

interface LearningLogProps {
  learnings: Learning[];
  onAddLearning: (learning: Omit<Learning, 'id' | 'date'>) => void;
}

export function LearningLog({ learnings, onAddLearning }: LearningLogProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLearning, setNewLearning] = useState({
    title: '',
    content: '',
    type: 'insight' as const,
    tags: [] as string[],
    relatedStep: ''
  });

  const typeConfig = {
    success: { icon: CheckCircle, color: 'bg-success', label: 'Success' },
    failure: { icon: XCircle, color: 'bg-destructive', label: 'Lesson Learned' },
    insight: { icon: BookOpen, color: 'bg-primary', label: 'Insight' }
  };

  const handleSubmit = () => {
    if (!newLearning.title.trim() || !newLearning.content.trim()) return;
    
    onAddLearning(newLearning);
    setNewLearning({
      title: '',
      content: '',
      type: 'insight',
      tags: [],
      relatedStep: ''
    });
    setShowAddForm(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Learning Log
            </CardTitle>
            <CardDescription>
              Track what works, what doesn't, and key insights
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Learning
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showAddForm && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-3">
              <Input
                placeholder="Learning title..."
                value={newLearning.title}
                onChange={(e) => setNewLearning({ ...newLearning, title: e.target.value })}
              />
              
              <Textarea
                placeholder="What did you learn? What worked or didn't work?"
                value={newLearning.content}
                onChange={(e) => setNewLearning({ ...newLearning, content: e.target.value })}
                className="min-h-[100px]"
              />
              
              <div className="flex items-center gap-2">
                <select
                  value={newLearning.type}
                  onChange={(e) => setNewLearning({ ...newLearning, type: e.target.value as any })}
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="success">Success</option>
                  <option value="failure">Lesson Learned</option>
                  <option value="insight">Insight</option>
                </select>
                
                <Button onClick={handleSubmit} size="sm">
                  Save Learning
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="ghost" size="sm">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {learnings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No learnings recorded yet</p>
              <p className="text-sm">Start documenting what you learn as you build</p>
            </div>
          ) : (
            learnings.map((learning) => {
              const config = typeConfig[learning.type];
              const Icon = config.icon;
              
              return (
                <Card key={learning.id} className="border-l-4 border-l-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${config.color}/10`}>
                        <Icon className={`h-4 w-4 text-white`} />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">{learning.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`${config.color} text-white`}>
                              {config.label}
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              {learning.date}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{learning.content}</p>
                        
                        {learning.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {learning.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}