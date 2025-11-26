import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, Mic, Loader2, Copy, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function AudioPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      setTranscript("");
      toast({
        title: "Áudio carregado",
        description: `Pronto para transcrever: ${selected.name}`,
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg']
    },
    maxFiles: 1
  });

  const handleTranscribe = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);

    // Simulation of processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      setProgress(100);
      setTranscript(
        "Esta é uma transcrição simulada do arquivo de áudio. Em uma implementação real, este texto seria gerado pela API Trust AI usando modelos avançados de reconhecimento de fala. O sistema processou com sucesso a entrada de áudio e converteu a fala em texto com alta precisão e pontuação correta."
      );
      toast({
        title: "Transcrição concluída",
        description: "O áudio foi processado com sucesso.",
      });
    }, 4500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
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
              ${file ? 'border-primary/20 bg-primary/5' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div 
                  key="file-loaded"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="space-y-6 z-10"
                >
                  <div className="relative">
                    <div className="bg-white p-6 rounded-full shadow-xl mx-auto w-fit ring-4 ring-primary/10">
                      <FileAudio className="h-10 w-10 text-primary" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-2 border-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-xl text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full px-6"
                  >
                    Remover arquivo
                  </Button>
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
                    <p className="font-bold text-xl text-foreground">Arraste e solte o áudio</p>
                    <p className="text-muted-foreground">Suporta MP3, WAV, M4A (Máx 25MB)</p>
                  </div>
                  <Button className="rounded-full px-8 font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    Selecionar Arquivo
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decoration Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Button 
            className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/20 font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]" 
            disabled={!file || isProcessing}
            onClick={handleTranscribe}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Processando Áudio...
              </>
            ) : (
              <>
                <Mic className="mr-3 h-5 w-5" />
                Iniciar Transcrição
              </>
            )}
          </Button>
        </motion.div>

        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2 bg-white p-4 rounded-xl border border-border/50 shadow-sm"
          >
            <div className="flex justify-between text-sm font-medium text-foreground">
              <span className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                Transcrevendo...
              </span>
              <span className="text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2.5 bg-secondary" />
          </motion.div>
        )}
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
              <span className="text-sm font-semibold text-foreground bg-white px-3 py-1 rounded-full border border-border/50 shadow-sm">Saída de Texto</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!transcript} className="h-8 w-8 p-0 rounded-full hover:bg-background">
                 {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>
          <div className="flex-1 relative group">
            <Textarea 
              className="h-full w-full resize-none border-0 focus-visible:ring-0 p-8 font-sans text-base leading-relaxed bg-transparent text-foreground/80"
              placeholder="A transcrição aparecerá aqui..."
              value={transcript}
              readOnly
            />
            {!transcript && (
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