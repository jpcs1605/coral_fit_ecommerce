import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { LogOut, Package, ShoppingCart, Users, DollarSign, RefreshCw, Plus, Edit, Trash2, Download, Upload, Eye } from 'lucide-react';
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
  initializeStock
} from '../services/productService';
import { ProductForm } from './ProductForm';
import { StockManager } from './StockManager';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular delay de autenticação
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coral Fit Admin</h1>
            <p className="text-sm text-gray-600">Painel Administrativo</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
              <div className="text-2xl font-bold">
                {loadingProducts ? (
                  <RefreshCw className="h-6 w-6 animate-spin" />
                ) : (
                  products.length
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {loadingProducts ? 'Carregando...' : 'Produtos cadastrados'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pedidos Hoje
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">Nenhum pedido ainda</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Categorias
              </CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingProducts ? (
                  <RefreshCw className="h-6 w-6 animate-spin" />
                ) : (
                  categories.length
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Categorias ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Valor Médio
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingProducts ? (
                  <RefreshCw className="h-6 w-6 animate-spin" />
                ) : (
                  products.length > 0
                    ? `R$ ${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}`
                    : 'R$ 0,00'
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Preço médio dos produtos</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Produtos</CardTitle>
                    <CardDescription>
                      Gerencie seu catálogo de produtos através da planilha do Google Sheets
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={loadProducts} disabled={loadingProducts}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingProducts ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600">Total de Produtos</p>
                    <p className="text-2xl font-bold mt-1">{products.length}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600">Categorias</p>
                    <p className="text-2xl font-bold mt-1">{categories.length}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600">Preço Médio</p>
                    <p className="text-2xl font-bold mt-1">
                      {products.length > 0
                        ? `R$ ${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}`
                        : 'R$ 0,00'}
                    </p>
                  </div>
                </div>
                
                {categories.length > 0 && (
                  <div className="space-y-2">
                    <Label>Produtos por Categoria</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {categories.map(category => {
                        const count = products.filter(p => p.category === category).length;
                        return (
                          <div key={category} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{category}</span>
                            <span className="text-sm font-semibold">{count} produtos</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Alert>
                  <AlertDescription>
                    Os produtos são gerenciados através da planilha do Google Sheets.
                    Para adicionar, editar ou remover produtos, acesse a planilha diretamente.
                  </AlertDescription>
                </Alert>
                <div className="mt-4">
                  <Button asChild>
                    <a
                      href="https://docs.google.com/spreadsheets/d/14IMBUoWENDMxAmuIEf-yu_ACEkCMjnq_T9OHYnrv3L8"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir Planilha de Produtos
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos</CardTitle>
                <CardDescription>
                  Visualize e gerencie os pedidos dos clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    Nenhum pedido registrado ainda. Os pedidos são enviados via WhatsApp.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clientes</CardTitle>
                <CardDescription>
                  Gerenciamento de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    O gerenciamento de clientes será implementado em breve.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>
                  Configure as opções da loja
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ID da Planilha</Label>
                  <Input 
                    value="14IMBUoWENDMxAmuIEf-yu_ACEkCMjnq_T9OHYnrv3L8" 
                    disabled 
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Configurado em src/services/googleSheets.ts
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>CEP de Origem</Label>
                  <Input 
                    value="06727-187" 
                    disabled 
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    CEP usado para cálculo de frete
                  </p>
                </div>

                <Alert>
                  <AlertDescription>
                    Para alterar configurações avançadas, edite o arquivo src/services/googleSheets.ts
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
