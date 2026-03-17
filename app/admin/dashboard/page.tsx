'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Product, 
  Offer, 
  Order, 
  PRODUCT_CATEGORIES, 
  ProductCategory,
  formatPrice,
  BUSINESS_NAME
} from '@/lib/config'
import { 
  isAdminAuthenticated,
  logoutAdmin,
  getAllProducts,
  getAllOffers,
  addOffer,
  updateOffer,
  deleteOffer,
  getOrders,
  updateOrderStatus
} from '@/lib/supabase-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  Package, 
  Tag, 
  ShoppingBag, 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  DollarSign,
  Percent,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Estado para formularios
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showOfferForm, setShowOfferForm] = useState(false)
  
  // Formulario de producto
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'lechonas' as ProductCategory,
    imageUrl: '',
    available: true,
    discount: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // Formulario de oferta
  const [offerForm, setOfferForm] = useState({
    name: '',
    description: '',
    discountPercent: '',
    isGlobal: true,
    active: true,
    validUntil: ''
  })

  async function loadData() {
    setIsLoading(true)
    const [p, o, ord] = await Promise.all([
      getAllProducts(),
      getAllOffers(),
      getOrders()
    ])
    setProducts(p)
    setOffers(o)
    setOrders(ord)
    setIsLoading(false)
  }
  
  useEffect(() => {
    // Verificar autenticación
    if (!isAdminAuthenticated()) {
      router.push('/admin')
      return
    }
    
    loadData()
  }, [router])
  
  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin')
  }
  
  // ============ PRODUCTOS ============
  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'lechonas',
      imageUrl: '',
      available: true,
      discount: ''
    })
    setImageFile(null)
    setImagePreview(null)
    setEditingProduct(null)
    setShowProductForm(false)
  }
  
  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      available: product.available,
      discount: product.discount?.toString() || ''
    })
    setImageFile(null)
    setImagePreview(product.imageUrl || null)
    setEditingProduct(product)
    setShowProductForm(true)
  }
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setImageFile(null)
      setImagePreview(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe pesar menos de 5MB')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price) {
      toast.error('Nombre y precio son obligatorios')
      return
    }
    
    let imageUrl = productForm.imageUrl

    // Si el usuario seleccionó un archivo, lo subimos vía API (servidor con service role, evita RLS de Storage)
    if (imageFile) {
      try {
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadRes = await fetch('/api/admin/upload-product-image', {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json().catch(() => ({}))
        if (!uploadRes.ok || !uploadData.url) {
          toast.error(uploadData.error || 'No se pudo subir la imagen')
          return
        }
        imageUrl = uploadData.url
      } catch (err) {
        console.error(err)
        toast.error('Error inesperado al subir la imagen')
        return
      }
    }

    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category: productForm.category,
      imageUrl,
      available: productForm.available,
      discount: productForm.discount ? parseFloat(productForm.discount) : undefined
    }
    
    try {
      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: productData.category,
            imageUrl: productData.imageUrl,
            available: productData.available,
            discount: productData.discount
          })
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) toast.success('Producto actualizado')
        else toast.error(data.error || 'No se pudo actualizar el producto')
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: productData.category,
            imageUrl: productData.imageUrl,
            available: productData.available,
            discount: productData.discount
          })
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data.id) toast.success('Producto agregado')
        else toast.error(data.error || 'No se pudo agregar el producto')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error al guardar el producto')
      return
    }
    
    await loadData()
    resetProductForm()
  }
  
  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      await loadData()
      if (res.ok) toast.success('Producto eliminado')
      else toast.error(data.error || 'No se pudo eliminar el producto')
    }
  }
  
  // ============ OFERTAS ============
  const resetOfferForm = () => {
    setOfferForm({
      name: '',
      description: '',
      discountPercent: '',
      isGlobal: true,
      active: true,
      validUntil: ''
    })
    setEditingOffer(null)
    setShowOfferForm(false)
  }
  
  const handleEditOffer = (offer: Offer) => {
    setOfferForm({
      name: offer.name,
      description: offer.description,
      discountPercent: offer.discountPercent.toString(),
      isGlobal: offer.isGlobal,
      active: offer.active,
      validUntil: offer.validUntil || ''
    })
    setEditingOffer(offer)
    setShowOfferForm(true)
  }
  
  const handleSaveOffer = async () => {
    if (!offerForm.name || !offerForm.discountPercent) {
      toast.error('Nombre y porcentaje son obligatorios')
      return
    }
    
    const offerData = {
      name: offerForm.name,
      description: offerForm.description,
      discountPercent: parseFloat(offerForm.discountPercent),
      isGlobal: offerForm.isGlobal,
      active: offerForm.active,
      validUntil: offerForm.validUntil || undefined
    }
    
    try {
      if (editingOffer) {
        const ok = await updateOffer(editingOffer.id, {
          name: offerData.name,
          description: offerData.description,
          discountPercent: offerData.discountPercent,
          isGlobal: offerData.isGlobal,
          active: offerData.active,
          validUntil: offerData.validUntil
        })
        if (ok) toast.success('Oferta actualizada')
      } else {
        await addOffer({
          name: offerData.name,
          description: offerData.description,
          discountPercent: offerData.discountPercent,
          isGlobal: offerData.isGlobal,
          active: offerData.active,
          validUntil: offerData.validUntil
        })
        toast.success('Oferta creada')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'No se pudo guardar la oferta')
      return
    }
    
    await loadData()
    resetOfferForm()
  }
  
  const handleDeleteOffer = async (offerId: string) => {
    if (confirm('¿Estás seguro de eliminar esta oferta?')) {
      const ok = await deleteOffer(offerId)
      await loadData()
      if (ok) toast.success('Oferta eliminada')
      else toast.error('No se pudo eliminar la oferta')
    }
  }
  
  // ============ PEDIDOS ============
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    const ok = await updateOrderStatus(orderId, status)
    await loadData()
    if (ok) toast.success('Estado del pedido actualizado')
    else toast.error('No se pudo actualizar el estado del pedido')
  }
  
  const getStatusBadge = (status: Order['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      completed: 'Completado',
      cancelled: 'Cancelado'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐷</span>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">
                Panel de Admin
              </h1>
              <p className="text-xs text-muted-foreground">{BUSINESS_NAME}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Ver tienda →
            </a>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>
      
      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="text-muted-foreground mb-6">Cargando datos…</div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              Productos ({products.length})
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2">
              <Tag className="w-4 h-4" />
              Ofertas ({offers.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Pedidos ({orders.length})
            </TabsTrigger>
          </TabsList>
          
          {/* TAB: PRODUCTOS */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Gestionar Productos</h2>
              <Button 
                onClick={() => setShowProductForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Producto
              </Button>
            </div>
            
            {/* Formulario de producto */}
            {showProductForm && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetProductForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      placeholder="Ej: Lechona Familiar"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Categoría *</Label>
                    <Select 
                      value={productForm.category} 
                      onValueChange={(v) => setProductForm({...productForm, category: v as ProductCategory})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Precio (COP) *
                    </Label>
                    <Input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      placeholder="Ej: 150000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Descuento (%)
                    </Label>
                    <Input
                      type="number"
                      value={productForm.discount}
                      onChange={(e) => setProductForm({...productForm, discount: e.target.value})}
                      placeholder="Ej: 10"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label>Descripción</Label>
                    <Input
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      placeholder="Descripción corta del producto"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Imagen del producto
                    </Label>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Se subirá a Supabase Storage (bucket `product-images`). Máx. 5MB.
                      </p>
                      {(imagePreview || productForm.imageUrl) && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Vista previa:</p>
                          <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            <img
                              src={imagePreview || productForm.imageUrl}
                              alt="Vista previa"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={productForm.available}
                      onCheckedChange={(v) => setProductForm({...productForm, available: v})}
                    />
                    <Label>Disponible</Label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={resetProductForm}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProduct} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Save className="w-4 h-4" />
                    Guardar
                  </Button>
                </div>
              </div>
            )}
            
            {/* Lista de productos */}
            {products.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No hay productos aún</p>
                <p className="text-sm text-muted-foreground/70">Agrega tu primer producto para comenzar</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🐷</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        {!product.available && (
                          <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                            No disponible
                          </span>
                        )}
                        {product.discount && product.discount > 0 && (
                          <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                      <p className="text-primary font-semibold">{formatPrice(product.price)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* TAB: OFERTAS */}
          <TabsContent value="offers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Gestionar Ofertas</h2>
              <Button 
                onClick={() => setShowOfferForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear Oferta
              </Button>
            </div>
            
            {/* Formulario de oferta */}
            {showOfferForm && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">
                    {editingOffer ? 'Editar Oferta' : 'Nueva Oferta'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetOfferForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre de la oferta *</Label>
                    <Input
                      value={offerForm.name}
                      onChange={(e) => setOfferForm({...offerForm, name: e.target.value})}
                      placeholder="Ej: Descuento de fin de semana"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Porcentaje de descuento *
                    </Label>
                    <Input
                      type="number"
                      value={offerForm.discountPercent}
                      onChange={(e) => setOfferForm({...offerForm, discountPercent: e.target.value})}
                      placeholder="Ej: 15"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label>Descripción</Label>
                    <Input
                      value={offerForm.description}
                      onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                      placeholder="Descripción de la oferta"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Válido hasta (opcional)
                    </Label>
                    <Input
                      type="date"
                      value={offerForm.validUntil}
                      onChange={(e) => setOfferForm({...offerForm, validUntil: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-4 justify-center">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={offerForm.isGlobal}
                        onCheckedChange={(v) => setOfferForm({...offerForm, isGlobal: v})}
                      />
                      <Label>Aplicar a todos los productos</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={offerForm.active}
                        onCheckedChange={(v) => setOfferForm({...offerForm, active: v})}
                      />
                      <Label>Oferta activa</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={resetOfferForm}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveOffer} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Save className="w-4 h-4" />
                    Guardar
                  </Button>
                </div>
              </div>
            )}
            
            {/* Lista de ofertas */}
            {offers.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                <Tag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No hay ofertas aún</p>
                <p className="text-sm text-muted-foreground/70">Crea tu primera oferta para atraer más clientes</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Percent className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{offer.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded ${offer.active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                          {offer.active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{offer.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-primary font-semibold">{offer.discountPercent}% OFF</span>
                        <span className="text-muted-foreground">
                          {offer.isGlobal ? 'Todo el catálogo' : 'Productos seleccionados'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditOffer(offer)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteOffer(offer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* TAB: PEDIDOS */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Pedidos Recibidos</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No hay pedidos aún</p>
                <p className="text-sm text-muted-foreground/70">Los pedidos aparecerán aquí cuando los clientes compren</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">Pedido #{order.id.slice(-6)}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString('es-CO')}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
                    </div>
                    
                    {/* Datos del cliente */}
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="font-medium text-foreground">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                      {order.customerAddress && (
                        <p className="text-sm text-muted-foreground">{order.customerAddress}</p>
                      )}
                      <p className="text-sm mt-2">
                        <span className="font-medium">
                          {order.orderType === 'delivery' ? '🚚 Domicilio' : '📍 Recoger en tienda'}
                        </span>
                      </p>
                    </div>
                    
                    {/* Productos */}
                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-foreground">{item.name} x{item.quantity}</span>
                          <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                      <Button
                        size="sm"
                        variant={order.status === 'confirmed' ? 'default' : 'outline'}
                        onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                        className="gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        Confirmar
                      </Button>
                      <Button
                        size="sm"
                        variant={order.status === 'completed' ? 'default' : 'outline'}
                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                        className="gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Completado
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                        className="gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <XCircle className="w-3 h-3" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
