import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Loader2, CheckCircle2, FolderPlus, ListTodo, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceNotes() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadRecentNotes();
  }, []);

  const loadRecentNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('voice_notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setRecentNotes(data);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await processRecording(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setCurrentTranscript("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    setIsTranscribing(true);
    
    try {
      // Convert webm to a format OpenAI accepts
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      setIsTranscribing(false);
      return data.text;
    } catch (error) {
      setIsTranscribing(false);
      throw error;
    }
  };

  const analyzeWithAI = async (transcription: string) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an advanced project and task analyzer. Analyze voice notes and extract ALL possible information to create comprehensive projects or tasks.

Return a JSON object with this EXACT structure:
{
  "type": "task" or "project",
  "title": "concise, clear title",
  "description": "detailed description with all context",
  "priority": "low", "medium", or "high",
  "category": "web-dev", "mobile-dev", "ai-ml", "backend", "frontend", "full-stack", "devops", or "general",
  "status": "planning", "in-progress", "review", or "completed",
  "due_date": "YYYY-MM-DD" (extract from phrases like "by Friday", "next week", "in 3 days") or null,
  "estimated_completion": "YYYY-MM-DD" (if mentioned) or null,
  "budget": "amount" (extract any budget/cost mentions) or null,
  "progress": 0-100 (if mentioned, otherwise 0),
  "technologies": ["tech1", "tech2"] (extract any technologies, frameworks, languages mentioned),
  "team": ["person1", "person2"] (extract any team member names mentioned),
  "milestones": [
    {"title": "milestone1", "description": "details", "due_date": "YYYY-MM-DD"},
    {"title": "milestone2", "description": "details", "due_date": "YYYY-MM-DD"}
  ],
  "tasks": [
    {"title": "task1", "description": "details", "priority": "high/medium/low", "due_date": "YYYY-MM-DD"},
    {"title": "task2", "description": "details", "priority": "high/medium/low", "due_date": "YYYY-MM-DD"}
  ],
  "tags": ["tag1", "tag2"],
  "notes": "any additional context or notes"
}

Be EXTREMELY intelligent about:
- Extracting dates from natural language ("next Monday", "in 2 weeks", "by end of month")
- Identifying technologies and frameworks mentioned
- Breaking down complex projects into logical milestones and tasks
- Inferring priorities from urgency words ("urgent", "ASAP", "when you can")
- Extracting budget information from any cost mentions
- Identifying team members or stakeholders mentioned
- Creating realistic timelines and dependencies`
          },
          {
            role: 'user',
            content: transcription
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Could not parse AI response');
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Step 1: Transcribe audio
      setCurrentTranscript("Transcribing your voice...");
      const transcription = await transcribeAudio(audioBlob);
      setCurrentTranscript(transcription);

      // Step 2: Analyze with AI
      setCurrentTranscript(transcription + "\n\nAnalyzing with AI...");
      const analysis = await analyzeWithAI(transcription);

      // Step 3: Save voice note
      const { data: voiceNote, error: saveError } = await supabase
        .from('voice_notes')
        .insert({
          user_id: user.id,
          transcription,
          ai_analysis: analysis,
          processed: true
        } as any)
        .select()
        .single();

      if (saveError) throw saveError;

      // Step 4: Create task or project based on analysis
      if (analysis.type === 'task') {
        const { error: taskError } = await supabase
          .from('tasks')
          .insert({
            user_id: user.id,
            title: analysis.title,
            description: analysis.description,
            priority: analysis.priority || 'medium',
            due_date: analysis.due_date,
            status: analysis.status || 'pending'
          } as any);

        if (taskError) throw taskError;

        toast({
          title: "✅ Task Created!",
          description: `"${analysis.title}" has been added to your tasks.`,
        });
      } else if (analysis.type === 'project') {
        // Create comprehensive project with all extracted data
        const projectData: any = {
          user_id: user.id,
          title: analysis.title,
          description: analysis.description,
          category: analysis.category || 'general',
          priority: analysis.priority || 'medium',
          status: analysis.status || 'planning',
          progress: analysis.progress || 0,
        };

        // Add optional fields if they exist
        if (analysis.due_date) projectData.due_date = analysis.due_date;
        if (analysis.estimated_completion) projectData.estimated_completion = analysis.estimated_completion;
        if (analysis.budget) projectData.budget = analysis.budget;
        if (analysis.technologies && analysis.technologies.length > 0) {
          projectData.technologies = analysis.technologies;
        }
        if (analysis.team && analysis.team.length > 0) {
          projectData.team = analysis.team;
        }

        const { data: project, error: projectError } = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single();

        if (projectError) throw projectError;

        let tasksCreated = 0;
        let milestonesCreated = 0;

        // Create milestones if any
        if (analysis.milestones && analysis.milestones.length > 0 && project) {
          for (const milestone of analysis.milestones) {
            const { error: milestoneError } = await supabase
              .from('milestones')
              .insert({
                project_id: (project as any).id,
                title: milestone.title,
                description: milestone.description || '',
                due_date: milestone.due_date,
                status: 'pending'
              } as any);
            
            if (!milestoneError) milestonesCreated++;
          }
        }

        // Create detailed tasks for the project
        if (analysis.tasks && analysis.tasks.length > 0 && project) {
          for (const task of analysis.tasks) {
            const taskData: any = {
              user_id: user.id,
              project_id: (project as any).id,
              title: typeof task === 'string' ? task : task.title,
              status: 'pending',
              priority: typeof task === 'object' ? (task.priority || 'medium') : 'medium'
            };

            if (typeof task === 'object') {
              if (task.description) taskData.description = task.description;
              if (task.due_date) taskData.due_date = task.due_date;
            }

            const { error: taskError } = await supabase.from('tasks').insert(taskData);
            if (!taskError) tasksCreated++;
          }
        }

        // Create a goal for the project if it has a clear objective
        if (analysis.due_date) {
          await supabase.from('goals').insert({
            user_id: user.id,
            title: `Complete: ${analysis.title}`,
            description: `Project goal: ${analysis.description}`,
            target_date: analysis.due_date,
            status: 'in-progress',
            priority: analysis.priority || 'medium'
          } as any);
        }

        toast({
          title: "✅ Project Created Successfully!",
          description: `"${analysis.title}" with ${tasksCreated} tasks and ${milestonesCreated} milestones has been created.`,
        });
      }

      loadRecentNotes();
      setCurrentTranscript("");
      setIsProcessing(false);

    } catch (error: any) {
      console.error('Processing error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process recording",
        variant: "destructive",
      });
      setCurrentTranscript("");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Voice to Task
        </h1>
        <p className="text-muted-foreground">
          Speak naturally about your tasks or projects. AI will transcribe, analyze, and organize everything for you.
        </p>
      </div>

      <Card className="mb-8 glass-card">
        <CardHeader>
          <CardTitle>Record Your Thoughts</CardTitle>
          <CardDescription>
            Just speak naturally - I'll handle the rest. Mention deadlines, priorities, and details.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            {!isRecording && !isProcessing && (
              <Button
                size="lg"
                onClick={startRecording}
                className="h-32 w-32 rounded-full shadow-powerful hover:scale-110 transition-all duration-300"
              >
                <Mic className="h-12 w-12" />
              </Button>
            )}

            {isRecording && (
              <Button
                size="lg"
                onClick={stopRecording}
                variant="destructive"
                className="h-32 w-32 rounded-full animate-pulse shadow-powerful"
              >
                <Square className="h-12 w-12" />
              </Button>
            )}

            {isProcessing && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {isTranscribing ? "Transcribing..." : "Analyzing with AI..."}
                </p>
              </div>
            )}

            <p className="text-sm text-center text-muted-foreground font-medium">
              {isRecording ? "🔴 Recording... Click to stop" : "Click the microphone to start"}
            </p>
          </div>

          {/* Animated Transcript Display */}
          <AnimatePresence>
            {currentTranscript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <Card className="bg-muted/50 border-2 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        Live Transcript
                      </div>
                      <motion.p
                        className="text-sm leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {currentTranscript.split('\n').map((line, i) => (
                          <span key={i} className="block mb-2">
                            {line}
                          </span>
                        ))}
                      </motion.p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Voice Notes</h2>
        <div className="grid gap-4">
          {recentNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {note.processed && note.ai_analysis && (
                          <>
                            {note.ai_analysis.type === 'project' ? (
                              <FolderPlus className="h-5 w-5 text-primary" />
                            ) : (
                              <ListTodo className="h-5 w-5 text-primary" />
                            )}
                            {note.ai_analysis.title}
                          </>
                        )}
                        {!note.processed && "Processing..."}
                      </CardTitle>
                      <CardDescription className="mt-2 text-sm">
                        "{note.transcription}"
                      </CardDescription>
                    </div>
                    {note.processed && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                {note.processed && note.ai_analysis && (
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {note.ai_analysis.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          note.ai_analysis.priority === 'high' ? 'bg-red-100 text-red-700' :
                          note.ai_analysis.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {note.ai_analysis.priority} priority
                        </span>
                        {note.ai_analysis.category && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {note.ai_analysis.category}
                          </span>
                        )}
                      </div>
                      
                      {note.ai_analysis.description && (
                        <p className="text-sm text-muted-foreground">
                          {note.ai_analysis.description}
                        </p>
                      )}

                      {note.ai_analysis.tasks && note.ai_analysis.tasks.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold mb-2">Tasks Created:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {note.ai_analysis.tasks.map((task: string, i: number) => (
                              <li key={i}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {note.ai_analysis.tags && note.ai_analysis.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.ai_analysis.tags.map((tag: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded text-xs bg-muted">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}

          {recentNotes.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mic className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  No voice notes yet. Start recording to create your first one!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
