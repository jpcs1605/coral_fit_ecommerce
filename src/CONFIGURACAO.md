# Configurações do Site Coral Fit

## 1. Configurar Número do WhatsApp

Para receber os pedidos no WhatsApp correto, você precisa alterar o número no arquivo `/components/CheckoutModal.tsx`:

1. Abra o arquivo `/components/CheckoutModal.tsx`
2. Localize a linha 61:
   ```typescript
   const whatsappNumber = '5511999999999'; // Substitua pelo número do WhatsApp
   ```
3. Substitua `5511999999999` pelo número completo com código do país e DDD (sem espaços ou caracteres especiais)
   
   **Exemplo:**
   - Para (11) 98765-4321 use: `5511987654321`
   - Para (21) 99876-5432 use: `5521998765432`

## 2. Configurar Planilha do Google Sheets

### Tornar a Planilha Pública

**IMPORTANTE:** A planilha precisa estar pública para o site conseguir ler os dados:

1. Abra sua planilha no Google Sheets
2. Clique em "Compartilhar" (canto superior direito)
3. Em "Acesso geral", selecione "Qualquer pessoa com o link"
4. Certifique-se de que está como "Leitor"
5. Clique em "Concluído"

### Estrutura da Planilha

A planilha deve estar na aba **DATABASE_SITE** com as seguintes colunas:

#### Colunas Obrigatórias:
- **ID** - Código único do produto (ex: prod-001, prod-002)
- **NOME** - Nome do produto
- **PREÇO** - Preço (aceita "R$ 89,90" ou "89.90")

#### Colunas Opcionais:
- **CATEGORIA** - "fitness" ou "praia"
- **CORES** - Cores separadas por vírgula (ex: "preto, turquesa, rosa")
- **TAMANHOS** - Tamanhos separados por vírgula (ex: "P, M, G, GG")
- **DESCRIÇÃO** - Descrição do produto
- **IMAGEM** - URL da imagem do produto

### Cores Reconhecidas

O sistema reconhece automaticamente estas cores:
- Básicas: preto, branco, cinza, cinza escuro
- Azuis: turquesa, azul turquesa, azul, azul royal, azul marinho, azul petróleo
- Quentes: coral, rosa, pink, vermelho, laranja
- Verdes: verde, verde menta, verde limão
- Outras: amarelo, roxo, lilás, vinho, bege, nude

### Exemplo de Planilha

| ID | NOME | PREÇO | CATEGORIA | CORES | TAMANHOS | DESCRIÇÃO | IMAGEM |
|----|------|-------|-----------|-------|----------|-----------|--------|
| prod-001 | Top Fitness Essential | R$ 89,90 | fitness | preto, turquesa, rosa | P, M, G, GG | Top com suporte médio para treinos | https://... |
| prod-002 | Biquíni Verão | 129.90 | praia | coral, branco, amarelo | P, M, G | Biquíni com bojo e amarração | https://... |
| prod-003 | Legging Compressão | R$ 139,90 | fitness | preto, cinza, vinho | P, M, G, GG | Legging de alta compressão | https://... |

### Atualizar Produtos

Depois de modificar a planilha:
1. Salve as alterações no Google Sheets
2. No site, clique no botão de recarregar (ícone circular com setas) ao lado dos filtros
3. Os produtos serão atualizados automaticamente

## 3. Alterar ID da Planilha (se necessário)

Se você quiser usar uma planilha diferente:

1. Abra o arquivo `/services/googleSheets.ts`
2. Localize a linha 3:
   ```typescript
   const SPREADSHEET_ID = '14IMBUoWENDMxAmuIEf-yu_ACEkCMjnq_T9OHYnrv3L8';
   ```
3. Substitua pelo ID da sua planilha (encontrado na URL da planilha)
   
   **Exemplo de URL:**
   ```
   https://docs.google.com/spreadsheets/d/[ID_DA_PLANILHA]/edit
   ```

## 4. Remover Ferramentas de Debug (Produção)

Antes de colocar o site no ar para clientes, remova as ferramentas de debug:

1. Abra o arquivo `/App.tsx`
2. Remova ou comente estas linhas no final do arquivo:
   ```typescript
   {/* Debug tool - remove in production */}
   <SheetDebugger />
   <SetupGuide />
   ```

## 5. Solução de Problemas

### Produtos não aparecem:
- ✅ Verifique se a planilha está pública
- ✅ Confirme que a aba se chama exatamente "DATABASE_SITE"
- ✅ Verifique se as colunas NOME e PREÇO estão preenchidas
- ✅ Abra o console do navegador (F12) para ver erros

### Imagens não aparecem:
- Use URLs completas começando com https://
- Recomendado: hospede as imagens no Google Drive (compartilhar publicamente) ou use serviços como Imgur

### Cores não reconhecidas:
- Use os nomes de cores listados acima
- Sempre em minúsculas na planilha
- Separadas por vírgula ou ponto e vírgula

## 6. Suporte

Para dúvidas ou problemas:
- Clique no botão "📊 Configurar Planilha" no canto inferior esquerdo do site
- Use o botão de debug (roxo) no canto inferior direito para testar a conexão