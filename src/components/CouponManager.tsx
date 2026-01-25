import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Percent, 
  DollarSign, 
  Calendar,
  Tag,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Coupon } from '../types';
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  loadCoupons,
  getCouponStats
} from '../services/couponService';

interface CouponFormData {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  expiryDate: string;
  isActive: boolean;
  minPurchaseAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
}

export function CouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>(loadCoupons());
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Coupon | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    discount: 0,
    discountType: 'percentage',
    expiryDate: '',
    isActive: true,
    minPurchaseAmount: undefined,
    maxDiscount: undefined,
    usageLimit: undefined,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount: 0,
      discountType: 'percentage',
      expiryDate: '',
      isActive: true,
      minPurchaseAmount: undefined,
      maxDiscount: undefined,
      usageLimit: undefined,
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      discountType: coupon.discountType,
      expiryDate: coupon.expiryDate.split('T')[0],
      isActive: coupon.isActive,
      minPurchaseAmount: coupon.minPurchaseAmount,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Converter data para ISO string
      const expiryDate = new Date(formData.expiryDate);
      expiryDate.setHours(23, 59, 59, 999); // Fim do dia
      
      const couponData = {
        code: formData.code,
        discount: formData.discount,
        discountType: formData.discountType,
        expiryDate: expiryDate.toISOString(),
        isActive: formData.isActive,
        minPurchaseAmount: formData.minPurchaseAmount || undefined,
        maxDiscount: formData.maxDiscount || undefined,
        usageLimit: formData.usageLimit || undefined,
      };
      
      if (editingCoupon) {
        updateCoupon(editingCoupon.id, couponData);
        showToast('Cupom atualizado com sucesso!');
      } else {
        createCoupon(couponData);
        showToast('Cupom criado com sucesso!');
      }
      
      setCoupons(loadCoupons());
      resetForm();
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      try {
        deleteCoupon(deleteConfirm.id);
        showToast('Cupom excluído com sucesso!');
        setCoupons(loadCoupons());
        setDeleteConfirm(null);
      } catch (error) {
        showToast((error as Error).message, 'error');
      }
    }
  };

  const stats = getCouponStats();

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <Alert variant={toast.type === 'error' ? 'destructive' : 'default'} className="bg-white">
            <AlertDescription>{toast.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Cupons
            </CardTitle>
            <Tag className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoupons}</div>
            <p className="text-xs text-gray-500 mt-1">Cupons cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cupons Ativos
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCoupons}</div>
            <p className="text-xs text-gray-500 mt-1">Em uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cupons Expirados
            </CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expiredCoupons}</div>
            <p className="text-xs text-gray-500 mt-1">Vencidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Usos
            </CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
            <p className="text-xs text-gray-500 mt-1">Vezes utilizado</p>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}</CardTitle>
            <CardDescription>
              {editingCoupon ? 'Atualize as informações do cupom' : 'Preencha os dados para criar um novo cupom'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="code">Código do Cupom *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="Ex: VERAO2024"
                    required
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Código único que os clientes usarão (será convertido para maiúsculas)
                  </p>
                </div>

                <div>
                  <Label htmlFor="discountType">Tipo de Desconto *</Label>
                  <select
                    id="discountType"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="percentage">Porcentagem (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="discount">Valor do Desconto *</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {formData.discountType === 'percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                    </div>
                    <Input
                      id="discount"
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                      placeholder={formData.discountType === 'percentage' ? 'Ex: 15' : 'Ex: 20.00'}
                      required
                      min="0"
                      step={formData.discountType === 'percentage' ? '1' : '0.01'}
                      max={formData.discountType === 'percentage' ? '100' : undefined}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.discountType === 'percentage' ? 'De 0 a 100%' : 'Valor em reais'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="expiryDate">Data de Validade *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="isActive">Status</Label>
                  <select
                    id="isActive"
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="minPurchaseAmount">Valor Mínimo de Compra</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <Input
                      id="minPurchaseAmount"
                      type="number"
                      value={formData.minPurchaseAmount || ''}
                      onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="Ex: 50.00"
                      min="0"
                      step="0.01"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Opcional - valor mínimo para usar o cupom</p>
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <Label htmlFor="maxDiscount">Desconto Máximo (R$)</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <Input
                        id="maxDiscount"
                        type="number"
                        value={formData.maxDiscount || ''}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="Ex: 100.00"
                        min="0"
                        step="0.01"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Opcional - limite o desconto em reais</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="usageLimit">Limite de Usos</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit || ''}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Ex: 100"
                    min="1"
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Opcional - quantas vezes pode ser usado</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingCoupon ? 'Atualizar' : 'Criar'} Cupom
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cupons de Desconto</CardTitle>
              <CardDescription>Gerencie os cupons promocionais</CardDescription>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cupom
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum cupom cadastrado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece criando seu primeiro cupom promocional
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Cupom
              </Button>
            </div>
          ) : (
            {/* Accordion para cupons */}
            <div className="w-full">
              <Accordion type="single" collapsible>
                {coupons.map((coupon) => (
                  <AccordionItem key={coupon.id} value={coupon.id.toString()}>
                    <AccordionTrigger className="flex flex-row items-center justify-between px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-semibold text-cyan-600">{coupon.code}</span>
                        <span className="text-xs text-gray-500">
                          {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `R$ ${coupon.discount.toFixed(2)}`}
                          {coupon.discountType === 'percentage' && coupon.maxDiscount ? ` | Máx: R$ ${coupon.maxDiscount.toFixed(2)}` : ''}
                        </span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        coupon.isActive && !isExpired(coupon.expiryDate)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {coupon.isActive && !isExpired(coupon.expiryDate) ? (
                          <><CheckCircle2 className="h-3 w-3" /> Ativo</>
                        ) : (
                          <><XCircle className="h-3 w-3" /> Inativo</>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <span className="block text-xs text-gray-500">Validade</span>
                          <span className={isExpired(coupon.expiryDate) ? 'text-red-600' : 'text-gray-900'}>
                            {new Date(coupon.expiryDate).toLocaleDateString('pt-BR')}
                          </span>
                          {isExpired(coupon.expiryDate) && (
                            <span className="block text-xs text-red-600">Expirado</span>
                          )}
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500">Usos</span>
                          <span className="font-semibold">{coupon.usageCount}</span>
                          {coupon.usageLimit && (
                            <span className="text-xs text-gray-500">/ {coupon.usageLimit}</span>
                          )}
                        </div>
                        {coupon.minPurchaseAmount && (
                          <div>
                            <span className="block text-xs text-gray-500">Mínimo</span>
                            <span>R$ {coupon.minPurchaseAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {coupon.discountType === 'percentage' && coupon.maxDiscount && (
                          <div>
                            <span className="block text-xs text-gray-500">Desconto Máx.</span>
                            <span>R$ {coupon.maxDiscount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 justify-end mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(coupon)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(coupon)}
                          title="Excluir"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteConfirm(null)}
          />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmar Exclusão
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja excluir o cupom "<strong>{deleteConfirm.code}</strong>"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
