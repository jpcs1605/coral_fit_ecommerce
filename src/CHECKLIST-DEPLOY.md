# ✅ Checklist para Deploy - Coral Fit

Use este checklist antes de colocar o site no ar.

## 📋 Antes de Publicar

### 1. Configuração da Planilha
- [ ] Planilha está pública (Compartilhar → "Qualquer pessoa com o link")
- [ ] Aba se chama exatamente "DATABASE_SITE"
- [ ] Colunas obrigatórias preenchidas: ID, NOME, PREÇO
- [ ] Testado carregamento de produtos (clicar no botão recarregar)
- [ ] Todas as imagens têm URLs válidas
- [ ] Cores escritas corretamente (sem acentos)

### 2. Configuração do WhatsApp
- [ ] Número do WhatsApp configurado em `/components/CheckoutModal.tsx` (linha 61)
- [ ] Formato correto: código do país + DDD + número (ex: 5511987654321)
- [ ] Testado envio de mensagem de teste

### 3. Testes Funcionais
- [ ] Adicionar produto ao carrinho funciona
- [ ] Remover produto do carrinho funciona
- [ ] Alterar quantidade funciona
- [ ] Filtros (Todos/Fitness/Praia) funcionam
- [ ] Modal de produto abre corretamente
- [ ] Seleção de cores funciona
- [ ] Seleção de tamanhos funciona
- [ ] Formulário de checkout valida campos obrigatórios
- [ ] Escolha entre entrega/retirada funciona
- [ ] Mensagem do WhatsApp é gerada corretamente

### 4. Testes Visuais
- [ ] Site funciona no celular (responsivo)
- [ ] Site funciona no tablet
- [ ] Site funciona no desktop
- [ ] Imagens carregam corretamente
- [ ] Logo aparece no header
- [ ] Cores seguem identidade da marca
- [ ] Animações funcionam suavemente

### 5. Limpeza para Produção

#### REMOVER Ferramentas de Debug:
Em `/App.tsx`, remova estas linhas:

```typescript
// REMOVER ESTAS LINHAS:
<SheetDebugger />
<SetupGuide />
```

O código deve ficar assim:
```typescript
return (
  <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
    <Header 
      cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      onCartClick={() => setCartOpen(true)}
    />
    
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 mt-8">
        <h1 className="text-cyan-700 mb-2">Coleção Verão</h1>
        <p className="text-gray-600">Moda praia e fitness com estilo</p>
      </div>
      
      <ProductGrid onAddToCart={addToCart} />
    </main>

    <Cart
      isOpen={cartOpen}
      onClose={() => setCartOpen(false)}
      items={cartItems}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      onCheckout={handleCheckout}
    />

    <CheckoutModal
      isOpen={checkoutOpen}
      onClose={() => setCheckoutOpen(false)}
      items={cartItems}
      onSuccess={() => {
        setCartItems([]);
        setCheckoutOpen(false);
      }}
    />
  </div>
);
```

### 6. Otimizações Opcionais
- [ ] Adicionar favicon personalizado
- [ ] Adicionar meta tags para SEO
- [ ] Adicionar Open Graph tags para compartilhamento
- [ ] Configurar Google Analytics (se necessário)

### 7. Teste Final
- [ ] Fazer um pedido completo de teste
- [ ] Verificar mensagem no WhatsApp
- [ ] Confirmar que todos os dados aparecem corretamente
- [ ] Testar em diferentes navegadores (Chrome, Safari, Firefox)

## 🚀 Pronto para Deploy!

Quando todos os itens estiverem marcados, o site está pronto para ir ao ar.

## 📱 Após o Deploy

### Primeira Venda
Quando receber o primeiro pedido:
1. Verifique se todas as informações chegaram corretamente
2. Confirme se os tamanhos e cores estão corretos
3. Ajuste a planilha se necessário

### Manutenção Regular
- Adicionar novos produtos: Apenas atualizar a planilha do Google Sheets
- Modificar preços: Editar diretamente na planilha
- Adicionar cores: Usar os nomes reconhecidos pelo sistema
- Atualizar fotos: Trocar as URLs na planilha

### Monitoramento
- Verificar se os produtos estão carregando (abrir o site)
- Testar periodicamente o fluxo de compra
- Verificar se o WhatsApp está recebendo mensagens

## 🆘 Suporte

Se algo não funcionar:
1. Abra o console do navegador (F12)
2. Procure por erros em vermelho
3. Verifique as configurações da planilha
4. Confirme que o número do WhatsApp está correto

## 📊 Dicas de Gestão

### Organização da Planilha
- Mantenha IDs únicos e sequenciais (prod-001, prod-002, etc)
- Use descrições claras e objetivas
- Atualize preços regularmente
- Marque produtos esgotados (ou remova da planilha)

### Fotos dos Produtos
- Use imagens de qualidade
- Tamanho recomendado: 1080x1440px (proporção 3:4)
- Fundo limpo ou branco
- Boa iluminação
- Várias fotos do mesmo produto (trocar URL quando necessário)

### Atendimento
- Responda rápido às mensagens do WhatsApp
- Confirme disponibilidade de cores e tamanhos
- Informe prazo de entrega
- Tire dúvidas sobre medidas

---

✨ Boa sorte com as vendas da Coral Fit! 🌊