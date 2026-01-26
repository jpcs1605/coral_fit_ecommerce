import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Percent,
  DollarSign,
  Tag,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';

import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { Coupon } from '../types';
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  loadCoupons,
  getCouponStats,
} from '../services/couponService';

/* =========================
   Utils
========================= */
function isExpired(date: string): boolean {
  return new Date(date) < new Date();
}

/* =========================
   Types
========================= */
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

/* =========================
   Component
========================= */
export function CouponManager() {
  /* ---------- State ---------- */
  const [coupons, setCoupons] = useState<Coupon[]>(loadCoupons());
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Coupon | null>(null);

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

  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalUsage: 0,
  });

  /* ---------- Effects ---------- */
  useEffect(() => {
    setStats(getCouponStats());
  }, [coupons]);

  /* ---------- Handlers ---------- */
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, formData);
    } else {
      createCoupon(formData);
    }

    setCoupons(loadCoupons());
    resetForm();
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

  /* =========================
     Render
  ========================= */
  return (
    <div className="space-y-6">
      {/* ================= Stats ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-sm">Total</CardTitle>
            <Tag className="h-4 w-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalCoupons}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-sm">Ativos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-600">
            {stats.activeCoupons}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-sm">Expirados</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-600">
            {stats.expiredCoupons}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-sm">Usos</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalUsage}
          </CardContent>
        </Card>
      </div>

      {/* ================= Form ================= */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
            </CardTitle>
            <CardDescription>
              {editingCoupon
                ? 'Atualize as informações do cupom'
                : 'Preencha os dados para criar um novo cupom'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Código</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Tipo de Desconto</Label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                  >
                    <option value="percentage">Porcentagem</option>
                    <option value="fixed">Valor Fixo</option>
                  </select>
                </div>

                <div>
                  <Label>Desconto</Label>
                  <Input
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Validade</Label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expiryDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>

                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingCoupon ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ================= List ================= */}
      <Card>
        <CardHeader className="flex justify-between flex-row">
          <div>
            <CardTitle>Cupons</CardTitle>
            <CardDescription>Gerencie os cupons</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCoupons(loadCoupons())}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <table className="w-full border">
            <thead>
              <tr>
                <th>Código</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>{coupon.code}</td>
                  <td>
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discount}%`
                      : `R$ ${coupon.discount.toFixed(2)}`}
                  </td>
                  <td>
                    {coupon.isActive && !isExpired(coupon.expiryDate)
                      ? 'Ativo'
                      : 'Inativo'}
                  </td>
                  <td className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(coupon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => deleteCoupon(coupon.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
