# 🌊 Coral Fit - E-commerce de Moda Praia e Fitness

Site de e-commerce completo para a marca Coral Fit, com integração com Google Sheets para gerenciamento de produtos e checkout via WhatsApp.

## ✨ Funcionalidades

- 🛍️ **Catálogo Dinâmico**: Produtos carregados automaticamente do Google Sheets
- 🎨 **Múltiplas Cores**: Cada produto pode ter várias opções de cores
- 📏 **Tamanhos Variados**: Sistema flexível de tamanhos (P, M, G, GG, etc)
- 🛒 **Carrinho de Compras**: Adicionar, remover e ajustar quantidades
- 📦 **Dois Tipos de Entrega**: Retirada na loja ou entrega (frete por conta do cliente)
- 💬 **Checkout via WhatsApp**: Pedidos enviados automaticamente formatados
- 🎯 **Filtros**: Filtrar produtos por categoria (Fitness/Praia)
- 📱 **Responsivo**: Design adaptado para mobile e desktop
- 🔄 **Atualização em Tempo Real**: Recarregar produtos da planilha com um clique

## 🎨 Design

- Interface moderna com gradientes e animações suaves
- Paleta de cores inspirada na logo (tons de azul turquesa)
- UI/UX intuitiva e elegante
- Efeitos hover e transições fluidas

## 🚀 Configuração Rápida

### 1. Configurar WhatsApp

Edite `/components/CheckoutModal.tsx` linha 61:
```typescript
const whatsappNumber = '5511999999999'; // Substitua pelo seu número
```

Use o formato: código do país + DDD + número (sem espaços)
- Exemplo: `5511987654321`

### 2. Configurar Planilha

#### Tornar a Planilha Pública:
1. Abra a planilha no Google Sheets
2. Clique em "Compartilhar"
3. "Acesso geral" → "Qualquer pessoa com o link"
4. Permissão: "Leitor"
5. Salvar

#### Estrutura Mínima:
Na aba **ESTOQUE**, crie estas colunas:

**Obrigatórias:**
- ID (ex: prod-001)
- NOME (ex: "Top Fitness")
- PREÇO (ex: "R$ 89,90" ou "89.90")

**Opcionais:**
- CATEGORIA (fitness ou praia)
- CORES (ex: "preto, turquesa, rosa")
- TAMANHOS (ex: "P, M, G, GG")
- DESCRIÇÃO
- IMAGEM (URL da imagem)

#### Exemplo:
| ID | NOME | PREÇO | CATEGORIA | CORES | TAMANHOS |
|----|------|-------|-----------|-------|----------|
| prod-001 | Top Fitness | R$ 89,90 | fitness | preto, turquesa | P, M, G, GG |
| prod-002 | Biquíni Verão | 129.90 | praia | coral, branco | P, M, G |

### 3. Cores Reconhecidas

O sistema reconhece automaticamente estas cores:
- **Básicas**: preto, branco, cinza, cinza escuro
- **Azuis**: turquesa, azul turquesa, azul, azul royal, azul marinho, azul petróleo
- **Quentes**: coral, rosa, pink, vermelho, laranja
- **Verdes**: verde, verde menta, verde limão
- **Outras**: amarelo, roxo, lilás, vinho, bege, nude

## 📝 Documentação Completa

- **CONFIGURACAO.md** - Guia completo de configuração
- **README-PLANILHA.md** - Instruções detalhadas da planilha

## 🛠️ Ferramentas de Debug

O site inclui ferramentas de desenvolvimento:

- **Botão "📊 Configurar Planilha"** (canto inferior esquerdo)
  - Guia visual de configuração
  - Exemplos e dicas
  
- **Botão de Debug** (canto inferior direito - roxo)
  - Testar conexão com a planilha
  - Ver dados brutos carregados

- **Botão Recarregar** (ao lado dos filtros)
  - Atualizar produtos após modificar a planilha

⚠️ **Produção**: Remova as ferramentas de debug antes de publicar:
```typescript
// Em /App.tsx, remova estas linhas:
<SheetDebugger />
<SetupGuide />
```

## 🔄 Fluxo de Uso

1. Cliente navega pelo catálogo
2. Seleciona produto e escolhe cor + tamanho
3. Adiciona ao carrinho
4. No carrinho, ajusta quantidades
5. Clica em "Finalizar Pedido"
6. Preenche dados pessoais e endereço
7. Escolhe tipo de entrega (retirada ou entrega)
8. Clica em "Enviar Pedido via WhatsApp"
9. WhatsApp abre com mensagem formatada contendo todos os dados
10. Cliente envia a mensagem

## 📂 Estrutura do Projeto

```
/
├── components/          # Componentes React
│   ├── Header.tsx       # Cabeçalho com logo e carrinho
│   ├── ProductGrid.tsx  # Grade de produtos
│   ├── ProductCard.tsx  # Card individual do produto
│   ├── ProductModal.tsx # Modal de detalhes do produto
│   ├── Cart.tsx         # Carrinho lateral
│   ├── CheckoutModal.tsx # Modal de finalização
│   ├── SetupGuide.tsx   # Guia de configuração
│   └── SheetDebugger.tsx # Ferramenta de debug
├── services/
│   └── googleSheets.ts  # Serviço de integração com Google Sheets
├── types.ts             # Tipos TypeScript
├── App.tsx              # Componente principal
└── styles/
    └── globals.css      # Estilos globais
```

## 🎯 Próximos Passos

1. ✅ Substituir número do WhatsApp
2. ✅ Configurar planilha e torná-la pública
3. ✅ Adicionar produtos na planilha
4. ✅ Testar o fluxo completo
5. ✅ Remover ferramentas de debug
6. ✅ Publicar o site

## 💡 Dicas

- **Imagens**: Use URLs públicas (Google Drive, Imgur, etc)
- **Cores**: Use os nomes exatos listados acima
- **Preços**: Aceita tanto "R$ 89,90" quanto "89.90"
- **Atualização**: Após modificar a planilha, clique no botão recarregar

## 🐛 Solução de Problemas

**Produtos não aparecem:**
- Verifique se a planilha está pública
- Confirme que a aba se chama "ESTOQUE"
- Veja o console do navegador (F12) para erros

**Erro de CORS:**
- A planilha precisa estar pública
- Verifique as configurações de compartilhamento

**Cores não aparecem corretamente:**
- Use os nomes de cores listados (sem acentos)
- Separe por vírgula ou ponto e vírgula

## 📱 Suporte

Use os botões de ajuda no site:
- 📊 Configurar Planilha - Guia visual
- 🔄 Debug - Testar conexão

---

Desenvolvido para Coral Fit 🌊
