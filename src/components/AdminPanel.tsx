import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { LogOut, Package, DollarSign, RefreshCw, Plus, Edit, Trash2, Download, Upload, Eye, Box, Cloud, HardDrive } from 'lucide-react';
import { Product } from '../types';
import { 
  loadProducts as loadProductsFromService, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getCategories,
  getProductStats,
  exportToJSON,
  importFromJSON,
  initializeStock,
  downloadProductsJSON,
  syncFromRemote
} from '../services/productService';
import { ProductForm } from './ProductForm';
import { StockManager } from './StockManager';

// Credenciais hardcoded (em produção, use autenticação adequada)
const ADMIN_CREDENTIALS = {
  username: 'adminCoral',
  password: 'Coral160805'
};

interface AdminPanelProps {}

export function AdminPanel({}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados para dados dos produtos
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Estados para UI
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showStockManager, setShowStockManager] = useState(false);
  const [managingStockProduct, setManagingStockProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Carregar produtos quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = () => {
    const data = loadProductsFromService();
    setProducts(data);
    setCategories(getCategories());
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Usuário ou senha incorretos');
      }
      setLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setError('');
    setProducts([]);
    setCategories([]);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, productData);
        showToast('Produto atualizado com sucesso!');
      } else {
        const newProduct = createProduct({
          ...productData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
          stock: initializeStock(productData as Product),
        });
        showToast('Produto criado com sucesso!');
      }
      loadProducts();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = () => {
    if (deleteConfirmProduct) {
      try {
        deleteProduct(deleteConfirmProduct.id);
        showToast('Produto excluído com sucesso!');
        loadProducts();
        setDeleteConfirmProduct(null);
      } catch (err) {
        showToast((err as Error).message, 'error');
      }
    }
  };

  const handleManageStock = (product: Product) => {
    setManagingStockProduct(product);
    setShowStockManager(true);
  };

  const handleStockUpdate = (updatedProduct: Product) => {
    loadProducts();
    setManagingStockProduct(updatedProduct);
  };

  const handleExportJSON = () => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coral-fit-products-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Backup exportado! Use este arquivo para backup.');
  };

  const handleDownloadProductsJSON = () => {
    downloadProductsJSON();
    showToast('✓ products.json baixado! Substitua o arquivo no projeto e faça commit.', 'success');
  };

  const handleSyncFromRemote = async () => {
    try {
      const count = await syncFromRemote();
      loadProducts();
      showToast(`✓ Sincronizado! ${count} produtos carregados do repositório.`);
    } catch (err) {
      showToast('Erro ao sincronizar do repositório', 'error');
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = event.target?.result as string;
          importFromJSON(json);
          loadProducts();
          showToast('Produtos importados com sucesso!');
        } catch (err) {
          showToast((err as Error).message, 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Coral Fit Admin</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getProductStats();

  // Se estiver gerenciando estoque
  if (showStockManager && managingStockProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={() => setShowStockManager(false)}>
                ← Voltar
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                Gerenciar Estoque: {managingStockProduct.name}
              </h1>
              <p className="text-sm text-gray-600">Código: {managingStockProduct.code}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <StockManager product={managingStockProduct} onUpdate={handleStockUpdate} />
        </main>
      </div>
    );
  }

  // Se estiver criando/editando produto
  if (showProductForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <ProductForm
            product={editingProduct || undefined}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <Alert variant={toast.type === 'error' ? 'destructive' : 'default'} className="bg-white">
            <AlertDescription>{toast.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coral Fit Admin</h1>
            <p className="text-sm text-gray-600">Sistema de Gerenciamento de Produtos</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleSyncFromRemote} 
              className="gap-2"
              title="Carregar produtos do repositório GitHub"
            >
              <Cloud className="h-4 w-4" />
              Sincronizar do GitHub
            </Button>
            <Button 
              variant="default" 
              onClick={handleDownloadProductsJSON} 
              className="gap-2 bg-green-600 hover:bg-green-700"
              title="Baixar products.json para substituir no projeto"
            >
              <HardDrive className="h-4 w-4" />
              Salvar no Projeto
            </Button>
            <Button variant="outline" onClick={handleExportJSON} className="gap-2">
              <Download className="h-4 w-4" />
              Backup JSON
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <label htmlFor="import-json" className="cursor-pointer">
                <Upload className="h-4 w-4" />
                Importar JSON
                <input
                  id="import-json"
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              const data = localStorage.getItem('coral_fit_products');
              console.log('=== DEBUG LOCALSTORAGE ===');
              console.log('Chave:', 'coral_fit_products');
              console.log('Dados brutos:', data);
              console.log('Tamanho:', data ? (data.length / 1024).toFixed(2) + ' KB' : '0 KB');
              if (data) {
                try {
                  const parsed = JSON.parse(data);
                  console.log('Produtos parseados:', parsed.length);
                  console.table(parsed.map((p: any) => ({ 
                    id: p.id, 
                    code: p.code, 
                    name: p.name, 
                    price: p.price,
                    images: p.images?.length || 0
                  })));
                } catch (e) {
                  console.error('Erro ao parsear JSON:', e);
                }
              } else {
                console.log('LocalStorage vazio!');
              }
              alert('Verifique o console do navegador (F12) para ver os dados');
            }}>
              🐛 Debug
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertDescription className="text-sm">
            <strong>💡 Fluxo de Trabalho:</strong> 
            <span className="ml-2">
              1. Cadastre produtos aqui (salvos localmente) 
              → 2. Clique em <strong>"Salvar no Projeto"</strong> 
              → 3. Substitua <code className="bg-blue-100 px-1 rounded">public/products.json</code> 
              → 4. Commit e Push para GitHub 
              → 5. Site atualiza automaticamente! 🚀
            </span>
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Produtos
              </CardTitle>
              <Package className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-gray-500 mt-1">Produtos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Estoque Total
              </CardTitle>
              <Box className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStockItems}</div>
              <p className="text-xs text-gray-500 mt-1">Unidades em estoque</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Categorias
              </CardTitle>
              <Package className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs text-gray-500 mt-1">Categorias ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Preço Médio
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats.averagePrice.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Valor médio dos produtos</p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Produtos</CardTitle>
                <CardDescription>
                  Gerencie seu catálogo de produtos
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={loadProducts} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
                <Button onClick={() => setShowProductForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum produto cadastrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Comece criando seu primeiro produto
                </p>
                <Button onClick={() => setShowProductForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Produto
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Código</th>
                      <th className="text-left py-3 px-4">Imagem</th>
                      <th className="text-left py-3 px-4">Nome</th>
                      <th className="text-left py-3 px-4">Categoria</th>
                      <th className="text-right py-3 px-4">Preço</th>
                      <th className="text-center py-3 px-4">Estoque</th>
                      <th className="text-center py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const totalStock = product.stock.reduce((sum, s) => sum + s.quantity, 0);
                      return (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{product.code}</td>
                          <td className="py-3 px-4">
                            {product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500">
                                {product.colors.length} cores, {product.sizes.length} tamanhos
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{product.category}</td>
                          <td className="py-3 px-4 text-right font-semibold">
                            R$ {product.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              totalStock === 0 
                                ? 'bg-red-100 text-red-800' 
                                : totalStock < 10 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {totalStock} un.
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleManageStock(product)}
                                title="Gerenciar Estoque"
                              >
                                <Box className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditProduct(product)}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteConfirmProduct(product)}
                                title="Excluir"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteConfirmProduct(null)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmar Exclusão
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja excluir o produto "<strong>{deleteConfirmProduct.name}</strong>"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmProduct(null)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteProduct}
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
