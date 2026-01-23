import { useState, useEffect } from 'react';
import { Product, Color } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Plus, Upload } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { compressImage, validateImageFile, formatFileSize } from '../utils/imageHelper';

interface ProductFormProps {
  product?: Product;
  onSave: (productData: Partial<Product>) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [code, setCode] = useState(product?.code || '');
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [pricePaid, setPricePaid] = useState(product?.pricePaid?.toString() || '');
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [colors, setColors] = useState<Color[]>(product?.colors || []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newSize, setNewSize] = useState('');
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!code.trim()) {
      setError('Código é obrigatório');
      return;
    }
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    if (!category.trim()) {
      setError('Categoria é obrigatória');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Preço deve ser maior que zero');
      return;
    }
    if (colors.length === 0) {
      setError('Adicione pelo menos uma cor');
      return;
    }
    if (sizes.length === 0) {
      setError('Adicione pelo menos um tamanho');
      return;
    }

    const productData: Partial<Product> = {
      code: code.trim(),
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      price: parseFloat(price),
      pricePaid: pricePaid ? parseFloat(pricePaid) : undefined,
      images,
      image: images[0] || '', // Primeira imagem como principal
      colors,
      sizes,
      tags,
      stock: product?.stock || [], // Manter estoque existente ou array vazio
    };

    onSave(productData);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar arquivo
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Arquivo inválido');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      // Comprimir e converter para base64
      const base64 = await compressImage(file);
      setImages([...images, base64]);
      
      // Resetar input para permitir upload do mesmo arquivo novamente
      e.target.value = '';
    } catch (err) {
      setError('Erro ao processar imagem: ' + (err as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addColor = () => {
    if (newColorName.trim()) {
      setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
      setNewColorName('');
      setNewColorHex('#000000');
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim().toUpperCase())) {
      setSizes([...sizes, newSize.trim().toUpperCase()]);
      setNewSize('');
    }
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código do Produto *</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: CORAL-001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do produto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Camisetas, Calças"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição detalhada do produto..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preços */}
        <Card>
          <CardHeader>
            <CardTitle>Preços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço de Venda (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePaid">Valor Pago (R$)</Label>
              <Input
                id="pricePaid"
                type="number"
                step="0.01"
                min="0"
                value={pricePaid}
                onChange={(e) => setPricePaid(e.target.value)}
                placeholder="0.00 (opcional)"
              />
              <p className="text-xs text-gray-500">
                Valor que você pagou pelo produto (histórico)
              </p>
            </div>

            {price && pricePaid && parseFloat(price) > parseFloat(pricePaid) && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  Margem de lucro: R$ {(parseFloat(price) - parseFloat(pricePaid)).toFixed(2)}
                  {' '}({(((parseFloat(price) - parseFloat(pricePaid)) / parseFloat(pricePaid)) * 100).toFixed(1)}%)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Imagens */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens do Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* Upload de arquivo */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
              <Label htmlFor="imageUpload" className="block mb-2 text-center cursor-pointer">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <span className="text-sm font-medium">Clique para fazer upload de imagem</span>
                <span className="block text-xs text-gray-500 mt-1">
                  ou arraste e solte aqui
                </span>
              </Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <p className="text-xs text-gray-500 text-center mt-2">
                JPG, PNG, GIF, WebP (máx 5MB) • Imagens serão comprimidas automaticamente
              </p>
            </div>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou</span>
              </div>
            </div>

            {/* URL da imagem */}
            <div>
              <Label htmlFor="imageUrl" className="block mb-2">
                Cole uma URL de imagem
              </Label>
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                />
                <Button type="button" onClick={addImage} variant="outline" disabled={!newImageUrl.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {uploadingImage && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2 text-sm text-gray-600">Processando imagem...</span>
            </div>
          )}

          {images.length > 0 && (
            <div>
              <Label className="block mb-2">
                Imagens adicionadas ({images.length})
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Produto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESem imagem%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Dica: A primeira imagem será usada como imagem principal do produto
              </p>
            </div>
          )}

          {images.length === 0 && !uploadingImage && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Upload className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Nenhuma imagem adicionada ainda
              </p>
              <p className="text-xs text-gray-400 mt-1">
                As imagens ajudam a vender mais!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cores */}
      <Card>
        <CardHeader>
          <CardTitle>Cores *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Nome da cor"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
            />
            <Input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-20"
            />
            <Button type="button" onClick={addColor} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 border rounded-lg"
                >
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm">{color.name}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tamanhos */}
      <Card>
        <CardHeader>
          <CardTitle>Tamanhos *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Ex: P, M, G, GG"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
            />
            <Button type="button" onClick={addSize} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 border rounded-lg"
                >
                  <span className="text-sm font-medium">{size}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Ex: novo, promoção, destaque"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {product ? 'Atualizar Produto' : 'Criar Produto'}
        </Button>
      </div>
    </form>
  );
}
