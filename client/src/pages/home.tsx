import { useState } from "react";
import { Shell } from "@/components/layout/shell";
import { AudioPanel } from "@/components/transcription/audio-panel";
import { OcrPanel } from "@/components/transcription/ocr-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, PenTool, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const [activeTab, setActiveTab] = useState("audio");

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Create Content</h2>
          <p className="text-muted-foreground">
            Transcribe audio recordings or digitize handwritten notes using advanced AI models.
          </p>
        </div>

        <Alert className="bg-indigo-500/10 border-indigo-500/20 text-indigo-900 dark:text-indigo-100">
          <Info className="h-4 w-4 !text-indigo-500" />
          <AlertTitle>Railway Deployment Ready</AlertTitle>
          <AlertDescription>
            This application is configured for easy deployment. The frontend build process is compatible with Railway's static site or Node.js hosting.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="audio" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Audio to Text
            </TabsTrigger>
            <TabsTrigger value="ocr" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Handwriting OCR
            </TabsTrigger>
          </TabsList>
          
          <div className="min-h-[600px]">
            <TabsContent value="audio" className="mt-0 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AudioPanel />
            </TabsContent>
            <TabsContent value="ocr" className="mt-0 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <OcrPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Shell>
  );
}