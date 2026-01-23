# Como Fazer Backup dos Produtos

## 📦 Exportar Produtos para Arquivo

### No Painel Admin:
1. Acesse: `http://localhost:3001/coral_fit_ecommerce/admin.html`
2. Faça login
3. Clique no botão **"Exportar JSON"** (ícone de download)
4. Um arquivo `coral_fit_products_YYYY-MM-DD.json` será baixado

### Via Console:
```javascript
// Copiar dados
const data = localStorage.getItem('coral_fit_products');
console.log(data);
// Cole o resultado em um arquivo .json
```

## 📥 Importar Produtos de Arquivo

### No Painel Admin:
1. Clique em **"Importar JSON"** (ícone de upload)
2. Selecione o arquivo `.json` exportado anteriormente
3. Os produtos serão carregados

## 🔄 Sincronizar Entre Navegadores

Como localStorage é local do navegador:

### Opção 1: Exportar e Importar
1. Navegador 1: Exportar JSON
2. Navegador 2: Importar JSON

### Opção 2: Script Manual
```javascript
// Navegador 1 - Copiar
copy(localStorage.getItem('coral_fit_products'))

// Navegador 2 - Colar
localStorage.setItem('coral_fit_products', '<cole_aqui>')
location.reload()
```

## 📍 Localização Física no Sistema

**macOS:**
```
~/Library/Application Support/[Navegador]/Default/Local Storage/
```

**Windows:**
```
C:\Users\[Usuário]\AppData\Local\[Navegador]\User Data\Default\Local Storage\
```

**Linux:**
```
~/.config/[Navegador]/Default/Local Storage/
```

⚠️ **Não é recomendado editar esses arquivos diretamente!**

## 💡 Recomendações

1. **Faça backup regularmente** - Exporte o JSON toda semana
2. **Guarde em local seguro** - Dropbox, Google Drive, etc.
3. **Versione os arquivos** - Use datas no nome do arquivo
4. **Teste a importação** - Verifique se o backup funciona

## 🚀 Futuro: Banco de Dados

Para persistência real, considere migrar para:
- Backend com API (Node.js + MongoDB/PostgreSQL)
- Firebase Firestore
- Supabase
- PocketBase

Isso permitirá:
- Sincronização entre dispositivos
- Acesso de qualquer lugar
- Backup automático
- Múltiplos usuários
