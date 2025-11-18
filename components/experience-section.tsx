"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const experiences = [
  {
    id: 1,
    role: "Freelance Developer",
    duration: "2023 — Present",
    description: "Creation of web and mobile applications for national and international clients.",
  },
  {
    id: 2,
    role: "University CodeMentor",
    duration: "2023 — Present",
    description: "Creation of web and mobile applications for national and international clients.",
  },
  {
    id: 3,
    role: "Research Assistant — University X",
    duration: "2022 — 2023",
    description: "Collaboration on artificial intelligence projects applied to process optimization.",
  },
]

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in", "fade-in", "slide-in-from-left-4")
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
    <section id="experience" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-neon-blue">EXPERI</span>
            <span className="text-neon-cyan">ENCE</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Here you will find a summary of my professional experience, highlighting the roles, skills, and projects
            that have shaped my journey as a creator and developer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <Card
              key={exp.id}
              className="animate-on-scroll gradient-purple-blue p-0.5 hover:scale-102 hover:neon-glow-blue transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-card rounded-lg p-6">
                <CardHeader className="p-0 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-xl gradient-text">{exp.role}</CardTitle>
                    <CardDescription className="text-sm font-mono">{exp.duration}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
