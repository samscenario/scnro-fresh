const Footer = () => {
  return (
    <footer className="bg-card border-t-2 border-electric-blue/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & About */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-black font-russo text-white mb-4">
              SCNRO
            </h3>
            <p className="text-muted-foreground mb-4">
              The culture festival for the future now. Building tomorrow's creative community today.
            </p>
            <div className="text-sm text-muted-foreground">
              <a href="#" className="hover:text-electric-blue transition-colors">
                Powered by Scenario Arts ↗
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">ABOUT SCNRO</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-electric-blue transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-hot-pink transition-colors">The Team</a></li>
              <li><a href="#" className="hover:text-cyber-purple transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-acid-green transition-colors">Partner With Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">CONNECT</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-electric-blue transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-hot-pink transition-colors">Press Inquiries</a></li>
              <li><a href="#" className="hover:text-cyber-purple transition-colors">Booking</a></li>
              <li><a href="#" className="hover:text-acid-green transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
              {[
                { name: "Instagram", icon: "📷", color: "hover:text-hot-pink" },
                { name: "TikTok", icon: "🎵", color: "hover:text-electric-blue" },
                { name: "YouTube", icon: "📺", color: "hover:text-warning-red" },
                { name: "Threads", icon: "🧵", color: "hover:text-cyber-purple" }
              ].map((social) => (
                <a 
                  key={social.name}
                  href="#" 
                  className={`flex items-center gap-2 text-muted-foreground ${social.color} transition-all duration-300 hover:scale-110`}
                >
                  <span className="text-xl">{social.icon}</span>
                  <span className="hidden sm:inline font-semibold">{social.name}</span>
                </a>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground">
              © 2024 SCNRO. Building future culture.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;