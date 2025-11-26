import React, { createContext, useContext, useState, ReactNode } from "react";

export type ProjectItem = {
  id: string;
  type: "audio" | "ocr";
  name: string;
  status: "pending" | "processing" | "completed" | "error";
  content?: string; // The transcription or extracted text
  file?: File;
  preview?: string; // For images
};

interface ProjectContextType {
  items: ProjectItem[];
  addItem: (item: Omit<ProjectItem, "id" | "status">) => void;
  updateItemStatus: (id: string, status: ProjectItem["status"], content?: string) => void;
  removeItem: (id: string) => void;
  clearProject: () => void;
  generateReport: () => Promise<string>;
  isGeneratingReport: boolean;
  reportSummary: string | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportSummary, setReportSummary] = useState<string | null>(null);

  const addItem = (newItem: Omit<ProjectItem, "id" | "status">) => {
    const id = Math.random().toString(36).substring(7);
    setItems((prev) => [...prev, { ...newItem, id, status: "pending" }]);
  };

  const updateItemStatus = (id: string, status: ProjectItem["status"], content?: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status, ...(content ? { content } : {}) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearProject = () => {
    setItems([]);
    setReportSummary(null);
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    
    // Simulate AI Summary generation
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const summary = `
RELATÓRIO EXECUTIVO E PLANO DE AÇÃO
Data: ${new Date().toLocaleDateString('pt-BR')}

RESUMO GERAL:
O projeto contém ${items.filter(i => i.type === 'audio').length} arquivos de áudio e ${items.filter(i => i.type === 'ocr').length} documentos digitalizados. 
A análise cruzada indica uma necessidade de reestruturação nos processos de atendimento ao cliente e digitalização de arquivos físicos.

PRINCIPAIS PONTOS IDENTIFICADOS:
1. Reuniões de Equipe (Áudio):
   - Foi discutido o novo cronograma de lançamentos.
   - Identificada falha na comunicação entre vendas e marketing.
   - Ação Necessária: Agendar reunião de alinhamento semanal.

2. Documentos Digitalizados (Manuscritos):
   - As notas manuais contêm esboços da nova interface.
   - Lista de pendências técnicas prioritárias identificada.
   - Ação Necessária: Transpor esboços para o Figma até sexta-feira.

PLANO DE AÇÃO SUGERIDO:
[ ] Criar canal de comunicação unificado (Slack/Discord).
[ ] Digitalizar o restante do arquivo morto de 2023.
[ ] Revisar o orçamento de Q4 com base nas transcrições financeiras.

Este relatório foi gerado automaticamente pela Trust AI.
        `;
        setReportSummary(summary);
        setIsGeneratingReport(false);
        resolve(summary);
      }, 2500);
    });
  };

  return (
    <ProjectContext.Provider
      value={{
        items,
        addItem,
        updateItemStatus,
        removeItem,
        clearProject,
        generateReport,
        isGeneratingReport,
        reportSummary,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}