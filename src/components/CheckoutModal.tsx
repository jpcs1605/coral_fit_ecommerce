import { useState, useEffect } from 'react';
import { X, MapPin, Phone, User, Home, Package, Truck, Loader2, Tag, Check, AlertCircle, ChevronDown } from 'lucide-react';
import { CartItem, CheckoutFormData, Coupon } from '../types';
import { calculateShipping } from '../services/googleSheets';
import { validateCoupon, useCoupon } from '../services/couponService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, items, onSuccess }: CheckoutModalProps) {
  const [isDeliverySectionOpen, setIsDeliverySectionOpen] = useState(true);
  // Estado para sanfona de pagamento
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryType: 'delivery'
  });

  const [shippingInfo, setShippingInfo] = useState<{
    distance: number;
    price: number;
    formattedPrice: string;
    isEstimated?: boolean;
  } | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  
  // Estados para cupom
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCouponExpanded, setIsCouponExpanded] = useState(false);

  // Buscar dados do CEP automaticamente
  useEffect(() => {
    const fetchCepData = async () => {
      // Limpar erros anteriores
      setCepError(null);

      // Só buscar se for entrega e tiver CEP com 8 dígitos
      if (formData.deliveryType !== 'delivery' || !formData.zipCode) {
        return;
      }

      const cleanCep = formData.zipCode.replace(/[^0-9]/g, '');
      
      if (cleanCep.length !== 8) {
        return;
      }

      setIsLoadingCep(true);

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        
        if (!response.ok) {
          throw new Error('Erro ao buscar CEP');
        }

        const data = await response.json();

        if (data.erro) {
          setCepError('CEP não encontrado');
          setIsLoadingCep(false);
          return;
        }

        // Preencher automaticamente os campos
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }));

        setCepError(null);
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setCepError('Erro ao buscar CEP');
      } finally {
        setIsLoadingCep(false);
      }
    };

    // Debounce para evitar muitas chamadas à API
    const timeoutId = setTimeout(fetchCepData, 800);

    return () => clearTimeout(timeoutId);
  }, [formData.zipCode, formData.deliveryType]);

  // Calcular frete automaticamente quando o CEP for alterado
  useEffect(() => {
    const calculateFreight = async () => {
      // Limpar erros anteriores
      setShippingError(null);

      // Só calcular se for entrega e tiver CEP com 8 dígitos (com ou sem hífen)
      if (formData.deliveryType !== 'delivery' || !formData.zipCode) {
        setShippingInfo(null);
        return;
      }

      const cleanCep = formData.zipCode.replace(/[^0-9]/g, '');
      
      if (cleanCep.length !== 8) {
        setShippingInfo(null);
        return;
      }

      setIsCalculatingShipping(true);

      try {
        const result = await calculateShipping(formData.zipCode);
        
        // Agora sempre recebemos um resultado
        setShippingInfo(result);
        setShippingError(null);
      } catch (error) {
        console.error('Erro ao calcular frete:', error);
        // Usar valor padrão em caso de erro
        setShippingInfo({
          distance: 15,
          price: 12,
          formattedPrice: 'R$ 12,00',
          isEstimated: true,
        });
        setShippingError(null);
      } finally {
        setIsCalculatingShipping(false);
      }
    };

    // Debounce para evitar muitas chamadas à API
    const timeoutId = setTimeout(calculateFreight, 800);

    return () => clearTimeout(timeoutId);
  }, [formData.zipCode, formData.deliveryType]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = formData.deliveryType === 'delivery' && shippingInfo ? shippingInfo.price : 0;
  const subtotalWithShipping = subtotal + shippingCost;
  const total = subtotalWithShipping - couponDiscount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = `*NOVO PEDIDO - CORAL FIT*\n\n`;
    message += `*Cliente:* ${formData.name}\n`;
    message += `*Telefone:* ${formData.phone}\n\n`;
    message += `*Método de Pagamento:* ${
      paymentMethod === 'pix' ? 'PIX' : paymentMethod === 'credito' ? 'Cartão de Crédito' : paymentMethod === 'debito' ? 'Cartão de Débito' : 'Não informado'
    }\n\n`;
    message += `*ITENS DO PEDIDO:*\n`;
    items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.product.name}*\n`;
      message += `   - Cor: ${item.color}\n`;
      message += `   - Tamanho: ${item.size}\n`;
      message += `   - Quantidade: ${item.quantity}x\n`;
      message += `   - Valor: R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
    });
    
    message += `\n--------------------------------\n`;
    message += `*Subtotal Produtos: R$ ${subtotal.toFixed(2).replace('.', ',')}*\n`;
    
    if (formData.deliveryType === 'delivery' && shippingInfo) {
      message += `*Frete: R$ ${shippingInfo.price.toFixed(2).replace('.', ',')}*\n`;
    }
    
    if (appliedCoupon && couponDiscount > 0) {
      message += `*Cupom (${appliedCoupon.code}): -R$ ${couponDiscount.toFixed(2).replace('.', ',')}*\n`;
    }
    
    message += `*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
    message += `--------------------------------\n\n`;
    
    message += `*ENTREGA:*\n`;
    if (formData.deliveryType === 'delivery') {
      message += `*Entrega no endereco*\n`;
      message += `${formData.street}, ${formData.number}`;
      if (formData.complement) {
        message += ` - ${formData.complement}`;
      }
      message += `\n`;
      if (formData.neighborhood) {
        message += `${formData.neighborhood}\n`;
      }
      message += `${formData.city} - ${formData.state}\n`;
      message += `CEP: ${formData.zipCode}\n`;
      if (shippingInfo) {
        message += `Valor do frete: ${shippingInfo.formattedPrice}\n`;
      }
    } else {
      message += `*Retirada na loja*\n`;
    }
    
    message += `\n\n_Pedido gerado automaticamente pelo site Coral Fit_`;

    const whatsappNumber = '5511934994589'; // Substitua pelo número do WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Registrar uso do cupom
    if (appliedCoupon) {
      try {
        useCoupon(appliedCoupon.code);
      } catch (error) {
        console.error('Erro ao registrar uso do cupom:', error);
      }
    }
    
    window.open(whatsappUrl, '_blank');
    onSuccess();
  };

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponCode.trim()) {
      setCouponError('Digite um código de cupom');
      return;
    }
    const result = validateCoupon(couponCode, subtotalWithShipping);
    if (result.isValid && result.coupon && result.discountAmount !== undefined) {
      setAppliedCoupon(result.coupon);
      setCouponDiscount(result.discountAmount);
      setCouponError(null);
    } else {
      setCouponError(result.error || 'Cupom inválido');
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError(null);
    setIsCouponExpanded(false);
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="modal-sheet bg-white shadow-2xl max-w-2xl w-full overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 md:p-6 rounded-t-3xl">
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

        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          {/* Dados Pessoais */}
          <section className="mb-6">
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
          </section>

          {/* Tipo de Entrega - Accordion */}
          <section className="mb-6">
            <button
              type="button"
              onClick={() => setIsDeliverySectionOpen((open) => !open)}
              className="w-full flex items-center justify-between p-4 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-all border-2 border-cyan-100 mb-2"
            >
              <span className="font-semibold text-cyan-700">Tipo de Entrega</span>
              <span className={`transition-transform ${isDeliverySectionOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isDeliverySectionOpen && (
              <div>
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
                {/* Endereço só aparece se for entrega */}
                {formData.deliveryType === 'delivery' && (
                  <section className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        CEP
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.zipCode}
                          onChange={(e) => updateField('zipCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                          placeholder="00000-000"
                          maxLength={9}
                        />
                        {(isCalculatingShipping || isLoadingCep) && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                          </div>
                        )}
                      </div>
                      {shippingError && (
                        <p className="text-red-500 text-sm mt-2">{shippingError}</p>
                      )}
                      {shippingInfo && !isCalculatingShipping && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700">
                            <Truck className="w-4 h-4 inline mr-1" />
                            Frete calculado: <span className="font-semibold">{shippingInfo.formattedPrice}</span>
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        <Home className="w-4 h-4 inline mr-2" />
                        Rua/Avenida
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) => updateField('street', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                        placeholder="Digite o endereço ou será preenchido pelo CEP"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Número</label>
                        <input
                          type="text"
                          required
                          value={formData.number}
                          onChange={(e) => updateField('number', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                          placeholder="Nº"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Complemento</label>
                        <input
                          type="text"
                          value={formData.complement}
                          onChange={(e) => updateField('complement', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                          placeholder="Apto, bloco, etc."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Bairro</label>
                      <input
                        type="text"
                        required
                        value={formData.neighborhood}
                        onChange={(e) => updateField('neighborhood', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                        placeholder="Digite o bairro ou será preenchido pelo CEP"
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
                          placeholder="Digite a cidade ou será preenchido pelo CEP"
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
                  </section>
                )}
              </div>
            )}
          </section>

          {/* Seção de Cupom (Sanfona) */}
          <div className="mb-6">
            {/* Botão para expandir/recolher - estilo azul igual entrega */}
            <button
              type="button"
              onClick={() => setIsCouponExpanded(!isCouponExpanded)}
              className="w-full flex items-center justify-between p-4 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-all border-2 border-cyan-100 mb-2"
            >
              <span className="font-semibold text-cyan-700">
                {appliedCoupon ? 'Cupom Aplicado!' : 'Tem um cupom de desconto?'}
              </span>
              <span className={`transition-transform text-cyan-700 ${isCouponExpanded ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {/* Conteúdo expansível da sanfona */}
            {isCouponExpanded && (
              <div className="mt-4">
                <div className="bg-white border-2 border-cyan-100 rounded-xl p-4">
                  <div className="flex gap-2 mb-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                        disabled={!!appliedCoupon}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed uppercase"
                        placeholder="Digite o código do cupom"
                      />
                    </div>
                    {!appliedCoupon && (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all disabled:text-white disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 font-medium whitespace-nowrap flex-shrink-0"
                        style={!couponCode.trim() ? { backgroundColor: '#06b6d4' } : {}}
                      >
                        Aplicar
                      </button>
                    )}
                    {appliedCoupon && (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center gap-2 font-medium whitespace-nowrap flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                        Remover
                      </button>
                    )}
                  </div>
                  {/* Info do cupom aplicado */}
                  {appliedCoupon && (
                    <div className="mb-2 text-cyan-700 text-sm font-semibold">
                      {appliedCoupon.code} - Economize R$ {couponDiscount.toFixed(2).replace('.', ',')}
                    </div>
                  )}
                  {/* Mensagem de erro */}
                  {couponError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{couponError}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Sanfona: Seleção de método de pagamento */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setIsPaymentExpanded && setIsPaymentExpanded((v) => !v)}
                className="w-full flex items-center justify-between p-4 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-all border-2 border-cyan-100 mb-2"
              >
                <span className="font-semibold text-cyan-700">Selecione o método de pagamento</span>
                <span className={`transition-transform text-cyan-700 ${isPaymentExpanded ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isPaymentExpanded && (
                <div className="mt-4">
                  <div className="bg-white border-2 border-cyan-100 rounded-xl p-4 flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pix"
                        checked={paymentMethod === 'pix'}
                        onChange={() => setPaymentMethod('pix')}
                        className="accent-cyan-500 w-5 h-5"
                      />
                      <span className="font-medium text-cyan-700">PIX</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credito"
                        checked={paymentMethod === 'credito'}
                        onChange={() => setPaymentMethod('credito')}
                        className="accent-cyan-500 w-5 h-5"
                      />
                      <span className="font-medium text-cyan-700">Cartão de Crédito</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="debito"
                        checked={paymentMethod === 'debito'}
                        onChange={() => setPaymentMethod('debito')}
                        className="accent-cyan-500 w-5 h-5"
                      />
                      <span className="font-medium text-cyan-700">Cartão de Débito</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 mb-6">
            

            <h4 className="text-gray-800 mb-3 font-semibold">Resumo do Pedido</h4>
            
            {/* Lista de produtos */}
            <div className="space-y-2 mb-3">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.product.name} ({item.color}, {item.size})
                  </span>
                  <span className="text-gray-800">
                    R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            {/* Separador */}
            <div className="border-t border-cyan-200 my-3"></div>

            {/* Subtotal */}
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700">Subtotal dos produtos</span>
              <span className="text-gray-800 font-medium">
                R$ {subtotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Frete */}
            {formData.deliveryType === 'delivery' && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Frete
                  {shippingInfo && (
                    <span className="text-xs text-gray-500">({shippingInfo.distance.toFixed(1)} km)</span>
                  )}
                </span>
                <span className="text-gray-800 font-medium">
                  {isCalculatingShipping ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : shippingInfo ? (
                    `R$ ${shippingInfo.price.toFixed(2).replace('.', ',')}`
                  ) : (
                    <span className="text-xs text-gray-500">Informe o CEP</span>
                  )}
                </span>
              </div>
            )}

            {/* Cupom de Desconto */}
            {appliedCoupon && couponDiscount > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  Cupom ({appliedCoupon.code})
                </span>
                <span className="text-green-600 font-medium">
                  -R$ {couponDiscount.toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="border-t border-cyan-300 mt-3 pt-3">
              <div className="flex justify-between mb-3">
                <span className="text-gray-800 font-semibold text-lg">Total</span>
                <span className="text-cyan-600 font-bold text-xl">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Valor recebido pelo vendedor */}
              {/* <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3 border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-green-800 text-sm font-medium">
                    Valor a receber (vendedor)Valor
                  </span>
                  <span className="text-green-700 font-bold text-lg">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {formData.deliveryType === 'delivery' && shippingInfo && (
                  <p className="text-xs text-green-700 mt-1">
                    Inclui produtos (R$ {subtotal.toFixed(2).replace('.', ',')}) + frete (R$ {shippingInfo.price.toFixed(2).replace('.', ',')})
                  </p>
                )}
              </div> */}
            </div>
          </div>

          <button
            type="submit"
            disabled={formData.deliveryType === 'delivery' && !shippingInfo && !isCalculatingShipping}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-green-600"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {formData.deliveryType === 'delivery' && !shippingInfo && !isCalculatingShipping
              ? 'Informe o CEP para continuar'
              : 'Enviar Pedido via WhatsApp'
            }
          </button>
        </form>
      </div>
    </div>
  );
}