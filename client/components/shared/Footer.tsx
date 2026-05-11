'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux"; // Import Redux hook
import { 
  Home, Phone, Mail, MapPin, Shield, Award, Clock, Lock, UserPlus 
} from "lucide-react";
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube 
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  
  // Get Auth State from Redux
  const { token, user } = useSelector((state: any) => state.auth);
  
  // Dialog State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", target: "" });

  const handleOwnerAccess = (e: React.MouseEvent, targetPath: string) => {
    e.preventDefault();

    // 1. Check if logged in
    if (!token) {
      setModalConfig({
        title: "Login Required",
        message: "Please log in as a Property Owner to access this feature.",
        target: "/owner/auth"
      });
      setShowAuthModal(true);
      return;
    }

    // 2. Check if the role is 'owner'
    if (user?.role !== 'owner') {
      setModalConfig({
        title: "Access Denied",
        message: "This area is reserved for Property Owners. Would you like to switch to an Owner account?",
        target: "/owner/auth"
      });
      setShowAuthModal(true);
      return;
    }

    // 3. If everything is correct, navigate
    router.push(targetPath);
  };

  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4 text-center sm:text-left">
            <Link href="/" className="inline-block group">
              <h2 className="text-2xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 inline-block">
                GayaRent
              </h2>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto sm:mx-0">
              India's most trusted rental platform. Find your dream home or list your property with ease.
            </p>
            <div className="flex justify-center sm:justify-start space-x-3 pt-2">
              <SocialLink href="#" icon={<FaFacebook size={16} />} />
              <SocialLink href="#" icon={<FaTwitter size={16} />} />
              <SocialLink href="#" icon={<FaInstagram size={16} />} />
              <SocialLink href="#" icon={<FaLinkedin size={16} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/properties">Browse Properties</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/blog">Blog & Insights</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>

          {/* For Partners - PROTECTED LINKS */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-foreground">For Partners</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={(e) => handleOwnerAccess(e, "/owner/dashboard?action=add")}
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 cursor-pointer"
                >
                  List Your Property
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => handleOwnerAccess(e, "/owner/dashboard")}
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 cursor-pointer"
                >
                  Owner Dashboard
                </button>
              </li>
              <FooterLink href="/pricing">Pricing Plans</FooterLink>
              <FooterLink href="/success-stories">Success Stories</FooterLink>
              <FooterLink href="/resources">Resources & Guides</FooterLink>
            </ul>
          </div>

          {/* Contact & Info */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-foreground">Get in Touch</h3>
            <ul className="space-y-4 sm:space-y-3">
              <ContactItem icon={<MapPin size={16} />} text="123 Business Hub, Andheri East, Mumbai" />
              <ContactItem icon={<Phone size={16} />} text="+91 77177 42739" />
              <ContactItem icon={<Mail size={16} />} text="support@gayarent.com" />
            </ul>
          </div>
        </div>

        {/* Trust Badges - Optimized for Mobile Grid */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <TrustBadge icon={<Shield />} text="100% Verified" />
            <TrustBadge icon={<Award />} text="10k+ Happy Tenants" />
            <TrustBadge icon={<Home />} text="500+ Partners" />
            <TrustBadge icon={<Phone />} text="24/7 Support" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-xs text-muted-foreground italic">
              © {currentYear} GayaRent. Designed for seamless rentals.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOM AUTH DIALOG */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="text-primary" size={24} />
            </div>
            <DialogTitle className="text-center text-xl">{modalConfig.title}</DialogTitle>
            <DialogDescription className="text-center pt-2">
              {modalConfig.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAuthModal(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setShowAuthModal(false);
                router.push(modalConfig.target);
              }}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <UserPlus size={18} />
              Continue to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

// --- Helper Components for Clean Code & Responsiveness ---

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a href={href} className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
        {children}
      </Link>
    </li>
  );
}

function ContactItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center justify-center sm:justify-start gap-3 group">
      <span className="text-primary shrink-0">{icon}</span>
      <span className="text-sm text-muted-foreground">{text}</span>
    </li>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center justify-center gap-3 p-2 group">
      <span className="text-primary transition-transform group-hover:scale-110">{icon}</span>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{text}</span>
    </div>
  );
}