# Trust AI - Transcrição e OCR

Este projeto é uma interface moderna para transcrição de áudio e reconhecimento de texto manuscrito (OCR), desenvolvida com React, Tailwind CSS e Vite.

## 🚀 Como Implantar no Railway

O projeto está pronto para ser hospedado no [Railway](https://railway.app/). Siga os passos abaixo:

### 1. Preparação do Repositório
1. Crie um repositório no GitHub.
2. Envie este código para o seu repositório.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
   git push -u origin main
   ```

### 2. Configuração no Railway
1. Acesse [railway.app](https://railway.app/) e faça login com seu GitHub.
2. Clique em **"New Project"** > **"Deploy from GitHub repo"**.
3. Selecione o repositório que você acabou de criar.
4. O Railway detectará automaticamente que é um projeto Node.js/Vite.

### 3. Configuração de Variáveis de Ambiente (API Keys)
**IMPORTANTE:** Nunca commite suas chaves de API diretamente no código. Use variáveis de ambiente para mantê-las seguras.

1. No dashboard do seu projeto no Railway, vá para a aba **"Variables"**.
2. Adicione suas chaves de API aqui. Por exemplo:
   - `VITE_OPENAI_API_KEY`
   - `VITE_GROQ_API_KEY`
   *(Certifique-se de que as variáveis começam com `VITE_` para serem acessíveis no frontend)*

### 4. Deploy
O Railway iniciará o build automaticamente. O comando de build configurado no `package.json` (`npm run build`) irá gerar os arquivos estáticos na pasta `dist`.

## 🛠️ Desenvolvimento Local

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto e adicione suas chaves (não commite este arquivo):
   ```
   VITE_API_KEY=sua_chave_aqui
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 📦 Estrutura do Projeto

- `client/src`: Código fonte do frontend (React).
- `client/src/components`: Componentes UI reutilizáveis.
- `client/src/components/transcription`: Componentes específicos da aplicação (AudioPanel, OcrPanel).
- `server/`: Backend (neste template, usado apenas para servir o frontend em produção).

## 🔒 Segurança

- As chaves de API não estão hardcoded no projeto.
- Toda a comunicação com APIs externas deve ser feita preferencialmente através de um proxy ou backend para evitar expor chaves no navegador, mas para protótipos rápidos, use variáveis de ambiente `VITE_`.

---
© 2024 Trust AI