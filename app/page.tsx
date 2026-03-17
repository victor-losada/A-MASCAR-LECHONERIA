'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { CatalogSection } from '@/components/catalog-section'
import { OffersSection } from '@/components/offers-section'
import { LocationSection } from '@/components/location-section'
import { Footer } from '@/components/footer'
import { CartSidebar } from '@/components/cart-sidebar'

export default function HomePage() {
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0)
  
  const handleCartUpdate = () => {
    setCartUpdateTrigger(prev => prev + 1)
  }
  
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CatalogSection onCartUpdate={handleCartUpdate} />
      <OffersSection />
      <LocationSection />
      <Footer />
      <CartSidebar cartUpdateTrigger={cartUpdateTrigger} />
    </main>
  )
}
