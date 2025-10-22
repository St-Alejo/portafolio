import { Github, Linkedin, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Left side - Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold gradient-text">footer</h3>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              A Frontend Focused Web Developer building the Frontend of Websites and Web Applications that leads to the
              success of the overall product
            </p>
          </div>

          {/* Right side - Social links */}
          <div className="flex flex-col items-start md:items-end justify-center">
            <h3 className="text-xl font-bold gradient-text mb-4">Social</h3>
            <div className="flex gap-4">
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 hover:neon-glow-purple transition-all duration-300"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 hover:neon-glow-blue transition-all duration-300"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 hover:neon-glow-cyan transition-all duration-300"
              >
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">© Copyright 2025</p>
        </div>
      </div>
    </footer>
  )
}
