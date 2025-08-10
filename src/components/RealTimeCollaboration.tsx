import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Users, Activity, MessageSquare, Check, Plus, Edit, Clock, Send, Video, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  currentActivity?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'edit' | 'comment' | 'complete' | 'create';
}

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

// Mock data
const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Sarah Chen', status: 'online', lastSeen: 'now', currentActivity: 'Editing Dashboard', role: 'admin' },
  { id: '2', name: 'Mike Rodriguez', status: 'away', lastSeen: '5 min ago', role: 'member' },
  { id: '3', name: 'Alex Thompson', status: 'busy', lastSeen: '2 min ago', currentActivity: 'Code review', role: 'member' },
  { id: '4', name: 'Emma Wilson', status: 'offline', lastSeen: '1 hour ago', role: 'viewer' }
];

const mockActivities: Activity[] = [
  { id: '1', user: 'Sarah Chen', action: 'edited', target: 'Dashboard Component', timestamp: '2 min ago', type: 'edit' },
  { id: '2', user: 'Mike Rodriguez', action: 'commented on', target: 'API Integration', timestamp: '5 min ago', type: 'comment' },
  { id: '3', user: 'Alex Thompson', action: 'completed', target: 'User Profile', timestamp: '10 min ago', type: 'complete' }
];

const mockComments: Comment[] = [
  {
    id: '1',
    user: 'Sarah Chen',
    content: 'The new dashboard layout looks great! Should we add more metrics?',
    timestamp: '5 min ago',
    replies: [
      { id: '1-1', user: 'You', content: 'Good idea! I\'ll add the analytics section.', timestamp: '3 min ago' }
    ]
  },
  {
    id: '2',
    user: 'Mike Rodriguez',
    content: 'API integration is working well. Ready for testing.',
    timestamp: '15 min ago'
  }
];

interface RealTimeCollaborationProps {
  projectId: string;
}

export function RealTimeCollaboration({ projectId }: RealTimeCollaborationProps) {
  const [newComment, setNewComment] = useState('');
  const [activities, setActivities] = useState(mockActivities);
  const [comments, setComments] = useState(mockComments);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const { toast } = useToast();

  // Simulate real-time activity updates with proper cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random activity updates
      if (Math.random() > 0.8) {
        const randomUser = teamMembers[Math.floor(Math.random() * teamMembers.length)];
        const actions = ['viewed', 'edited', 'commented on'];
        const targets = ['Dashboard Component', 'User Profile', 'API Integration', 'Test Suite'];
        
        const newActivity: Activity = {
          id: Date.now().toString(),
          user: randomUser.name,
          action: actions[Math.floor(Math.random() * actions.length)],
          target: targets[Math.floor(Math.random() * targets.length)],
          timestamp: 'just now',
          type: 'edit'
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []); // Empty dependency array to prevent unnecessary re-renders

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'busy': return 'bg-destructive';
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  }, []);

  const getActivityIcon = useCallback((type: string) => {
    switch (type) {
      case 'edit': return Edit;
      case 'comment': return MessageSquare;
      case 'complete': return Check;
      case 'create': return Plus;
      default: return Activity;
    }
  }, []);

  const handleSendComment = useCallback(() => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: 'You',
      content: newComment,
      timestamp: 'just now'
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    
    toast({
      title: "Comment Added",
      description: "Your comment has been shared with the team.",
    });
  }, [newComment, toast]);

  const inviteTeamMember = useCallback(() => {
    toast({
      title: "Invite Sent",
      description: "Team invitation has been sent via email.",
    });
  }, [toast]);

  const startVideoCall = useCallback(() => {
    toast({
      title: "Video Call Started",
      description: "Launching video call with team members.",
    });
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Real-Time Collaboration
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    {teamMembers.filter(m => m.status === 'online').length} online
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Collaborate with your team in real-time
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={startVideoCall}>
                <Video className="mr-2 h-4 w-4" />
                Video Call
              </Button>
              <Button variant="outline" size="sm" onClick={inviteTeamMember}>
                <Mail className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm">{member.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.currentActivity || `Last seen ${member.lastSeen}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {activities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <IconComponent className="h-3 w-3 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-foreground">
                          <span className="font-medium">{activity.user}</span>
                          {' '}{activity.action}{' '}
                          <span className="font-medium">{activity.target}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Comments & Discussion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Discussion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
              className="flex-1"
            />
            <Button size="sm" onClick={handleSendComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator />
          
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground text-sm">{comment.user}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                  </div>
                  
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-4 space-y-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="p-2 bg-background border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-foreground text-xs">{reply.user}</span>
                            <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                          </div>
                          <p className="text-xs text-foreground">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}