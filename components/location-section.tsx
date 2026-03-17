'use client'

import { GOOGLE_MAPS_LINK, BUSINESS_ADDRESS, PHONE_NUMBER_DISPLAY, PHONE_NUMBER_2 } from '@/lib/config'
import { MapPin, Navigation, Phone, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LocationSection() {
  return (
    <section id="ubicacion" className="py-16 px-4 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Nuestra Ubicación</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Cómo Llegar?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Visítanos y prueba nuestras deliciosas lechonas recién asadas
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Dirección</h3>
                  <p className="text-muted-foreground">{BUSINESS_ADDRESS}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Teléfonos</h3>
                  <p className="text-muted-foreground">{PHONE_NUMBER_DISPLAY}</p>
                  <p className="text-muted-foreground">{PHONE_NUMBER_2}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Horario</h3>
                  <p className="text-muted-foreground">Lunes a Domingo</p>
                  <p className="text-muted-foreground">8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
            
            <a 
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 gap-3">
                <Navigation className="w-5 h-5" />
                Abrir en Google Maps
              </Button>
            </a>
          </div>
          
          {/* Mapa ilustrativo */}
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/20 border border-border">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                  <MapPin className="w-12 h-12 text-primary" />
                </div>
                <p className="text-foreground font-semibold text-lg mb-2">
                  {"A'MASCAR LECHONERIA"}
                </p>
                <p className="text-muted-foreground text-sm">
                  {BUSINESS_ADDRESS}
                </p>
              </div>
            </div>
            
            {/* Decoración de mapa */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                {/* Líneas de cuadrícula */}
                {[...Array(10)].map((_, i) => (
                  <g key={i}>
                    <line 
                      x1={i * 40} y1="0" x2={i * 40} y2="400" 
                      stroke="currentColor" 
                      strokeWidth="1"
                      className="text-border"
                    />
                    <line 
                      x1="0" y1={i * 40} x2="400" y2={i * 40} 
                      stroke="currentColor" 
                      strokeWidth="1"
                      className="text-border"
                    />
                  </g>
                ))}
                {/* Calles principales */}
                <path 
                  d="M0,200 L400,200 M200,0 L200,400" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  className="text-primary/30"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
