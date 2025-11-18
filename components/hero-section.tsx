"use client"

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


  const buttonBase =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 px-6 py-3 text-lg"

  const buttonOutline =
    `${buttonBase} border border-border bg-transparent hover:scale-105`

  const buttonGradient =
    `${buttonBase} gradient-purple-blue text-white hover:scale-105`

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

          {/* LEFT SIDE */}
          <div className="space-y-8 animate-on-scroll">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance">
                Hi, I'm <span className="gradient-text">Steven Ortega</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground text-pretty">
                Full Stack Developer passionate about Artificial Intelligence and technology
              </p>
            </div>

            <div className="flex flex-wrap gap-4">

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/steven-ortega-046874339/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonOutline} neon-glow-purple`}
              >
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/St-Alejo"
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonOutline} neon-glow-blue`}
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/573187993643"
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonOutline} neon-glow-cyan`}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </a>
            </div>

            <div className="flex flex-wrap gap-4">

              {/* Game Mode */}
              <Link href="/game" className={`${buttonGradient} neon-glow-cyan animate-pulse`}>
                <Gamepad2 className="mr-2 h-5 w-5" />
                Game Mode
              </Link>

              {/* View Projects */}
              <a href="#projects" className={`${buttonGradient} neon-glow-purple`}>
                <Briefcase className="mr-2 h-5 w-5" />
                View Projects
              </a>

              {/* CV Download */}
              <a
                href=""
                download
                className={`${buttonOutline} hover:scale-105`}
              >
                <FileText className="mr-2 h-5 w-5" />
                Download CV
              </a>
            </div>
          </div>

          {/* RIGHT SIDE - IMAGE */}
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
