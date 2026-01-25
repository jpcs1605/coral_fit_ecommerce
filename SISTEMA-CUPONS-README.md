# Sistema de Cupons - Coral Fit

## 📋 Visão Geral

O sistema de cupons permite criar e gerenciar cupons promocionais que podem ser aplicados durante o checkout para oferecer descontos aos clientes.

## 🎯 Funcionalidades

### Tipos de Desconto
- **Porcentagem**: Desconto baseado em percentual do valor da compra (ex: 15%)
- **Valor Fixo**: Desconto de valor fixo em reais (ex: R$ 20,00)

### Recursos Principais
- ✅ Criar, editar e excluir cupons
- ✅ Definir data de validade
- ✅ Ativar/desativar cupons
- ✅ Definir valor mínimo de compra
- ✅ Limitar desconto máximo (para porcentagem)
- ✅ Controlar limite de usos
- ✅ Acompanhar contador de usos
- ✅ Visualizar estatísticas

## 🎨 Interface de Administração

### Acessando o Gerenciador de Cupons
1. Acesse o painel administrativo
2. Clique na aba "Cupons"
3. Você verá o dashboard com estatísticas e lista de cupons

### Cards de Estatísticas
- **Total de Cupons**: Número total de cupons cadastrados
- **Cupons Ativos**: Cupons atualmente ativos e válidos
- **Cupons Expirados**: Cupons que passaram da data de validade
- **Total de Usos**: Soma de todas as vezes que cupons foram utilizados

## 📝 Criando um Cupom

### Campos Obrigatórios
1. **Código do Cupom**: Nome único do cupom (ex: VERAO2024)
   - Será automaticamente convertido para maiúsculas
   - Deve ser único no sistema

2. **Tipo de Desconto**: Escolha entre Porcentagem (%) ou Valor Fixo (R$)

3. **Valor do Desconto**: 
   - Para porcentagem: de 0 a 100%
   - Para valor fixo: valor em reais

4. **Data de Validade**: Data máxima que o cupom pode ser usado
   - O cupom será válido até 23:59:59 do dia selecionado

### Campos Opcionais

1. **Status**: Ativo ou Inativo
   - Permite desativar temporariamente sem deletar

2. **Valor Mínimo de Compra**: 
   - Define o valor mínimo do carrinho para usar o cupom
   - Exemplo: R$ 50,00 - cupom só funciona se compra for >= R$ 50

3. **Desconto Máximo** (apenas para porcentagem):
   - Limita o valor máximo de desconto em reais
   - Exemplo: 20% com máximo de R$ 100 → em uma compra de R$ 1000, desconto será R$ 100 (não R$ 200)

4. **Limite de Usos**: 
   - Número máximo de vezes que o cupom pode ser usado
   - Deixe vazio para usos ilimitados

## 🔧 Exemplos de Cupons

### Exemplo 1: Desconto de Boas-Vindas
```
Código: BEMVINDO
Tipo: Valor Fixo
Desconto: R$ 10,00
Validade: 31/12/2024
Status: Ativo
Valor Mínimo: -
Limite de Usos: 100
```

### Exemplo 2: Promoção de Verão
```
Código: VERAO2024
Tipo: Porcentagem
Desconto: 15%
Validade: 21/03/2024
Status: Ativo
Valor Mínimo: R$ 80,00
Desconto Máximo: R$ 50,00
Limite de Usos: -
```

### Exemplo 3: Black Friday
```
Código: BLACKFRIDAY
Tipo: Porcentagem
Desconto: 30%
Validade: 30/11/2024
Status: Ativo
Valor Mínimo: R$ 100,00
Desconto Máximo: R$ 150,00
Limite de Usos: 500
```

## 🔍 Validação de Cupons

O sistema valida automaticamente:
- ✅ Se o cupom existe
- ✅ Se está ativo
- ✅ Se não expirou
- ✅ Se não atingiu o limite de usos
- ✅ Se a compra atende ao valor mínimo
- ✅ Calcula o desconto respeitando os limites

## 📊 Gerenciamento

### Editar Cupom
1. Clique no ícone de lápis na linha do cupom
2. Atualize os campos desejados
3. Clique em "Atualizar Cupom"

### Excluir Cupom
1. Clique no ícone de lixeira
2. Confirme a exclusão
3. **Atenção**: Esta ação não pode ser desfeita

### Desativar Temporariamente
- Edite o cupom e altere o status para "Inativo"
- O cupom ficará invisível para uso, mas mantém os dados

## 💾 Armazenamento

- Os cupons são salvos no **localStorage** do navegador
- Chave de armazenamento: `coral_fit_coupons`
- Os dados persistem entre sessões
- Não são perdidos ao recarregar a página

## 🚀 Integrando com Checkout

Para integrar cupons no checkout (implementação futura):

```typescript
import { validateCoupon, useCoupon } from '../services/couponService';

// Validar cupom
const result = validateCoupon('VERAO2024', 100.00);

if (result.isValid) {
  console.log('Desconto:', result.discountAmount);
  console.log('Cupom:', result.coupon);
  
  // Ao finalizar compra, registrar uso
  useCoupon('VERAO2024');
} else {
  console.log('Erro:', result.error);
}
```

## 📦 Backup e Exportação

### Exportar Cupons
```typescript
import { downloadCouponsJSON } from '../services/couponService';

// Baixa arquivo JSON com todos os cupons
downloadCouponsJSON();
```

### Importar Cupons
```typescript
import { importCouponsFromJSON } from '../services/couponService';

// Importa cupons de um JSON
const json = '...'; // JSON string
importCouponsFromJSON(json);
```

## 🎯 Boas Práticas

1. **Códigos Descritivos**: Use códigos que fazem sentido (NATAL2024, DESCONTO10)
2. **Datas Claras**: Defina datas de validade apropriadas
3. **Limites Razoáveis**: Configure limites de uso para evitar abuso
4. **Testes**: Sempre teste o cupom antes de divulgar
5. **Monitoramento**: Acompanhe o uso através das estatísticas
6. **Backup Regular**: Faça backup dos cupons periodicamente

## 🔐 Segurança

- Códigos são convertidos para maiúsculas automaticamente
- Validações impedem cupons duplicados
- Sistema previne descontos maiores que o valor da compra
- Controle de limite de usos evita abuso

## 📱 Interface do Cliente (Implementação Futura)

No checkout, adicionar:
- Campo para inserir código do cupom
- Botão "Aplicar Cupom"
- Exibição do desconto aplicado
- Mensagens de erro/sucesso

## 🆘 Solução de Problemas

### Cupom não aparece na lista
- Verifique se foi salvo corretamente
- Atualize a página
- Verifique o localStorage no console do navegador

### Cupom não valida
- Confirme se está ativo
- Verifique a data de validade
- Confira o valor mínimo de compra
- Verifique se atingiu o limite de usos

### Dados perdidos
- Dados são salvos localmente no navegador
- Se limpar dados do navegador, cupons serão perdidos
- Mantenha backups regulares exportando o JSON

## 🎓 Estrutura de Dados

```typescript
interface Coupon {
  id: string;                    // ID único gerado
  code: string;                  // Código do cupom
  discount: number;              // Valor do desconto
  discountType: 'percentage' | 'fixed';
  expiryDate: string;            // Data de validade (ISO)
  isActive: boolean;             // Status ativo/inativo
  minPurchaseAmount?: number;    // Valor mínimo (opcional)
  maxDiscount?: number;          // Desconto máximo (opcional)
  usageLimit?: number;           // Limite de usos (opcional)
  usageCount: number;            // Contador de usos
  createdAt: string;             // Data de criação
  updatedAt: string;             // Última atualização
}
```

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do projeto principal.
