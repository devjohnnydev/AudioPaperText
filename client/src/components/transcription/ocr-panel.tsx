import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ScanText, Loader2, Copy, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function OcrPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setExtractedText("");
      toast({
        title: "Imagem carregada",
        description: "Pronto para extrair texto.",
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  });

  const handleExtract = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 8;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      setProgress(100);
      setExtractedText(
        "Plano do Projeto Trust AI:\n\n1. Integração Whisper para Áudio\n2. Adicionar Llama 3 Vision para OCR\n3. Implementação de Segurança Avançada\n\nNota: A precisão do reconhecimento de manuscrito foi aprimorada na versão 2.0."
      );
      toast({
        title: "Extração concluída",
        description: "Texto extraído com sucesso.",
      });
    }, 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
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
              w-full h-full border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-300
              flex flex-col items-center justify-center relative overflow-hidden bg-white shadow-sm group
              ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:shadow-md'}
              ${!preview ? 'p-8' : 'p-0 border-none ring-1 ring-border'}
            `}
          >
            <input {...getInputProps()} />
            
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full h-full group/image"
                >
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Button variant="secondary" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }} className="rounded-full shadow-lg">
                      Substituir Imagem
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-primary/10 p-6 rounded-full mx-auto w-fit group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary group-hover:text-white">
                    <ImageIcon className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-xl text-foreground">Arraste uma imagem</p>
                    <p className="text-muted-foreground">Manuscritos ou documentos impressos</p>
                  </div>
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
            disabled={!file || isProcessing}
            onClick={handleExtract}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Analisando Documento...
              </>
            ) : (
              <>
                <ScanText className="mr-3 h-5 w-5" />
                Extrair Texto
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
                Processando visual...
              </span>
              <span className="text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2.5 bg-secondary" indicatorClassName="bg-primary" />
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
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-foreground bg-white px-3 py-1 rounded-full border border-border/50 shadow-sm">Texto Extraído</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!extractedText} className="h-8 w-8 p-0 rounded-full hover:bg-background">
                 {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <Textarea 
              className="h-full w-full resize-none border-0 focus-visible:ring-0 p-8 font-sans text-base leading-relaxed bg-transparent text-foreground/80"
              placeholder="O texto extraído aparecerá aqui..."
              value={extractedText}
              readOnly
            />
             {!extractedText && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-10">
                <ScanText className="h-24 w-24" />
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}