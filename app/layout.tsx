import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-display'
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
})

/* ===========================================
   INSTRUCCIONES PARA EL DUEÑO:
   
   Para cambiar el nombre del negocio, busca "A'MASCAR LECHONERIA"
   en todos los archivos y reemplázalo.
   
   Para cambiar los números de WhatsApp:
   - Ve a lib/config.ts
   - Modifica WHATSAPP_NUMBER
   
   Para cambiar el link de Google Maps:
   - Ve a lib/config.ts
   - Modifica GOOGLE_MAPS_LINK
   
   Para cambiar la contraseña del admin:
   - Ve a lib/config.ts
   - Modifica ADMIN_PASSWORD
   =========================================== */

export const metadata: Metadata = {
  title: "A'MASCAR LECHONERIA | Lechonas Auténticas en Bogotá",
  description: "Las mejores lechonas asadas de Bogotá. Lechona a domicilio, bebidas y salsas artesanales. Pedidos por WhatsApp. Sabor tradicional colombiano.",
  keywords: "lechonas Bogotá, lechona asada, lechona a domicilio, lechonería colombiana, comida típica colombiana",
  openGraph: {
    title: "A'MASCAR LECHONERIA",
    description: "Lechonas auténticas y frescas. El sabor tradicional de Colombia en tu mesa.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: '/icono.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icono.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/icono.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--card-foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
