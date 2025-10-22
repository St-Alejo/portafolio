"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    name: "Person 1",
    role: "CEO, Tech Company",
    content:
      "Aliquam ac dui vel dui vulputate consectetur. Mauris massa. Vestibulum non nulla. Aliquam ac dui vel dui vulputate consectetur. Mauris massa. In placerat diam a fringilla pulvinar. In sed mauris ac eget sem.",
    image: "/professional-person-1.png",
  },
  {
    id: 2,
    name: "Person 2",
    role: "CTO, Startup Inc",
    content:
      "Aliquam ac dui vel dui vulputate consectetur. Mauris massa. Vestibulum non nulla. Aliquam ac dui vel dui vulputate consectetur. Mauris massa. In placerat diam a fringilla pulvinar. In sed mauris ac eget sem.",
    image: "/professional-person-2.png",
  },
  {
    id: 3,
    name: "Person 3",
    role: "Product Manager, Enterprise",
    content:
      "Aliquam ac dui vel dui vulputate consectetur. Mauris massa. Vestibulum non nulla. Aliquam ac dui vel dui vulputate consectetur. Mauris massa. In placerat diam a fringilla pulvinar. In sed mauris ac eget sem.",
    image: "/professional-person-3.png",
  },
]

export function TestimonialsSection() {
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
    <section id="testimonials" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-neon-cyan">TESTIM</span>
            <span className="text-neon-purple">ONIES</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Here you will find testimonials from clients and collaborators, each one sharing their own experience of
            working with me and the impact of the projects we created together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="animate-on-scroll gradient-purple-blue p-[2px] hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-card rounded-lg p-6 h-full">
                <CardContent className="p-0 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold gradient-text">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{testimonial.content}</p>
                  <div className="flex justify-center pt-4">
                    <Avatar className="h-20 w-20 border-2 border-primary neon-glow-purple">
                      <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
