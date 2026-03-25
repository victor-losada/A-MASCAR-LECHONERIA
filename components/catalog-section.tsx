'use client'

import { useState, useEffect } from 'react'
import { Product, PRODUCT_CATEGORIES, ProductCategory } from '@/lib/config'
import { getProducts } from '@/lib/store'
import { ProductCard } from './product-card'
import { Package, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface CatalogSectionProps {
  onCartUpdate?: () => void
}

export function CatalogSection({ onCartUpdate }: CatalogSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    const loadProducts = () => {
      const allProducts = getProducts().filter(p => p.available)
      setProducts(allProducts)
    }
    
    loadProducts()
    
    // Escuchar cambios en localStorage
    const handleStorageChange = () => loadProducts()
    window.addEventListener('storage', handleStorageChange)
    
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  return (
    <section id="catalogo" className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Package className="w-4 h-4" />
            <span className="text-sm font-medium">Nuestros Productos</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nuestro Catálogo
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Descubre nuestras deliciosas lechonas asadas, bebidas refrescantes y salsas artesanales
          </p>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Buscador */}
          <div className="relative flex-1 max-w-md mx-auto sm:mx-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
          
          {/* Categorías */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Todos
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Grid de productos */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onCartUpdate={onCartUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {products.length === 0 ? 'Catálogo en construcción' : 'No se encontraron productos'}
              </h3>
              <p className="text-muted-foreground">
                {products.length === 0 
                  ? 'Pronto agregaremos deliciosos productos para ti. ¡Vuelve pronto!'
                  : 'Intenta con otra búsqueda o categoría diferente.'
                }
              </p>
              {products.length === 0 && (
                <p className="text-sm text-muted-foreground/70 mt-4">
                  ¿Eres el administrador? <a href="/admin" className="text-primary hover:underline">Agrega productos aquí</a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
