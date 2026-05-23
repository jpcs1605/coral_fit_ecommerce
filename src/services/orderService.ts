import { CartItem, CheckoutFormData } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Cole aqui a URL gerada após publicar o Apps Script como Web App.
// Passos:
//   1. Abra a planilha > Extensões > Apps Script
//   2. Cole o código disponível em /scripts/apps-script-pedidos.js
//   3. Implantar > Nova implantação > Tipo: App da Web
//      Executar como: eu mesmo | Quem tem acesso: Qualquer pessoa
//   4. Copie a URL gerada e substitua o valor abaixo
// ─────────────────────────────────────────────────────────────────────────────
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw95z_cYpsQoaqc4XNExt2QbYWN5o2Vtq3lbI4CExqjAhqDCu4rdDm6Uy3-5lvfQFIUCA/exec';

export interface OrderPayload {
  cliente: string;
  pedido: string;
  entrega: string;
  pagamento: string;
  valor: string;
}

export function buildOrderPayload(
  formData: CheckoutFormData,
  items: CartItem[],
  paymentMethod: string,
  total: number,
  shippingInfo: { price: number; formattedPrice: string } | null,
  couponCode?: string,
  couponDiscount?: number,
): OrderPayload {
  const cliente = `${formData.name} | ${formData.phone}`;

  const pedidoLines = items.map(
    item =>
      `${item.quantity}x ${item.product.name} (${item.color}, ${item.size}) — R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}`,
  );
  if (formData.deliveryType === 'delivery' && shippingInfo) {
    pedidoLines.push(`Frete: ${shippingInfo.formattedPrice}`);
  }
  if (couponCode && couponDiscount && couponDiscount > 0) {
    pedidoLines.push(`Cupom (${couponCode}): -R$ ${couponDiscount.toFixed(2).replace('.', ',')}`);
  }
  const pedido = pedidoLines.join('\n');

  let entrega: string;
  if (formData.deliveryType === 'pickup') {
    entrega = 'Retirada na loja';
  } else {
    const parts = [`${formData.street}, ${formData.number}`];
    if (formData.complement) parts.push(formData.complement);
    if (formData.neighborhood) parts.push(formData.neighborhood);
    parts.push(`${formData.city} - ${formData.state}`);
    parts.push(`CEP: ${formData.zipCode}`);
    entrega = parts.join(' | ');
  }

  const pagamentoMap: Record<string, string> = {
    pix: 'PIX',
    credito: 'Cartão de Crédito',
    debito: 'Cartão de Débito',
  };
  const pagamento = pagamentoMap[paymentMethod] ?? 'Não informado';

  const valor = `R$ ${total.toFixed(2).replace('.', ',')}`;

  return { cliente, pedido, entrega, pagamento, valor };
}

/**
 * Envia o pedido para o Google Apps Script que grava na aba "Pedidos".
 * Usa mode: 'no-cors' + URLSearchParams (requisição "simples", sem preflight).
 * Não bloqueia o fluxo em caso de falha — o pedido segue pelo WhatsApp.
 */
export async function submitOrder(payload: OrderPayload): Promise<void> {
  if (!APPS_SCRIPT_URL) {
    console.warn('[orderService] APPS_SCRIPT_URL não configurada — pedido não registrado na planilha.');
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append('data', JSON.stringify(payload));
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: params,
    });
  } catch (err) {
    console.error('[orderService] Falha ao registrar pedido na planilha:', err);
  }
}
