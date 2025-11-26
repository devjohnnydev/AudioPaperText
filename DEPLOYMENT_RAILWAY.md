# Deploy Trust AI no Railway

## 1️⃣ Preparação no GitHub

```bash
# Certifique-se de estar no repositório local
git add .
git commit -m "Deploy Trust AI - Railway ready"
git push origin main
```

## 2️⃣ Deploy no Railway

### Opção A: Dashboard do Railway (Recomendado)
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Selecione seu repositório

### Opção B: CLI do Railway

```bash
# Instale o CLI
npm i -g @railway/cli

# Faça login
railway login

# Deploy
railway up
```

## 3️⃣ Configurar Variáveis de Ambiente

No painel do Railway, abra seu projeto e clique em **"Variables"**:

### Variáveis Necessárias:

```
GROQ_API_KEY = sua_chave_groq_aqui
OPENAI_API_KEY = sua_chave_openai_aqui (opcional)
NODE_ENV = production
```

## 4️⃣ Adicionar PostgreSQL

1. No seu projeto Railway, clique em **"+ Create"**
2. Selecione **"Database"** → **"PostgreSQL"**
3. Railway vinculará automaticamente o `DATABASE_URL`

## 5️⃣ Verificar Deploy

```bash
# Ver logs em tempo real
railway logs

# Ver status
railway status

# URL da sua aplicação
railway open
```

## 🎯 Pronto!

Sua aplicação Trust AI estará disponível em uma URL do Railway (ex: `trust-ai-production.up.railway.app`)

## 🆘 Solução de Problemas

### Erro: "GROQ_API_KEY não está configurada"
- Verifique se adicionou a variável em **Railway Dashboard → Variables**
- Confirme que copiou corretamente a chave (sem espaços)
- Redeploy após adicionar a variável

### Erro 500 no upload
- Verifique se PostgreSQL está conectado
- Veja os logs: `railway logs`

### Banco de dados não encontrado
- O Railway cria automaticamente
- Se precisar resetar: Delete e recrie a instância PostgreSQL

## 📊 Monitoramento

- Logs: Dashboard do Railway → Logs
- Métricas: Dashboard → Monitoring
- Deploy automático: Qualquer push em `main` fará redeploy

---

Para obter sua **Groq API Key** (GRATUITA):
1. Acesse [console.groq.com](https://console.groq.com/keys)
2. Crie uma conta
3. Gere uma API Key
4. Copie e cole no Railway