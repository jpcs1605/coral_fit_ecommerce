# Guia Rápido - Sistema de Cupons no Checkout

## ✅ Implementação Concluída

O sistema de cupons está totalmente integrado ao processo de checkout da Coral Fit!

## 🎯 Funcionalidades Implementadas

### 1. Interface de Aplicação de Cupom
- Campo para inserir código do cupom
- Botão "Aplicar" para validar o cupom
- Botão "Remover" para remover cupom aplicado
- Feedback visual de sucesso/erro
- Conversão automática para maiúsculas

### 2. Validação Automática
- Verifica se o cupom existe
- Confirma se está ativo
- Valida data de validade
- Verifica limite de usos
- Checa valor mínimo de compra
- Calcula desconto automaticamente

### 3. Cálculo de Desconto
- Desconto aplicado ao subtotal + frete
- Suporta desconto percentual e valor fixo
- Respeita desconto máximo (para percentual)
- Atualização automática do total

### 4. Exibição no Resumo
- Linha específica mostrando o cupom aplicado
- Valor do desconto em destaque (verde)
- Código do cupom visível
- Total atualizado automaticamente

### 5. Integração com WhatsApp
- Cupom incluído na mensagem do pedido
- Desconto detalhado
- Registro automático de uso do cupom

## 📱 Como Usar (Cliente)

### Passo 1: Adicionar Produtos ao Carrinho
Adicione os produtos desejados ao carrinho normalmente.

### Passo 2: Ir para Checkout
Clique em "Finalizar Pedido" no carrinho.

### Passo 3: Preencher Dados
Preencha seus dados pessoais e escolha o tipo de entrega.

### Passo 4: Aplicar Cupom
1. Na seção "Cupom de Desconto", digite o código do cupom
2. Clique em "Aplicar"
3. Se válido, verá uma mensagem de sucesso em verde
4. O desconto será aplicado automaticamente
5. O total será atualizado

### Passo 5: Revisar e Finalizar
- Confira o resumo do pedido
- Veja o desconto aplicado
- Clique em "Enviar Pedido via WhatsApp"

## 🎨 Feedback Visual

### ✅ Sucesso (Verde)
- Mensagem: "Cupom aplicado! Desconto de R$ X,XX"
- Mostra código do cupom e tipo de desconto
- Desconto visível no resumo

### ❌ Erro (Vermelho)
Mensagens possíveis:
- "Cupom não encontrado"
- "Cupom inativo"
- "Cupom expirado"
- "Cupom atingiu o limite de usos"
- "Valor mínimo de compra: R$ X,XX"

## 🔧 Exemplos de Uso

### Exemplo 1: Cupom de 15% de Desconto
```
Código: VERAO2024
Subtotal: R$ 100,00
Frete: R$ 12,00
Total sem cupom: R$ 112,00
Desconto (15%): -R$ 16,80
Total com cupom: R$ 95,20
```

### Exemplo 2: Cupom de R$ 20,00
```
Código: BEMVINDO
Subtotal: R$ 150,00
Frete: R$ 15,00
Total sem cupom: R$ 165,00
Desconto: -R$ 20,00
Total com cupom: R$ 145,00
```

### Exemplo 3: Cupom com Valor Mínimo
```
Código: BLACK50 (mínimo R$ 100,00)
Subtotal: R$ 80,00
Erro: "Valor mínimo de compra: R$ 100,00"
```

## 💼 Gerenciamento (Admin)

### Criar Cupom
1. Acesse o painel administrativo
2. Clique na aba "Cupons"
3. Clique em "Novo Cupom"
4. Preencha os dados
5. Clique em "Criar Cupom"

### Acompanhar Uso
- Veja o contador de usos na lista de cupons
- Estatísticas em tempo real
- Total de usos de todos os cupons

## 📊 Fluxo Técnico

```
1. Cliente digita código → Conversão para maiúsculas
2. Cliente clica "Aplicar" → Validação do cupom
3. Sistema valida:
   - Cupom existe?
   - Está ativo?
   - Não expirou?
   - Tem usos disponíveis?
   - Valor mínimo ok?
4. Cálculo do desconto:
   - Percentual: (subtotal + frete) * (porcentagem / 100)
   - Fixo: valor definido
   - Aplica limite máximo se houver
5. Atualização do total:
   - Total = (Subtotal + Frete) - Desconto
6. Ao finalizar pedido:
   - Cupom incluído na mensagem WhatsApp
   - Contador de uso incrementado
```

## 🎯 Validações de Segurança

### Prevenções Implementadas
- ✅ Desconto nunca maior que o total
- ✅ Cupons expirados não funcionam
- ✅ Cupons inativos não funcionam
- ✅ Limite de usos respeitado
- ✅ Valor mínimo de compra validado
- ✅ Códigos únicos (não duplicados)

## 🚀 Próximos Passos (Opcional)

### Melhorias Futuras Possíveis
1. **Histórico de Cupons Usados**
   - Rastrear quais clientes usaram quais cupons

2. **Cupons Exclusivos por Cliente**
   - Vincular cupons a telefones específicos
   - Um uso por cliente

3. **Cupons por Categoria**
   - Descontos apenas em produtos específicos
   - Categorias elegíveis

4. **Combinação de Cupons**
   - Permitir múltiplos cupons
   - Regras de combinação

5. **Analytics**
   - Dashboard de desempenho de cupons
   - Cupons mais usados
   - ROI de campanhas

## 📞 Suporte

### Problemas Comuns

**Cupom não aplica**
- Verifique se o código está correto
- Confirme se o cupom está ativo no admin
- Veja se não expirou
- Cheque se atende ao valor mínimo

**Desconto incorreto**
- Para percentual, verifica se há desconto máximo
- Para fixo, verifica o valor configurado
- Lembre que o desconto é sobre subtotal + frete

**Erro ao finalizar**
- Cupom é registrado apenas após enviar para WhatsApp
- Se não enviar, cupom não é contabilizado

## 📝 Checklist de Deploy

Antes de fazer deploy com cupons:
- [ ] Criar cupons de teste no admin
- [ ] Testar aplicação de cupom válido
- [ ] Testar cupom inválido
- [ ] Testar cupom expirado
- [ ] Testar valor mínimo
- [ ] Verificar mensagem WhatsApp
- [ ] Confirmar incremento de contador de uso
- [ ] Testar remoção de cupom
- [ ] Fazer backup dos cupons
- [ ] Executar `npm run deploy`

## 🎉 Pronto para Usar!

O sistema de cupons está 100% funcional e integrado. Basta:
1. Criar cupons no painel admin
2. Divulgar os códigos
3. Clientes aplicam no checkout
4. Descontos são aplicados automaticamente!
