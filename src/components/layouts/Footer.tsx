import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">
              IIITG Sports <span className="carnival-gradient-text">Carnival</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Building a vibrant sports culture at IIIT Guwahati. Organised by Sports Board.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-secondary">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about-us" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          © 2026 IIITG Sports <span className="carnival-gradient-text">Carnival</span>. Organised by Sports Board.
        </div>
      </div>

      {/* Developer Credits Section */}
      <div className="bg-[#1a1f2e] border-t border-border/30">
        <div className="container py-8">
          <div className="text-center space-y-4">
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px bg-border/30 flex-1 max-w-xs" />
              <div className="h-px bg-border/30 flex-1 max-w-xs" />
            </div>

            {/* Developer Credits */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground/70">Website Developed By</p>
              <p className="text-base font-semibold text-foreground/90">
                Pratham Gupta &amp; Vedaant Mishra
              </p>
            </div>

            {/* Contact Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/70">
                <Mail className="h-4 w-4" />
                <span>Contact Us:</span>
              </div>
              <div className="flex flex-col xl:flex-row items-center justify-center gap-2 xl:gap-3 text-sm">
                <a
                  href="mailto:pratham.gupta25b@iiitg.ac.in"
                  className="text-primary hover:text-primary/80 hover:underline transition-all"
                >
                  pratham.gupta25b@iiitg.ac.in
                </a>
                <span className="hidden xl:inline text-muted-foreground/50">|</span>
                <a
                  href="mailto:vedaant.mishra25b@iiitg.ac.in"
                  className="text-primary hover:text-primary/80 hover:underline transition-all"
                >
                  vedaant.mishra25b@iiitg.ac.in
                </a>
              </div>
            </div>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px bg-border/30 flex-1 max-w-xs" />
              <div className="h-px bg-border/30 flex-1 max-w-xs" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
