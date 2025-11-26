import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ScanText, Loader2, Copy, Check, Image as ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useProject } from "./project-context";

export function OcrPanel() {
  const { addItem, updateItemStatus, items } = useProject();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeText, setActiveText] = useState("");
  const [copied, setCopied] = useState(false);

  const ocrItems = items.filter(i => i.type === 'ocr');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      addItem({
        type: "ocr",
        name: file.name,
        file: file,
        preview: URL.createObjectURL(file)
      });
    });
    
    toast({
      title: "Imagem adicionada ao projeto",
      description: "Pronto para extrair texto.",
    });
  }, [addItem]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 10
  });

  const processQueue = async () => {
    const pendingItems = ocrItems.filter(i => i.status === 'pending');
    if (pendingItems.length === 0) return;
    
    setIsProcessing(true);
    
    for (let i = 0; i < pendingItems.length; i++) {
      const item = pendingItems[i];
      updateItemStatus(item.id, "processing");
      
      try {
        // Call real API
        const formData = new FormData();
        formData.append('image', item.file!);
        
        const response = await fetch('/api/extract-text', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.details || error.error || 'Erro na extração');
        }

        const data = await response.json();
        const extractedText = `[${item.name}]\n${data.extractedText}\n\n`;
        
        updateItemStatus(item.id, "completed", extractedText);
        setActiveText(prev => prev + extractedText);
      } catch (error: any) {
        console.error('Erro ao extrair texto:', error);
        updateItemStatus(item.id, "error");
        toast({
          title: "Erro na extração",
          description: error.message || "Falha ao processar imagem",
          variant: "destructive",
        });
      }
    }

    setIsProcessing(false);
    toast({
      title: "Extração Concluída",
      description: `${pendingItems.length} imagem(ns) processada(s) com sucesso.`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    toast({ title: "Texto copiado" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
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
            `}
          >
            <input {...getInputProps()} />
            
            <AnimatePresence mode="wait">
               {ocrItems.length > 0 ? (
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
                     <p className="text-sm font-medium text-muted-foreground">Adicionar mais imagens</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {ocrItems.map((item) => (
                      <div key={item.id} className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border/50">
                         {item.preview && <img src={item.preview} className="w-full h-full object-cover opacity-80" />}
                         <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-medium p-1 text-center">
                            {item.status === 'completed' ? <Check className="h-6 w-6" /> : item.name}
                         </div>
                         {item.status === 'processing' && (
                           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-white" />
                           </div>
                         )}
                      </div>
                    ))}
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
                    <p className="font-bold text-xl text-foreground">Arraste múltiplas imagens</p>
                    <p className="text-muted-foreground">Manuscritos ou documentos</p>
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
            disabled={ocrItems.filter(i => i.status === 'pending').length === 0 || isProcessing}
            onClick={processQueue}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Analisando Lote...
              </>
            ) : (
              <>
                <ScanText className="mr-3 h-5 w-5" />
                 {ocrItems.length > 0 ? `Extrair de ${ocrItems.filter(i => i.status === 'pending').length} Imagens` : 'Iniciar Extração'}
              </>
            )}
          </Button>
        </motion.div>
      </div>

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
              <span className="text-sm font-semibold text-foreground bg-white px-3 py-1 rounded-full border border-border/50 shadow-sm">Texto Combinado</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!activeText} className="h-8 w-8 p-0 rounded-full hover:bg-background">
                 {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <Textarea 
              className="h-full w-full resize-none border-0 focus-visible:ring-0 p-8 font-sans text-base leading-relaxed bg-transparent text-foreground/80"
              placeholder="O texto extraído aparecerá aqui..."
              value={activeText}
              readOnly
            />
             {!activeText && (
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