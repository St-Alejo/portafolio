"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

const skills = [
  { name: "HTML", icon: "🌐" },
  { name: "CSS", icon: "🎨" },
  { name: "JavaScript", icon: "⚡" },
  { name: "React", icon: "⚛️" },
  { name: "Node.js", icon: "🟢" },
  { name: "TypeScript", icon: "📘" },
  { name: "Python", icon: "🐍" },
  { name: "Spring Boot", icon: "🍃" },
  { name: "MongoDB", icon: "🍃" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Docker", icon: "🐳" },
  { name: "Git", icon: "📦" },
]

export function AboutSection() {
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
    <section id="about" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-neon-blue">ABOUT</span> <span className="text-neon-purple">ME</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Here you will find more information about me, what I do, and my current skills mostly in terms of
            programming and technology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - About text */}
          <div className="space-y-6 animate-on-scroll">
            <h3 className="text-2xl font-bold gradient-text">Get to know me!</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm a <strong className="text-foreground">Frontend Focused Web Developer</strong> building and managing
                the Front-end of Websites and Web Applications that leads to the success of the overall product. Check
                out some of my work in the Projects section.
              </p>
              <p>
                I also like sharing content related to the stuff that I have learned over the years in{" "}
                <strong className="text-foreground">Web Development</strong> so it can help other people of the Dev
                Community. Feel free to Connect or Follow me on my Linkedin where I post useful content related to Web
                Development and Programming.
              </p>
              <p>
                I'm open to <strong className="text-foreground">Job</strong> opportunities where I can contribute, learn
                and grow. If you have a good opportunity that matches my skills and experience then don't hesitate to{" "}
                <strong className="text-foreground">contact</strong> me.
              </p>
            </div>
          </div>

          {/* Right side - Skills grid */}
          <div className="animate-on-scroll">
            <h3 className="text-2xl font-bold gradient-text mb-6">My Skills</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <Card
                  key={skill.name}
                  className="p-4 text-center hover:scale-105 hover:neon-glow-purple transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-4xl mb-2">{skill.icon}</div>
                  <p className="font-medium text-sm">{skill.name}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
