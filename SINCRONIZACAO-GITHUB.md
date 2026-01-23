# 🔄 Sistema de Sincronização - Produtos no GitHub

## 📁 Arquitetura

```
localStorage (Admin) ←→ products.json (Repositório GitHub) ←→ Site (Público)
```

## 🎯 Fluxo de Trabalho

### 1️⃣ **Cadastrar Produtos (Admin)**
1. Acesse: `admin.html`
2. Login: `adminCoral` / `Coral160805`
3. Cadastre seus produtos normalmente
4. Os produtos ficam salvos no **localStorage** do navegador

### 2️⃣ **Salvar no Repositório**
Após cadastrar/editar produtos:

1. **No Admin**, clique em: **"Salvar no Projeto"** (botão verde)
2. Um arquivo `products.json` será baixado
3. **Substitua** o arquivo no projeto:
   ```bash
   # O arquivo baixado vai para ~/Downloads/products.json
   # Copie para o projeto:
   cp ~/Downloads/products.json public/products.json
   ```
4. **Commit e Push**:
   ```bash
   git add public/products.json
   git commit -m "Atualizar produtos"
   git push origin main
   ```

### 3️⃣ **Deploy Automático**
- O GitHub Pages faz deploy automático
- Aguarde ~2 minutos
- Os produtos estarão disponíveis no site público! ✅

### 4️⃣ **Sincronizar (Admin)**
Para carregar produtos do GitHub no admin:

1. Clique em: **"Sincronizar do GitHub"**
2. Os produtos do repositório serão carregados
3. Útil quando:
   - Trabalha em computador diferente
   - Limpa cache do navegador
   - Quer restaurar versão do repositório

## 🔧 Comandos Úteis

### Atualizar products.json via terminal:
```bash
cd /Users/arizona/Desktop/PESSOAL_JP/coral_fit_ecommerce

# Copiar arquivo baixado
cp ~/Downloads/products.json public/products.json

# Commit e push
git add public/products.json
git commit -m "Atualizar catálogo de produtos - $(date +%Y-%m-%d)"
git push origin main
```

### Ver diferenças antes de commit:
```bash
git diff public/products.json
```

### Deploy manual:
```bash
npm run deploy
```

## 📊 Botões do Admin

| Botão | Ícone | Função |
|-------|-------|--------|
| **Sincronizar do GitHub** | ☁️ | Carrega produtos do repositório |
| **Salvar no Projeto** | 💾 | Baixa products.json para substituir |
| **Backup JSON** | ⬇️ | Exporta backup com data |
| **Importar JSON** | ⬆️ | Importa de arquivo backup |

## ⚠️ Importante

### **localStorage vs GitHub**
- **localStorage**: Rápido, local, temporário
- **GitHub**: Permanente, público, versionado

### **Sempre faça:**
1. ✅ Salvar no Projeto após mudanças importantes
2. ✅ Commit regularmente (pelo menos 1x por dia)
3. ✅ Fazer backup antes de mudanças grandes
4. ✅ Testar no site após deploy

### **Nunca:**
- ❌ Confiar apenas no localStorage
- ❌ Esquecer de fazer commit
- ❌ Editar products.json manualmente (use o admin)

## 🚀 Workflow Recomendado

### Diário:
```bash
# Manhã: Sincronizar
- Admin → "Sincronizar do GitHub"

# Durante o dia: Trabalhar normalmente
- Cadastrar/editar produtos no admin

# Fim do dia: Salvar
- Admin → "Salvar no Projeto"
- Terminal → commit e push
```

### Semanal:
```bash
# Backup completo
- Admin → "Backup JSON"
- Salvar arquivo em local seguro (Dropbox, etc)
```

## 🔄 Sincronização Entre Computadores

### Computador A:
1. Edita produtos no admin
2. "Salvar no Projeto" → commit → push

### Computador B:
1. `git pull origin main`
2. Admin → "Sincronizar do GitHub"
3. Produtos atualizados! ✅

## 📱 URLs

- **Admin Local**: `http://localhost:3001/coral_fit_ecommerce/admin.html`
- **Site Local**: `http://localhost:3001/coral_fit_ecommerce/`
- **Admin Produção**: `https://jpcs1605.github.io/coral_fit_ecommerce/admin.html`
- **Site Produção**: `https://jpcs1605.github.io/coral_fit_ecommerce/`
- **products.json**: `https://jpcs1605.github.io/coral_fit_ecommerce/products.json`

## 🐛 Troubleshooting

### Produtos não aparecem no site:
1. Verifique se fez commit do products.json
2. Aguarde deploy do GitHub Pages (~2 min)
3. Limpe cache do navegador (Ctrl+Shift+R)
4. Acesse: `https://jpcs1605.github.io/coral_fit_ecommerce/products.json`

### localStorage perdido:
1. Admin → "Sincronizar do GitHub"
2. Ou use backup JSON salvo

### Conflito de versões:
1. Faça backup: "Backup JSON"
2. Sincronize do GitHub
3. Compare versões
4. Reimporte se necessário

## 💡 Dicas

- Use mensagens de commit descritivas
- Faça backup antes de mudanças grandes
- Teste localmente antes do deploy
- Mantenha products.json no .gitignore se quiser (mas perde sincronização)
