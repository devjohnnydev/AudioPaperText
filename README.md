# Trust AI - Transcrição e OCR com IA

Sistema completo para transcrição de áudio e reconhecimento de texto manuscrito (OCR) usando Groq AI. Desenvolvido com React, Express, Tailwind CSS e integração com modelos de IA.

## 🚀 Funcionalidades

- **Transcrição de Áudio**: Converta arquivos de áudio (MP3, WAV, M4A) em texto usando Whisper da Groq
- **OCR de Manuscritos**: Extraia texto de imagens de documentos manuscritos ou impressos usando Llama Vision
- **Processamento em Lote**: Envie múltiplos arquivos de uma vez
- **Relatório Inteligente**: Gere relatórios executivos automáticos com análise de conteúdo usando IA
- **Interface Moderna**: Design limpo e responsivo com animações suaves

## 🔑 Configuração de API Keys

O projeto usa a **Groq API** (gratuita e rápida) para todos os serviços de IA:

### Obtendo sua Groq API Key:
1. Acesse [console.groq.com](https://console.groq.com/keys)
2. Crie uma conta (gratuito)
3. Gere uma API key
4. Adicione às variáveis de ambiente

```bash
GROQ_API_KEY=sua_chave_aqui
```

## 🛠️ Desenvolvimento Local

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz:
   ```
   GROQ_API_KEY=sua_chave_groq
   DATABASE_URL=sua_url_postgres
   ```
4. Configure o banco de dados:
   ```bash
   npm run db:push
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 📦 Deploy no Railway

### 1. Preparação
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

### 2. Deploy no Railway
1. Acesse [railway.app](https://railway.app/)
2. Faça login com GitHub
3. Crie novo projeto > "Deploy from GitHub repo"
4. Selecione seu repositório

### 3. Configure as Variáveis de Ambiente
No painel do Railway, adicione:
- `GROQ_API_KEY` - Sua chave da Groq
- `DATABASE_URL` - Será criado automaticamente ao adicionar Postgres

### 4. Adicione PostgreSQL
- No seu projeto Railway, clique em "+ New"
- Selecione "Database" > "PostgreSQL"
- O Railway vinculará automaticamente ao seu app

## 🎯 Como Usar

### Transcrição de Áudio
1. Arraste e solte arquivos MP3, WAV ou M4A
2. Clique em "Transcrever Áudios"
3. Aguarde o processamento
4. Copie ou baixe o texto transcrito

### OCR de Manuscritos
1. Arraste imagens de documentos (PNG, JPG, WEBP)
2. Clique em "Extrair Texto"
3. O texto será extraído automaticamente
4. Copie ou visualize o resultado

### Gerar Relatório
1. Processe alguns áudios e/ou documentos
2. Clique em "Gerar Relatório" na fila flutuante
3. A IA analisará todo o conteúdo e criará um relatório executivo
4. Baixe o relatório em formato .txt

## 📂 Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes UI
│   │   ├── pages/          # Páginas da aplicação
│   │   └── lib/            # Utilitários
│   └── index.html
├── server/                 # Backend Express
│   ├── ai-service.ts       # Integração com Groq AI
│   ├── routes.ts           # Rotas da API
│   ├── storage.ts          # Camada de persistência
│   └── db.ts               # Conexão com banco
├── shared/                 # Código compartilhado
│   └── schema.ts           # Schema Drizzle ORM
└── README.md
```

## 🔒 Segurança

- ✅ API keys armazenadas em variáveis de ambiente
- ✅ Validação de arquivos no upload
- ✅ Limite de tamanho de arquivo (25MB)
- ✅ Limpeza automática de arquivos temporários
- ✅ Sem exposição de chaves no frontend

## 🆘 Solução de Problemas

### Erro: "GROQ_API_KEY não configurada"
- Certifique-se de ter adicionado a chave nas variáveis de ambiente
- Crie um arquivo `.env` com: `GROQ_API_KEY=sua_chave_aqui`

### Erro no upload de arquivo
- Verifique se o arquivo tem menos de 25MB
- Formatos suportados: MP3, WAV, M4A (áudio) / PNG, JPG, WEBP (imagem)

### Banco de dados não encontrado
- Execute `npm run db:push` para criar as tabelas
- Verifique se o DATABASE_URL está configurado

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---
© 2024 Trust AI - Powered by Groq