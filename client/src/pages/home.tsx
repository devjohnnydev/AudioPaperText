import { useState } from "react";
import { Shell } from "@/components/layout/shell";
import { AudioPanel } from "@/components/transcription/audio-panel";
import { ChatPanel } from "@/components/transcription/chat-panel";
import { ReportView } from "@/components/transcription/report-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState("audio");

  return (
    <Shell>
      <div className="max-w-7xl mx-auto pt-6 pb-24 space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground"
          >
            {activeTab === "audio" ? (
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                Áudio para Texto
              </span>
            ) : (
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Chat Inteligente
              </span>
            )}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-medium"
          >
            Transcrição precisa e segura com a tecnologia <span className="text-foreground font-semibold">Trust AI</span>.
          </motion.p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="audio" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white p-1.5 rounded-full border border-border shadow-sm h-auto">
              <TabsTrigger 
                value="audio" 
                className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
              >
                <Mic className="h-4 w-4 mr-2" />
                Áudio
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="min-h-[600px] relative">
            <TabsContent value="audio" className="mt-0 h-full focus-visible:ring-0">
              <AudioPanel />
            </TabsContent>
            <TabsContent value="chat" className="mt-0 h-full focus-visible:ring-0">
              <ChatPanel />
            </TabsContent>
          </div>
        </Tabs>

        {/* Floating Report View */}
        <ReportView />
      </div>
    </Shell>
  );
}