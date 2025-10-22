"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Pharmazync",
    description: "A comprehensive pharmacy management system with inventory tracking and prescription management.",
    image: "/pharmacy-management-dashboard.jpg",
    link: "",
  },
  {
    id: 2,
    title: "Clock App",
    description: "Modern clock application with world time zones, alarms, and stopwatch functionality.",
    image: "/modern-digital-clock-interface.jpg",
    link: "",
  },
  {
    id: 3,
    title: "Centers Platform",
    description: "Educational centers management platform for course scheduling and student enrollment.",
    image: "/education-platform-dashboard.png",
    link: "",
  },
]

const certificates = [
  {
    id: 1,
    title: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    image: "/aws-certificate.jpg",
  },
  {
    id: 2,
    title: "React Advanced Certification",
    issuer: "Meta",
    image: "/react-certificate.jpg",
  },
  {
    id: 3,
    title: "Full Stack Development",
    issuer: "Coursera",
    image: "/full-stack-certificate.jpg",
  },
  {
    id: 4,
    title: "Machine Learning Specialization",
    issuer: "Stanford University",
    image: "/machine-learning-certificate.jpg",
  },
  {
    id: 5,
    title: "Cloud Architecture",
    issuer: "Google Cloud",
    image: "/cloud-architecture-certificate.jpg",
  },
  {
    id: 6,
    title: "Cybersecurity Fundamentals",
    issuer: "IBM",
    image: "/cybersecurity-certificate.jpg",
  },
]

export function ProjectsSection() {
  const [activeTab, setActiveTab] = useState("projects")
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
  }, [activeTab])

  return (
    <section id="projects" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-neon-purple">PROJ</span>
            <span className="text-neon-blue">ECTS</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Here you will find some of the personal and clients projects that I created with each project containing its
            own case study
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 neon-glow-purple">
            <TabsTrigger value="projects" className="text-base">
              PROJECTS
            </TabsTrigger>
            <TabsTrigger value="certificates" className="text-base">
              CERTIFICATES
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card
                  key={project.id}
                  className="animate-on-scroll overflow-hidden hover:scale-105 hover:neon-glow-purple transition-all duration-300 bg-card/50 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="gradient-text">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full hover:neon-glow-blue transition-all duration-300 bg-transparent"
                      asChild
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View More <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificates" id="certificates" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((cert, index) => (
                <Card
                  key={cert.id}
                  className="animate-on-scroll overflow-hidden hover:scale-105 hover:neon-glow-cyan transition-all duration-300 bg-card/50 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cert.image || "/placeholder.svg"}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="gradient-text text-lg">{cert.title}</CardTitle>
                    <CardDescription>{cert.issuer}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
