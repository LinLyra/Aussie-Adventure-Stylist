import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aussie Adventure Stylist",
  description: "Mock demo: outfit color and packing suggestions inspired by Australian landscapes."
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
