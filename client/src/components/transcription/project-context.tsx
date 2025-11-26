import React, { createContext, useContext, useState, ReactNode } from "react";

export type ProjectItem = {
  id: string;
  type: "audio" | "ocr";
  name: string;
  status: "pending" | "processing" | "completed" | "error";
  content?: string;
  file?: File;
  preview?: string;
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
    
    try {
      // Prepare data for API
      const audioItems = items
        .filter(i => i.type === 'audio' && i.status === 'completed' && i.content)
        .map(i => ({ name: i.name, content: i.content! }));
      
      const ocrItems = items
        .filter(i => i.type === 'ocr' && i.status === 'completed' && i.content)
        .map(i => ({ name: i.name, content: i.content! }));

      // Call real API
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioItems, ocrItems }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Erro ao gerar relatório');
      }

      const data = await response.json();
      setReportSummary(data.report);
      setIsGeneratingReport(false);
      return data.report;
    } catch (error: any) {
      console.error('Erro ao gerar relatório:', error);
      setIsGeneratingReport(false);
      
      // Fallback to simple concatenation if API fails
      const fallbackReport = `RELATÓRIO CONSOLIDADO - Trust AI\nData: ${new Date().toLocaleDateString('pt-BR')}\n\n` +
        `ERRO: ${error.message}\n\nPor favor, verifique se a GROQ_API_KEY está configurada corretamente.`;
      
      setReportSummary(fallbackReport);
      return fallbackReport;
    }
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