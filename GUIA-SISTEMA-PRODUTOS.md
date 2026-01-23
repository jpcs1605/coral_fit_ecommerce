# Sistema de Produtos - Guia de Uso

## ✅ Como o Sistema Funciona

### 1. Cadastro de Produtos (Admin)
- Acesse: `http://localhost:3000/admin.html`
- Login: `adminCoral` / `Coral160805`
- Cadastre produtos com todas as informações
- Upload de imagens locais (comprimidas automaticamente)
- Gerencie estoque por cor e tamanho

### 2. Exibição no Site Principal
- Os produtos são salvos no **localStorage** do navegador
- O site principal carrega automaticamente do localStorage
- Atualização em tempo real quando cadastrar novos produtos

## 🔄 Sincronização Automática

### Como Funciona:
1. **Admin cadastra produto** → Salva no localStorage
2. **productService dispara evento** → `productsUpdated`
3. **Site principal escuta evento** → Recarrega produtos automaticamente

### Se não atualizar automaticamente:
- Clique no botão de **Recarregar** no site
- Ou pressione **F5** para atualizar a página

## 📝 Passos para Testar

1. **Abra o Admin em uma aba:**
   ```
   http://localhost:3000/admin.html
   ```

2. **Abra o Site em outra aba:**
   ```
   http://localhost:3000/
   ```

3. **No Admin:**
   - Faça login
   - Cadastre um produto novo
   - Defina estoque
   - Salve

4. **No Site:**
   - O produto deve aparecer automaticamente
   - Se não aparecer, clique em "Recarregar"

## 🐛 Troubleshooting

### Produtos não aparecem:
1. Verifique se está usando o **mesmo navegador** e **mesma URL base**
2. Abra DevTools (F12) → Console → Veja se há erros
3. DevTools → Application → Local Storage → Verifique `coral_fit_products`
4. Tente limpar o cache e recarregar (Ctrl+Shift+R)

### Produtos aparecem no admin mas não no site:
1. Verifique se ambas as páginas estão no mesmo domínio/porta
2. Confirme que localStorage está habilitado no navegador
3. Tente exportar os produtos (JSON) e reimportar

## 💡 Dicas

- **Backup**: Use "Exportar JSON" no admin regularmente
- **Importar**: Se perder dados, use "Importar JSON"
- **Imagens**: São salvas em base64, mantendo tudo local
- **Estoque**: Configure antes de publicar produtos

## 🔗 URLs

- **Site Principal**: `http://localhost:3000/`
- **Admin**: `http://localhost:3000/admin.html`
- **Produção Site**: `https://jpcs1605.github.io/coral_fit_ecommerce/`
- **Produção Admin**: `https://jpcs1605.github.io/coral_fit_ecommerce/admin.html`
