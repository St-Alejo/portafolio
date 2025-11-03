"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in", "fade-in", "zoom-in-50")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formDataToSend = new FormData()
    formDataToSend.append("access_key", "5bb6b96d-0ba8-46f8-9101-d7ff0f552d3c")
    formDataToSend.append("name", formData.name)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("message", formData.message)
    formDataToSend.append("subject", "Nuevo mensaje desde tu portafolio")
    formDataToSend.append("from_name", formData.name)
    formDataToSend.append("redirect", "https://web3forms.com/success")

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend
      })

      const data = await response.json()

      if (data.success) {
        setSubmitMessage("¡Mensaje enviado exitosamente!")
        setFormData({ name: "", email: "", message: "" })
      } else {
        setSubmitMessage("Error al enviar el mensaje. Intenta nuevamente.")
      }
    } catch (error) {
      setSubmitMessage("Error al enviar el mensaje. Intenta nuevamente.")
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-neon-purple">CONT</span>
            <span className="text-neon-cyan">ACT</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Feel free to Contact me by submitting the form below and I will get back to you as soon as possible
          </p>
        </div>

        <Card className="max-w-2xl mx-auto animate-on-scroll gradient-purple-blue p-0.5">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background/50 backdrop-blur-sm focus:neon-glow-purple transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background/50 backdrop-blur-sm focus:neon-glow-purple transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-background/50 backdrop-blur-sm min-h-[150px] focus:neon-glow-purple transition-all duration-300"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-purple-blue text-white hover:scale-105 transition-all duration-300 neon-glow-purple"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              {submitMessage && (
                <p className={`text-center ${submitMessage.includes("exitosamente") ? "text-green-500" : "text-red-500"}`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </Card>
      </div>
    </section>
  )
}
