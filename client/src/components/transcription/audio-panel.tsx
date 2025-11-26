import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, Mic, Loader2, Copy, Check, FileText, Plus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useProject } from "./project-context";

export function AudioPanel() {
  const { addItem, updateItemStatus, items } = useProject();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);
  const [activeTranscript, setActiveTranscript] = useState("");
  const [copied, setCopied] = useState(false);

  // Only show audio items in this panel
  const audioItems = items.filter(i => i.type === 'audio');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      addItem({
        type: "audio",
        name: file.name,
        file: file
      });
    });
    
    toast({
      title: `${acceptedFiles.length} áudio(s) adicionado(s)`,
      description: "Pronto para transcrever.",
    });
  }, [addItem]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg']
    },
    maxFiles: 20 // Increased limit
  });

  const processQueue = async () => {
    if (audioItems.filter(i => i.status === 'pending').length === 0) return;
    
    setIsProcessing(true);
    
    const pendingItems = audioItems.filter(i => i.status === 'pending');
    
    for (let i = 0; i < pendingItems.length; i++) {
      const item = pendingItems[i];
      updateItemStatus(item.id, "processing");
      
      // Simulate processing time per file
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTranscript = `[Transcrição de ${item.name}]\nNeste áudio, discutimos os pontos críticos do projeto e alinhamos as expectativas para a próxima sprint. Foi mencionado que a equipe de design precisa entregar os assets até quarta-feira.\n\n`;
      
      updateItemStatus(item.id, "completed", mockTranscript);
      setActiveTranscript(prev => prev + mockTranscript);
    }

    setIsProcessing(false);
    toast({
      title: "Processamento em Lote Concluído",
      description: "Todos os áudios foram transcritos com sucesso.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeTranscript);
    setCopied(true);
    toast({ title: "Texto copiado" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="space-y-6 flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 min-h-[320px]"
        >
          <div
            {...getRootProps()} 
            className={`
              w-full h-full border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300
              flex flex-col items-center justify-center relative overflow-hidden bg-white shadow-sm group
              ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:shadow-md'}
            `}
          >
            <input {...getInputProps()} />
            
            <AnimatePresence mode="wait">
              {audioItems.length > 0 ? (
                 <motion.div 
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full overflow-y-auto max-h-[300px] space-y-2 p-2"
                >
                  <div className="flex flex-col items-center mb-4">
                     <div className="bg-primary/10 p-3 rounded-full mb-2">
                        <Plus className="h-6 w-6 text-primary" />
                     </div>
                     <p className="text-sm font-medium text-muted-foreground">Arraste mais arquivos para adicionar</p>
                  </div>

                  {audioItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl text-left border border-border/50">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <FileAudio className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                           {item.status === 'pending' && 'Aguardando...'}
                           {item.status === 'processing' && 'Transcrevendo...'}
                           {item.status === 'completed' && 'Concluído'}
                        </p>
                      </div>
                      {item.status === 'completed' && <Check className="h-4 w-4 text-green-500" />}
                      {item.status === 'processing' && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 z-10"
                >
                  <div className="bg-primary/10 p-6 rounded-full mx-auto w-fit group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary group-hover:text-white">
                    <Upload className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-xl text-foreground">Arraste múltiplos áudios</p>
                    <p className="text-muted-foreground">Envie 10+ arquivos de uma vez (MP3, WAV)</p>
                  </div>
                  <Button className="rounded-full px-8 font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    Selecionar Arquivos
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Button 
            className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/20 font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]" 
            disabled={audioItems.filter(i => i.status === 'pending').length === 0 || isProcessing}
            onClick={processQueue}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Processando Fila...
              </>
            ) : (
              <>
                <Mic className="mr-3 h-5 w-5" />
                {audioItems.length > 0 ? `Transcrever ${audioItems.filter(i => i.status === 'pending').length} Áudios` : 'Iniciar Transcrição'}
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Output Section */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-full min-h-[400px]"
      >
        <Card className="flex-1 flex flex-col overflow-hidden border border-border/60 bg-white shadow-lg shadow-black/5 rounded-3xl">
          <div className="flex items-center justify-between p-4 border-b border-border/40 bg-secondary/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-foreground bg-white px-3 py-1 rounded-full border border-border/50 shadow-sm">Saída Combinada</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!activeTranscript} className="h-8 w-8 p-0 rounded-full hover:bg-background">
                 {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>
          <div className="flex-1 relative group">
            <Textarea 
              className="h-full w-full resize-none border-0 focus-visible:ring-0 p-8 font-sans text-base leading-relaxed bg-transparent text-foreground/80"
              placeholder="As transcrições aparecerão aqui sequencialmente..."
              value={activeTranscript}
              readOnly
            />
            {!activeTranscript && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-10">
                <FileText className="h-24 w-24" />
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}