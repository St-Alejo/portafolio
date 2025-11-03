"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, Gamepad2 } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import Link from "next/link"

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About Me", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  if (!mounted) return null

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="text-xl font-bold gradient-text">
            STEVEN ORTEGA
          </a>

          {/* Desktop Navigation - Oculto hasta pantallas grandes (lg) */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-neon-purple transition-colors duration-200"
              >
                {link.name.toUpperCase()}
              </a>
            ))}
          </div>

          {/* Theme Toggle and Game Mode Button */}
          <div className="flex items-center gap-4">
            <Link href="/game">
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex items-center gap-2 neon-border hover:neon-glow-purple transition-all duration-300 bg-transparent"
              >
                <Gamepad2 className="h-4 w-4" />
                GAME MODE
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:neon-glow-purple transition-all duration-300"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu Button - Visible hasta pantallas grandes */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay con fondo sólido y blur */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 top-16 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Fondo con blur mejorado */}
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
          
          {/* Contenido del menú */}
          <div className="relative h-full overflow-y-auto">
            <div className="container mx-auto px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block py-3 px-4 rounded-lg text-base font-medium text-foreground hover:text-neon-purple hover:bg-primary/10 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name.toUpperCase()}
                </a>
              ))}
              
              {/* Game Mode Link in Mobile Menu */}
              <Link href="/game" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 py-3 px-4 rounded-lg text-base font-medium text-neon-purple hover:text-neon-blue hover:bg-primary/10 transition-all duration-200">
                  <Gamepad2 className="h-5 w-5" />
                  GAME MODE
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
