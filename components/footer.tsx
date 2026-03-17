'use client'

import { 
  BUSINESS_NAME, 
  BUSINESS_SLOGAN,
  PHONE_NUMBER_DISPLAY, 
  PHONE_NUMBER_2,
  WHATSAPP_NUMBER,
  BUSINESS_ADDRESS,
  GOOGLE_MAPS_LINK
} from '@/lib/config'
import { Phone, MapPin, MessageCircle, Heart } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer id="contacto" className="bg-accent text-accent-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🐷</span>
              <span className="font-display text-xl font-bold">
                {BUSINESS_NAME}
              </span>
            </div>
            <p className="text-accent-foreground/80">
              {BUSINESS_SLOGAN}. El auténtico sabor colombiano en cada bocado. 
              Tradición, calidad y sabor que nos distingue.
            </p>
          </div>
          
          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp: {PHONE_NUMBER_DISPLAY}</span>
              </a>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>{PHONE_NUMBER_2}</span>
              </div>
              <a 
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-primary transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span>{BUSINESS_ADDRESS}</span>
              </a>
            </div>
          </div>
          
          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Enlaces</h3>
            <div className="space-y-3">
              <Link href="/#catalogo" className="block hover:text-primary transition-colors">
                Catálogo
              </Link>
              <Link href="/#ofertas" className="block hover:text-primary transition-colors">
                Ofertas
              </Link>
              <Link href="/#ubicacion" className="block hover:text-primary transition-colors">
                Ubicación
              </Link>
              <Link href="/checkout" className="block hover:text-primary transition-colors">
                Hacer Pedido
              </Link>
            </div>
          </div>
        </div>
        
        {/* Línea separadora */}
        <div className="border-t border-accent-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-accent-foreground/70">
            <p>
              © {currentYear} {BUSINESS_NAME}. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-1">
              Hecho con <Heart className="w-4 h-4 text-red-400 fill-current" /> en Colombia
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
