import { Github, Linkedin, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-14 border-t border-border bg-card/40 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid md:grid-cols-2 gap-10 items-center mb-10">
          
          {/* Left Section */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-bold gradient-text">Steven Ortega</h3>

            <p className="text-muted-foreground leading-relaxed max-w-md text-pretty mx-auto md:mx-0">
              A Frontend Focused Web Developer crafting immersive Web Applications and modern UI experiences that elevate digital products.
            </p>
          </div>

          {/* Social Icons Section */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-xl font-bold gradient-text mb-5">Social</h3>

            <div className="flex gap-5">
              <a
                href="https://www.linkedin.com/in/steven-ortega-046874339/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  p-3 rounded-xl bg-primary/10 hover:bg-primary/20 
                  transition-all duration-300 hover:scale-110 
                  hover:shadow-[0_0_15px_rgba(139,92,246,0.6)]
                "
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6 text-neon-purple" />
              </a>

              <a
                href="https://wa.me/573187993643"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  p-3 rounded-xl bg-primary/10 hover:bg-primary/20 
                  transition-all duration-300 hover:scale-110 
                  hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]
                "
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-6 w-6 text-neon-cyan" />
              </a>

              <a
                href="https://github.com/St-Alejo"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  p-3 rounded-xl bg-primary/10 hover:bg-primary/20 
                  transition-all duration-300 hover:scale-110 
                  hover:shadow-[0_0_15px_rgba(0,255,200,0.6)]
                "
                aria-label="GitHub"
              >
                <Github className="h-6 w-6 text-white/90" />
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="text-center pt-6 border-t border-border/60">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} — Steven Ortega. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
