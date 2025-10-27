"use client"

import { Button } from "@/components/ui/button"
import { Github, Linkedin, MessageCircle, FileText, Briefcase, Gamepad2 } from "lucide-react"
import { useEffect, useRef } from "react"
import Link from "next/link"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in", "fade-in", "slide-in-from-bottom-4")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-purple-blue opacity-20 blur-3xl animate-pulse" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8 animate-on-scroll">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance">
                Hi, I'm <span className="gradient-text">Steven Ortega</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground text-pretty">
                Full Stack Developer passionate about Artificial Intelligence and technology
              </p>
            </div>

            {/* Social buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                size="lg"
                className="neon-glow-purple hover:scale-105 transition-all duration-300 bg-transparent"
                asChild
              >
                <a href="" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-5 w-5" />
                  LinkedIn
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="neon-glow-blue hover:scale-105 transition-all duration-300 bg-transparent"
                asChild
              >
                <a href="" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="neon-glow-cyan hover:scale-105 transition-all duration-300 bg-transparent"
                asChild
              >
                <a href="" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </a>
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/game">
                <Button
                  size="lg"
                  className="gradient-purple-blue text-white hover:scale-105 transition-all duration-300 neon-glow-cyan animate-pulse"
                >
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Game Mode
                </Button>
              </Link>

              <Button
                size="lg"
                className="gradient-purple-blue text-white hover:scale-105 transition-all duration-300 neon-glow-purple"
                asChild
              >
                <a href="#projects">
                  <Briefcase className="mr-2 h-5 w-5" />
                  View Projects
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-all duration-300 bg-transparent"
                asChild
              >
                <a href="" download>
                  <FileText className="mr-2 h-5 w-5" />
                  Download CV
                </a>
              </Button>
            </div>
          </div>

          {/* Right side - Profile image placeholder */}
          <div className="animate-on-scroll flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 gradient-purple-blue rounded-full blur-3xl opacity-30 animate-pulse" />
              <img
                src="R.jpeg"
                alt="Steven Ortega"
                className="relative z-10 w-full h-full object-cover rounded-2xl neon-glow-purple"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
