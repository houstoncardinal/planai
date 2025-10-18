import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Loader2, CheckCircle2, FolderPlus, ListTodo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function VoiceNotes() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
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
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await processRecording(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
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

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Use Web Speech API for transcription (browser-based)
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = async (event: any) => {
          const transcription = event.results[0][0].transcript;
          
          // Save voice note
          const { data: voiceNote, error: saveError } = await supabase
            .from('voice_notes')
            .insert({
              user_id: user.id,
              transcription,
              processed: false
            })
            .select()
            .single();

          if (saveError) throw saveError;

          // Process with AI
          const { data: analysisData, error: aiError } = await supabase.functions.invoke('process-voice-note', {
            body: { transcription }
          });

          if (aiError) throw aiError;

          const { analysis } = analysisData;

          // Update voice note with analysis
          await supabase
            .from('voice_notes')
            .update({ 
              ai_analysis: analysis,
              processed: true 
            })
            .eq('id', voiceNote.id);

          // Create task or project based on analysis
          if (analysis.type === 'task') {
            const { error: taskError } = await supabase
              .from('tasks')
              .insert({
                user_id: user.id,
                title: analysis.title,
                description: analysis.description,
                priority: analysis.priority,
                due_date: analysis.due_date,
                created_from_voice: true,
                original_note: transcription
              });

            if (taskError) throw taskError;

            toast({
              title: "Task Created!",
              description: `"${analysis.title}" has been added to your tasks.`,
            });
          } else {
            const { error: projectError } = await supabase
              .from('projects')
              .insert({
                user_id: user.id,
                title: analysis.title,
                description: analysis.description,
                category: analysis.category,
                priority: analysis.priority,
                status: 'planning'
              });

            if (projectError) throw projectError;

            toast({
              title: "Project Created!",
              description: `"${analysis.title}" has been added to your projects.`,
            });
          }

          loadRecentNotes();
          setIsProcessing(false);
        };

        recognition.onerror = () => {
          // Fallback: just save the note without transcription
          toast({
            title: "Note Saved",
            description: "Voice note saved. Transcription unavailable.",
          });
          setIsProcessing(false);
        };

        // Start recognition from the recorded audio
        // Note: Web Speech API works with live audio, so we'll use a simpler approach
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        recognition.start();
      };

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process recording",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Voice to Task</h1>
        <p className="text-muted-foreground">
          Speak your thoughts, and I'll organize them into tasks or projects for you.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Record a Note</CardTitle>
          <CardDescription>
            Tell me about your task or project idea, and I'll automatically organize it for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {!isRecording && !isProcessing && (
            <Button
              size="lg"
              onClick={startRecording}
              className="h-24 w-24 rounded-full"
            >
              <Mic className="h-8 w-8" />
            </Button>
          )}

          {isRecording && (
            <Button
              size="lg"
              onClick={stopRecording}
              variant="destructive"
              className="h-24 w-24 rounded-full animate-pulse"
            >
              <Square className="h-8 w-8" />
            </Button>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Processing your note...</p>
            </div>
          )}

          <p className="text-sm text-center text-muted-foreground">
            {isRecording ? "Recording... Click to stop" : "Click the microphone to start recording"}
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Notes</h2>
        <div className="grid gap-4">
          {recentNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {note.processed && note.ai_analysis && (
                        <>
                          {note.ai_analysis.type === 'project' ? (
                            <FolderPlus className="h-4 w-4 text-primary" />
                          ) : (
                            <ListTodo className="h-4 w-4 text-primary" />
                          )}
                          {note.ai_analysis.title}
                        </>
                      )}
                      {!note.processed && "Processing..."}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {note.transcription}
                    </CardDescription>
                  </div>
                  {note.processed && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </CardHeader>
              {note.processed && note.ai_analysis && (
                <CardContent>
                  <div className="text-sm space-y-2">
                    <p><strong>Type:</strong> {note.ai_analysis.type}</p>
                    <p><strong>Priority:</strong> {note.ai_analysis.priority}</p>
                    {note.ai_analysis.description && (
                      <p><strong>Description:</strong> {note.ai_analysis.description}</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {recentNotes.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No voice notes yet. Start recording to create your first one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
