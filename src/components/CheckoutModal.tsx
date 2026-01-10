import { useState } from 'react';
import { X, MapPin, Phone, User, Home, Package, Truck } from 'lucide-react';
import { CartItem, CheckoutFormData } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, items, onSuccess }: CheckoutModalProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryType: 'delivery'
  });

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = `🛍️ *NOVO PEDIDO - CORAL FIT*\n\n`;
    message += `👤 *Cliente:* ${formData.name}\n`;
    message += `📱 *Telefone:* ${formData.phone}\n\n`;
    
    message += `📦 *ITENS DO PEDIDO:*\n`;
    items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.product.name}*\n`;
      message += `   • Cor: ${item.color}\n`;
      message += `   • Tamanho: ${item.size}\n`;
      message += `   • Quantidade: ${item.quantity}x\n`;
      message += `   • Valor: R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
    });
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `🚚 *ENTREGA:*\n`;
    if (formData.deliveryType === 'delivery') {
      message += `📍 *Entrega no endereço*\n`;
      message += `${formData.address}\n`;
      message += `${formData.city} - ${formData.state}\n`;
      message += `CEP: ${formData.zipCode}\n\n`;
      message += `⚠️ *Frete por conta do comprador*\n`;
    } else {
      message += `🏪 *Retirada na loja*\n`;
    }
    
    message += `\n\n_Pedido gerado automaticamente pelo site Coral Fit_`;

    const whatsappNumber = '5511999999999'; // Substitua pelo número do WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    onSuccess();
  };

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2>Finalizar Pedido</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-gray-800 mb-4">Dados Pessoais</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                placeholder="Seu nome"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Telefone/WhatsApp
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-gray-800 mb-4">Tipo de Entrega</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                type="button"
                onClick={() => updateField('deliveryType', 'delivery')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.deliveryType === 'delivery'
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Truck className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                <span className="block text-sm">Entrega</span>
                <span className="block text-xs text-gray-500 mt-1">Frete por sua conta</span>
              </button>

              <button
                type="button"
                onClick={() => updateField('deliveryType', 'pickup')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.deliveryType === 'pickup'
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Package className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                <span className="block text-sm">Retirada</span>
                <span className="block text-xs text-gray-500 mt-1">Retirar na loja</span>
              </button>
            </div>

            {formData.deliveryType === 'delivery' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    <Home className="w-4 h-4 inline mr-2" />
                    Endereço
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                    placeholder="Rua, número, complemento"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Cidade</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                      placeholder="Cidade"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Estado</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                      placeholder="UF"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    CEP
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                    placeholder="00000-000"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 mb-6">
            <h4 className="text-gray-800 mb-3">Resumo do Pedido</h4>
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  {item.quantity}x {item.product.name} ({item.color}, {item.size})
                </span>
                <span className="text-gray-800">
                  R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
            <div className="border-t border-cyan-200 mt-3 pt-3 flex justify-between">
              <span className="text-gray-800">Total</span>
              <span className="text-cyan-600">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Enviar Pedido via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}