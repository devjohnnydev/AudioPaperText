import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, ScanText, Loader2, FileText, Crop, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export function OcrPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setExtractedText("");
      toast({
        title: "Image loaded",
        description: "Ready to extract text from handwriting.",
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

    // Simulation of processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 8; // Faster than audio
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      setProgress(100);
      setExtractedText(
        "NeuroScribe Project Plan:\n\n1. Integrate Whisper for Audio\n2. Add Llama 3 Vision for OCR\n3. Deploy to Railway\n\nNotes: The handwriting recognition model needs to be robust enough to handle cursive styles."
      );
      toast({
        title: "Extraction complete",
        description: "Handwriting has been converted to text.",
      });
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="space-y-6">
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200
            flex flex-col items-center justify-center h-[400px] relative overflow-hidden
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
            ${!preview ? 'p-8' : 'p-0 border-none'}
          `}
        >
          <input {...getInputProps()} />
          
          {preview ? (
            <div className="relative w-full h-full group">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-contain bg-black/5" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}>
                  Replace Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-full mx-auto w-fit">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-lg">Drop image of text here</p>
                <p className="text-sm text-muted-foreground mt-1">Handwriting or printed documents</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button 
            className="flex-1 h-12 text-base bg-indigo-600 hover:bg-indigo-700 text-white" 
            disabled={!file || isProcessing}
            onClick={handleExtract}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning Document...
              </>
            ) : (
              <>
                <ScanText className="mr-2 h-4 w-4" />
                Extract Handwriting
              </>
            )}
          </Button>
        </div>

        {isProcessing && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Analyzing visual data...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      <div className="h-full min-h-[300px] lg:min-h-auto flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Extracted Text
          </h3>
          <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(extractedText); toast({ title: "Copied to clipboard" }); }} disabled={!extractedText}>
            Copy Text
          </Button>
        </div>
        <Card className="flex-1 p-0 overflow-hidden border-muted bg-muted/10">
          <Textarea 
            className="h-full w-full resize-none border-0 focus-visible:ring-0 p-6 font-mono text-sm leading-relaxed bg-transparent"
            placeholder="Extracted handwriting text will appear here..."
            value={extractedText}
            readOnly
          />
        </Card>
      </div>
    </div>
  );
}