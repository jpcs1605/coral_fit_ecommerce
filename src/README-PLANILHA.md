# Instruções para Configuração da Planilha

## Estrutura da Planilha do Google Sheets

A planilha deve estar na aba **DATABASE_SITE** e conter as seguintes colunas (os nomes podem variar):

### Colunas Obrigatórias:

1. **ID** - Identificador único do produto (ex: prod-001)
2. **NOME** - Nome do produto (ex: "Top Fitness Essential")
3. **PREÇO** ou **PRECO** - Preço do produto (ex: "R$ 89,90" ou "89.90")

### Colunas Opcionais:

4. **CATEGORIA** - Categoria do produto: "fitness" ou "praia"
5. **CORES** ou **COR** - Cores disponíveis separadas por vírgula (ex: "preto, turquesa, rosa")
6. **TAMANHOS** ou **TAMANHO** - Tamanhos disponíveis separados por vírgula (ex: "P, M, G, GG")
7. **DESCRIÇÃO** ou **DESCRICAO** - Descrição do produto
8. **IMAGEM** ou **URL_IMAGEM** - URL da imagem do produto

## Cores Suportadas

O sistema reconhece automaticamente as seguintes cores (não diferencia maiúsculas/minúsculas):

- preto, branco
- turquesa, azul turquesa, azul, azul royal, azul marinho, azul petróleo
- coral, rosa, pink, vermelho
- verde, verde menta, verde limão
- amarelo, laranja
- roxo, lilás
- cinza, cinza escuro
- vinho, bege, nude

## Exemplo de Dados na Planilha

| ID | NOME | PREÇO | CATEGORIA | CORES | TAMANHOS | DESCRIÇÃO | IMAGEM |
|----|------|-------|-----------|-------|----------|-----------|--------|
| prod-001 | Top Fitness | R$ 89,90 | fitness | preto, turquesa, rosa | P, M, G, GG | Top com suporte médio | https://... |
| prod-002 | Biquíni Verão | 129.90 | praia | coral, branco, amarelo | P, M, G | Biquíni com bojo | https://... |

## IMPORTANTE: Tornar a Planilha Pública

Para que o site consiga acessar os dados, a planilha precisa estar configurada como pública:

1. Abra sua planilha no Google Sheets
2. Clique em "Compartilhar" (canto superior direito)
3. Em "Acesso geral", selecione "Qualquer pessoa com o link"
4. Certifique-se de que está como "Leitor"
5. Clique em "Concluído"

## Atualização Automática

Os produtos são carregados automaticamente quando o site é aberto. Para atualizar os dados após modificar a planilha, basta recarregar a página do site.

## Troubleshooting

Se os produtos não aparecerem:
- Verifique se a planilha está pública
- Confirme que a aba se chama exatamente "DATABASE_SITE"
- Verifique se as colunas NOME e PREÇO estão preenchidas
- Veja o console do navegador (F12) para mensagens de erro