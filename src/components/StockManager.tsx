import { useState } from 'react';
import { Product, StockItem } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { updateStock } from '../services/productService';
import { Package, AlertTriangle, Check } from 'lucide-react';

interface StockManagerProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
}

export function StockManager({ product, onUpdate }: StockManagerProps) {
  const [stockValues, setStockValues] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    product.stock.forEach(item => {
      const key = `${item.color}-${item.size}`;
      initial[key] = item.quantity;
    });
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Garantir que há estoque para todas as combinações
  const ensureFullStock = (): StockItem[] => {
    const fullStock: StockItem[] = [];
    
    for (const color of product.colors) {
      for (const size of product.sizes) {
        const existing = product.stock.find(
          s => s.color === color.name && s.size === size
        );
        
        fullStock.push({
          color: color.name,
          size,
          quantity: existing?.quantity || 0,
        });
      }
    }
    
    return fullStock;
  };

  const fullStock = ensureFullStock();

  const handleStockChange = (color: string, size: string, value: string) => {
    const key = `${color}-${size}`;
    const quantity = parseInt(value) || 0;
    setStockValues({ ...stockValues, [key]: quantity });
  };

  const handleSaveStock = async (color: string, size: string) => {
    const key = `${color}-${size}`;
    const quantity = stockValues[key] || 0;

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const updatedProduct = updateStock(product.id, color, size, quantity);
      onUpdate(updatedProduct);
      setSuccess(`Estoque atualizado: ${color} - ${size}`);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllStock = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      let updatedProduct = product;
      
      for (const item of fullStock) {
        const key = `${item.color}-${item.size}`;
        const quantity = stockValues[key] || 0;
        updatedProduct = updateStock(product.id, item.color, item.size, quantity);
      }

      onUpdate(updatedProduct);
      setSuccess('Todo o estoque foi atualizado com sucesso!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const getTotalStock = (): number => {
    return Object.values(stockValues).reduce((sum, qty) => sum + qty, 0);
  };

  const getStockByColor = (colorName: string): number => {
    let total = 0;
    product.sizes.forEach(size => {
      const key = `${colorName}-${size}`;
      total += stockValues[key] || 0;
    });
    return total;
  };

  const getStockBySize = (sizeName: string): number => {
    let total = 0;
    product.colors.forEach(color => {
      const key = `${color.name}-${sizeName}`;
      total += stockValues[key] || 0;
    });
    return total;
  };

  const getLowStockItems = (): StockItem[] => {
    return fullStock.filter(item => {
      const key = `${item.color}-${item.size}`;
      const qty = stockValues[key] || 0;
      return qty > 0 && qty < 5;
    });
  };

  const lowStockItems = getLowStockItems();

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Resumo do Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Estoque Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-600" />
              <span className="text-2xl font-bold">{getTotalStock()}</span>
              <span className="text-sm text-gray-500">unidades</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Combinações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fullStock.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {product.colors.length} cores × {product.sizes.length} tamanhos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {lowStockItems.length > 0 && (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
              <span className="text-2xl font-bold">{lowStockItems.length}</span>
              <span className="text-sm text-gray-500">itens</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Estoque Baixo */}
      {lowStockItems.length > 0 && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Atenção:</strong> {lowStockItems.length} combinações com estoque baixo (menos de 5 unidades)
          </AlertDescription>
        </Alert>
      )}

      {/* Totais por Cor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estoque por Cor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {product.colors.map((color) => (
              <div key={color.name} className="flex items-center gap-2 p-2 border rounded">
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{color.name}</p>
                  <p className="text-xs text-gray-500">{getStockByColor(color.name)} un.</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Totais por Tamanho */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estoque por Tamanho</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {product.sizes.map((size) => (
              <div key={size} className="p-2 border rounded text-center">
                <p className="text-sm font-bold">{size}</p>
                <p className="text-xs text-gray-500">{getStockBySize(size)} un.</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grid de Estoque */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Estoque por Combinação</CardTitle>
          <Button onClick={handleSaveAllStock} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Tudo'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Cor</th>
                  {product.sizes.map((size) => (
                    <th key={size} className="text-center py-3 px-4 font-medium">
                      {size}
                    </th>
                  ))}
                  <th className="text-center py-3 px-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {product.colors.map((color) => (
                  <tr key={color.name} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="font-medium">{color.name}</span>
                      </div>
                    </td>
                    {product.sizes.map((size) => {
                      const key = `${color.name}-${size}`;
                      const qty = stockValues[key] || 0;
                      const isLowStock = qty > 0 && qty < 5;
                      
                      return (
                        <td key={size} className="py-2 px-2">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              value={stockValues[key] || 0}
                              onChange={(e) =>
                                handleStockChange(color.name, size, e.target.value)
                              }
                              className={`w-20 text-center ${
                                isLowStock ? 'border-yellow-400 bg-yellow-50' : ''
                              }`}
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSaveStock(color.name, size)}
                              disabled={saving}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-3 px-4 text-center font-semibold">
                      {getStockByColor(color.name)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4">Total</td>
                  {product.sizes.map((size) => (
                    <td key={size} className="py-3 px-4 text-center">
                      {getStockBySize(size)}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-center text-lg">
                    {getTotalStock()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
