/* ===========================================
   CONFIGURACIÓN DEL NEGOCIO - A'MASCAR LECHONERIA
   
   ¡IMPORTANTE! Aquí puedes cambiar todos los datos
   principales de tu negocio fácilmente.
   =========================================== */

// ============ DATOS DEL NEGOCIO ============
export const BUSINESS_NAME = "A'MASCAR LECHONERIA"
export const BUSINESS_SLOGAN = "Lechonas auténticas y frescas"
export const BUSINESS_DESCRIPTION = "El sabor tradicional de Colombia en tu mesa"

// ============ NÚMEROS DE CONTACTO ============
// Cambia estos números por los de tu negocio
export const WHATSAPP_NUMBER = "573166100761" // Número principal (con código de país 57)
export const PHONE_NUMBER_DISPLAY = "316 610 0761" // Cómo se muestra
export const PHONE_NUMBER_2 = "313 309 0994" // Segundo número
export const WHATSAPP_NUMBER_2 = "573133090994" // Segundo WhatsApp

// ============ UBICACIÓN ============
// Cambia este link por la ubicación real de tu negocio en Google Maps
// Para obtenerlo: Abre Google Maps > Busca tu negocio > Clic en "Compartir" > Copia el link
export const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/GiB2QKAhyEEYtPgcA"

// Dirección para mostrar
export const BUSINESS_ADDRESS = "Pitalito, Huila"

// ============ CREDENCIALES DEL ADMINISTRADOR ============
// ¡IMPORTANTE! Cambia la contraseña después de la primera vez
export const ADMIN_USERNAME = "victor"
export const ADMIN_PASSWORD = "victor123" // Cambia esta contraseña

// ============ CATEGORÍAS DE PRODUCTOS ============
export const PRODUCT_CATEGORIES = [
  { id: 'lechonas', name: 'Lechonas', icon: '🐷' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
  { id: 'salsas', name: 'Salsas', icon: '🫙' },
  { id: 'addons', name: 'Adicionales', icon: '➕' },
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]['id']

// ============ TIPOS DE DATOS ============
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  imageUrl: string
  available: boolean
  discount?: number // Porcentaje de descuento individual
}

export interface CartItem extends Product {
  quantity: number
}

export interface Offer {
  id: string
  name: string
  description: string
  discountPercent: number
  isGlobal: boolean // Si aplica a todos los productos
  productIds?: string[] // IDs de productos específicos si no es global
  active: boolean
  validUntil?: string
}

export interface Order {
  id: string
  items: CartItem[]
  customerName: string
  customerPhone: string
  customerAddress?: string
  orderType: 'delivery' | 'pickup'
  subtotal: number
  discount: number
  total: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

// ============ FUNCIONES AUXILIARES ============
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

export function generateWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
}

/* ===========================================
   🐷 INSTRUCCIONES PARA EL DUEÑO 🐷
   =========================================== 
   
   ¡Hola! Aquí te explicamos cómo personalizar tu tienda:
   
   ═══════════════════════════════════════════
   1. CAMBIAR NOMBRE DEL NEGOCIO
   ═══════════════════════════════════════════
   - Busca la línea: export const BUSINESS_NAME = "A'MASCAR LECHONERIA"
   - Cambia el texto entre comillas por el nombre de tu negocio
   
   ═══════════════════════════════════════════
   2. CAMBIAR NÚMEROS DE WHATSAPP/TELÉFONO
   ═══════════════════════════════════════════
   - WHATSAPP_NUMBER: Número con código de país (57 para Colombia)
     Ejemplo: "573166100761" (sin espacios, sin +)
   - PHONE_NUMBER_DISPLAY: Cómo se muestra al cliente
     Ejemplo: "316 610 0761"
   - También puedes cambiar el segundo número (PHONE_NUMBER_2)
   
   ═══════════════════════════════════════════
   3. CAMBIAR UBICACIÓN EN GOOGLE MAPS
   ═══════════════════════════════════════════
   Para obtener tu link de Google Maps:
   1. Abre Google Maps en tu computador
   2. Busca tu negocio o dirección exacta
   3. Haz clic en "Compartir"
   4. Copia el enlace
   5. Pégalo en GOOGLE_MAPS_LINK
   
   También actualiza BUSINESS_ADDRESS con tu dirección legible
   
   ═══════════════════════════════════════════
   4. CAMBIAR CONTRASEÑA DE ADMINISTRADOR
   ═══════════════════════════════════════════
   - Busca: export const ADMIN_PASSWORD = "lechona2026"
   - Cambia "lechona2026" por tu contraseña segura
   - El usuario seguirá siendo "admin" (puedes cambiarlo también)
   
   ═══════════════════════════════════════════
   5. AGREGAR PRODUCTOS
   ═══════════════════════════════════════════
   1. Ve a tudominio.com/admin
   2. Ingresa con usuario: admin / contraseña: lechona2026
   3. En la pestaña "Productos", haz clic en "Agregar Producto"
   4. Completa: nombre, precio, descripción, categoría
   5. Para la imagen, usa una URL pública de tu imagen
      (puedes subir imágenes a imgur.com o similar)
   
   ═══════════════════════════════════════════
   6. CREAR OFERTAS Y DESCUENTOS
   ═══════════════════════════════════════════
   1. En el panel de admin, ve a la pestaña "Ofertas"
   2. Haz clic en "Crear Oferta"
   3. Pon un nombre, porcentaje de descuento y descripción
   4. Activa o desactiva la oferta cuando quieras
   
   ═══════════════════════════════════════════
   
   ¿Necesitas ayuda? El sistema guarda todo en el navegador
   del dispositivo. Si cambias de navegador o dispositivo,
   los productos y ofertas se deben volver a agregar.
   
   ¡Éxitos con tu negocio! 🎉
   =========================================== */
