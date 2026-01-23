# 🛍️ Sistema de Produtos - Guia Rápido

## 📋 Como Funciona

Os produtos ficam salvos no **localStorage do navegador** e são exportados para um arquivo JSON que alimenta o site.

## 🔄 Fluxo de Trabalho

### 1️⃣ Cadastrar Produtos
```
Acesse: admin.html
Login: adminCoral / Coral160805
Cadastre produtos normalmente
```

### 2️⃣ Gerar Arquivo JSON
```
No Admin → Clique em "Gerar products.json" (botão verde)
Arquivo será baixado: ~/Downloads/products.json
```

### 3️⃣ Atualizar no Projeto
```bash
# Copiar arquivo para o projeto
cp ~/Downloads/products.json public/products.json

# Deploy
npm run deploy
```

### 4️⃣ Pronto!
O site carrega os produtos do arquivo `public/products.json`

## 🎮 Botões do Admin

| Botão | Função |
|-------|--------|
| 💾 **Gerar products.json** | Baixa arquivo para copiar para public/ |
| ⬇️ **Backup JSON** | Exporta backup com data |
| ⬆️ **Importar JSON** | Restaura de backup |

## 📁 Estrutura

```
coral_fit_ecommerce/
├── public/
│   └── products.json        ← Arquivo que o site usa
├── admin.html               ← Painel administrativo
└── src/
    └── services/
        └── productService.ts
```

## 💡 Dicas

- **Backup Regular**: Clique em "Backup JSON" antes de mudanças grandes
- **localStorage**: Dados ficam no navegador (não se perdem ao fechar)
- **Limpar Cache**: Se limpar dados do navegador, use "Importar JSON" para restaurar

## ⚡ Atalho Rápido

```bash
# Script completo
cp ~/Downloads/products.json public/products.json && npm run deploy
```

## 🐛 Troubleshooting

**Produtos não aparecem no site?**
1. Verifique se o arquivo existe: `cat public/products.json`
2. Execute o deploy: `npm run deploy`
3. Limpe o cache do navegador: Ctrl+Shift+R

**LocalStorage perdido?**
1. Use "Importar JSON" com um backup
2. Ou cadastre os produtos novamente

## 📊 Dados Salvos

- **localStorage**: `coral_fit_products` (temporário, no navegador)
- **public/products.json**: Arquivo usado pelo site (permanente)

Simples e funcional! 🎉
