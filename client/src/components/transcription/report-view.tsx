import { useState } from "react";
import { useProject } from "./project-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, Loader2, CheckCircle2, FileAudio, Image as ImageIcon, Trash2, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ReportView() {
  const { items, removeItem, generateReport, isGeneratingReport, reportSummary } = useProject();
  const [isOpen, setIsOpen] = useState(false);

  const completedItems = items.filter(i => i.status === "completed");
  const hasItems = items.length > 0;

  const handleGenerate = async () => {
    await generateReport();
    setIsOpen(true);
  };

  const downloadReport = () => {
    if (!reportSummary) return;
    const element = document.createElement("a");
    const file = new Blob([reportSummary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "Relatorio_TrustAI.txt";
    document.body.appendChild(element);
    element.click();
  };

  if (!hasItems) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end pointer-events-none">
      {/* Floating Project Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/80 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-4 w-80 pointer-events-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Fila de Projeto ({items.length})</h3>
          {items.some(i => i.status === "completed") && (
             <Button size="sm" variant="default" className="h-7 text-xs gap-1" onClick={handleGenerate} disabled={isGeneratingReport}>
               {isGeneratingReport ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
               Gerar Relatório
             </Button>
          )}
        </div>
        
        <ScrollArea className="h-40 rounded-lg border bg-muted/20">
          <div className="p-2 space-y-2">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 bg-background p-2 rounded-lg border border-border shadow-sm"
                >
                  <div className={`p-1.5 rounded-md ${item.type === 'audio' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    {item.type === 'audio' ? <FileAudio className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{item.status === 'completed' ? 'Concluído' : item.status === 'processing' ? 'Processando...' : 'Pendente'}</p>
                  </div>
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </motion.div>

      {/* Report Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl pointer-events-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Relatório Consolidado
            </DialogTitle>
            <DialogDescription>
              Resumo inteligente gerado a partir de {completedItems.length} arquivos processados.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 bg-muted/30 p-4 rounded-xl border border-border">
            <Textarea 
              value={reportSummary || ""} 
              readOnly 
              className="min-h-[300px] font-mono text-sm bg-transparent border-0 focus-visible:ring-0 resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Fechar</Button>
            <Button onClick={downloadReport} className="gap-2">
              <Download className="h-4 w-4" />
              Baixar Relatório (.txt)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}