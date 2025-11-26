import Groq from "groq-sdk";
import fs from "fs";

// Using Groq - free and fast API
let groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || "placeholder",
    });
  }
  return groq;
}

/**
 * Check if Groq API key is configured
 */
export function isGroqConfigured(): boolean {
  return !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "placeholder";
}

/**
 * Transcribe audio file using Groq Whisper
 */
export async function transcribeAudio(filePath: string): Promise<string> {
  if (!isGroqConfigured()) {
    // Return demo content if API key not configured (for testing)
    return "📝 Modo Demo: Para usar a transcrição real, configure GROQ_API_KEY nas variáveis de ambiente.";
  }

  try {
    // Read file as buffer to ensure proper file format detection
    const audioBuffer = fs.readFileSync(filePath);
    const fileName = filePath.split('/').pop() || 'audio.ogg';
    
    const groq = getGroqClient();
    
    // Create a File-like object that Groq SDK can understand
    const audioFile = new File([audioBuffer], fileName, { type: 'audio/ogg' });
    
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile as any,
      model: "whisper-large-v3",
      language: "pt",
      response_format: "json",
    });

    return transcription.text;
  } catch (error: any) {
    console.error("Erro na transcrição:", error);
    throw new Error("Falha ao transcrever áudio: " + error.message);
  }
}

/**
 * Extract text from image using Groq Llama Vision
 */
export async function extractTextFromImage(base64Image: string, mimeType: string = "image/jpeg"): Promise<string> {
  if (!isGroqConfigured()) {
    return "📸 Modo Demo: Para usar OCR real, configure GROQ_API_KEY nas variáveis de ambiente.";
  }

  try {
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: "llama-3.2-11b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extraia TODO o texto desta imagem. Transcreva EXATAMENTE como está escrito, incluindo anotações manuscritas, texto impresso, números, símbolos. Mantenha a formatação original. Se houver listas, mantenha-as. Se não houver texto, responda 'Nenhum texto encontrado'.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || "Nenhum texto encontrado";
  } catch (error: any) {
    console.error("Erro no OCR:", error);
    throw new Error("Falha ao extrair texto: " + error.message);
  }
}

/**
 * Generate intelligent report from transcriptions and OCR results
 */
export async function generateIntelligentReport(
  audioTranscriptions: Array<{ name: string; content: string }>,
  ocrTexts: Array<{ name: string; content: string }>
): Promise<string> {
  if (!isGroqConfigured()) {
    return `RELATÓRIO DEMO - Trust AI\nData: ${new Date().toLocaleDateString('pt-BR')}\n\nPara gerar relatórios completos, configure GROQ_API_KEY nas variáveis de ambiente.`;
  }

  try {
    const audioContent = audioTranscriptions
      .map((item, i) => `### Áudio ${i + 1}: ${item.name}\n${item.content}`)
      .join("\n\n");

    const ocrContent = ocrTexts
      .map((item, i) => `### Documento ${i + 1}: ${item.name}\n${item.content}`)
      .join("\n\n");

    const prompt = `Você é um assistente executivo especializado em análise de conteúdo e criação de relatórios.

Analise o seguinte conteúdo extraído de áudios e documentos manuscritos/impressos:

## ÁUDIOS TRANSCRITOS:
${audioContent || "Nenhum áudio fornecido."}

## DOCUMENTOS DIGITALIZADOS:
${ocrContent || "Nenhum documento fornecido."}

---

Crie um RELATÓRIO EXECUTIVO COMPLETO em português (PT-BR) que inclua:

1. **RESUMO EXECUTIVO**: Resumo geral do conteúdo analisado
2. **PRINCIPAIS PONTOS IDENTIFICADOS**: Liste os tópicos mais importantes mencionados
3. **TAREFAS E AÇÕES NECESSÁRIAS**: Identifique ações, pendências, decisões ou tarefas mencionadas
4. **ANÁLISE CRUZADA**: Se houver relação entre áudios e documentos, destaque as conexões
5. **RECOMENDAÇÕES**: Sugestões de próximos passos baseadas no conteúdo
6. **ITENS DE ATENÇÃO**: Alertas, prazos ou questões urgentes mencionadas

Seja específico, objetivo e profissional. Use formatação clara com títulos e listas.`;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Você é um assistente executivo especializado em análise de conteúdo e criação de relatórios profissionais.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    });

    return completion.choices[0]?.message?.content || "Erro ao gerar relatório.";
  } catch (error: any) {
    console.error("Erro ao gerar relatório:", error);
    throw new Error("Falha ao gerar relatório: " + error.message);
  }
}