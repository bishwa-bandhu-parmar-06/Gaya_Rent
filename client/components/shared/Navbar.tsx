"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Home, Smartphone, User, PlusCircle, LayoutDashboard, 
  ShieldAlert, AlertTriangle, LogOut, Menu, ChevronRight,
  Info, MessageSquare, Building
} from "lucide-react"; 
import { ThemeToggle } from "./ThemeToggle";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { logout } from "@/lib/store/authSlice";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Sheet, SheetContent, SheetTrigger, SheetHeader, 
  SheetTitle, SheetDescription 
} from "@/components/ui/sheet";
import { AddPropertyForm } from "@/components/features/owner/AddPropertyForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Used to highlight the active tab
  const dispatch = useDispatch();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);

  const getDashboardRoute = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "owner") return "/owner/dashboard";
    return "/tenant/dashboard";
  };

  const handlePostPropertyClick = () => {
    setIsMobileMenuOpen(false);
    if (!isAuthenticated || !token) {
      router.push("/owner/auth");
    } else if (user?.role !== "owner") {
      setIsAlertOpen(true);
    } else {
      setIsFormOpen(true);
    }
  };

  const confirmLogout = () => {
    dispatch(logout());
    setIsLogoutAlertOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Helper to check if a link is active
  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 h-16 flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          
          {/* 1. Logo (Left) */}
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2 shrink-0">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Home size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary hidden sm:block">
              gayarent<span className="text-muted-foreground">.com</span>
            </span>
          </Link>

          {/* 2. Main Navigation (Center - Desktop Only) */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <NavLink href="/" label="Home" active={isActive("/")} />
            <NavLink href="/properties" label="Properties" active={isActive("/properties")} />
            <NavLink href="/about" label="About Us" active={isActive("/about")} />
            <NavLink href="/contact" label="Contact" active={isActive("/contact")} />
          </div>

          {/* 3. Actions (Right - Desktop) */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink-0">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary" asChild>
  <Link href="/app">
    <Smartphone size={16} /> App
  </Link>
</Button>
            
            <Button size="sm" className="gap-2 font-semibold shadow-md hover:shadow-lg transition-all" onClick={handlePostPropertyClick}>
              <PlusCircle size={16} /> Post Property
            </Button>

            <div className="h-6 w-px bg-border mx-1" /> 

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href={getDashboardRoute()}>
                  <Button variant="outline" size="sm" className="gap-2 bg-secondary/50 hover:bg-secondary border-primary/20 hover:border-primary/50 transition-all">
                    <LayoutDashboard size={16} className="text-primary" />
                    <span className="font-semibold">{user?.name?.split(" ")[0]}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsLogoutAlertOpen(true)} className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Link href="/selection">
                <Button variant="outline" size="sm" className="gap-2 font-semibold border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <User size={16} className="text-primary" /> Sign In
                </Button>
              </Link>
            )}
            
            <ThemeToggle />
          </div>

          {/* 4. Mobile Toggle (Right - Mobile Only) */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 border bg-secondary/20">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-87.5 p-0 flex flex-col border-l">
                <SheetHeader className="p-6 border-b bg-secondary/10 text-left">
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <SheetDescription className="sr-only">Navigation menu for mobile devices</SheetDescription>
                  
                  {isAuthenticated ? (
                    <div className="flex items-center gap-4 text-left">
                      <Avatar className="h-12 w-12 border-2 border-primary">
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                          {user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg leading-tight">{user?.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{user?.role} Account</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-xl">Welcome to GayaRent</span>
                      <p className="text-xs text-muted-foreground">Find or List properties easily.</p>
                    </div>
                  )}
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="px-4 mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">Navigation</p>
                    <div className="space-y-1">
                      <MobileNavLink href="/" icon={<Home size={18} />} label="Home" onClick={closeMenu} />
                      <MobileNavLink href="/properties" icon={<Building size={18} />} label="Browse Properties" onClick={closeMenu} />
                      <MobileNavLink href="/app" icon={<Smartphone size={18} />} label="Get the App" onClick={closeMenu} />
                    </div>
                  </div>

                  <div className="px-4 mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">Partner Zone</p>
                    <div className="space-y-1">
                      <button onClick={handlePostPropertyClick} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors text-sm font-medium group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors"><PlusCircle size={18} /></div>
                          <span>Post Your Property</span>
                        </div>
                        <ChevronRight size={14} className="text-muted-foreground" />
                      </button>
                      {isAuthenticated && (
                        <MobileNavLink href={getDashboardRoute()} icon={<LayoutDashboard size={18} />} label="My Dashboard" onClick={closeMenu} />
                      )}
                    </div>
                  </div>

                  <div className="px-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">Information</p>
                    <div className="space-y-1">
                      <MobileNavLink href="/about" icon={<Info size={18} />} label="About Us" onClick={closeMenu} />
                      <MobileNavLink href="/contact" icon={<MessageSquare size={18} />} label="Contact Support" onClick={closeMenu} />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t bg-secondary/5">
                  {!isAuthenticated ? (
                    <Button className="w-full h-12 rounded-xl font-bold gap-2" onClick={() => { router.push("/selection"); closeMenu(); }}>
                      <User size={18} /> Sign In / Register
                    </Button>
                  ) : (
                    <Button variant="destructive" className="w-full h-12 rounded-xl font-bold gap-2" onClick={() => { closeMenu(); setIsLogoutAlertOpen(true); }}>
                      <LogOut size={18} /> Log Out
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* --- MODALS --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Add New Property</DialogTitle>
            <DialogDescription>Use this form to list your property on GayaRent.</DialogDescription>
          </DialogHeader>
          <AddPropertyForm onSuccess={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent className="w-[90%] sm:max-w-md text-center rounded-2xl">
          <DialogHeader className="flex flex-col items-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <DialogTitle className="text-xl">Partner Access Only</DialogTitle>
            <DialogDescription className="pt-2 text-base">
              Only registered Property Partners can post listings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button onClick={() => setIsAlertOpen(false)} className="w-full sm:w-auto px-8 rounded-xl">Understood</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLogoutAlertOpen} onOpenChange={setIsLogoutAlertOpen}>
        <DialogContent className="w-[90%] sm:max-w-md rounded-2xl">
          <DialogHeader className="flex flex-col items-center pt-4">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4"><LogOut size={28} /></div>
            <DialogTitle className="text-xl">Are you sure?</DialogTitle>
            <DialogDescription className="text-center">You will need to sign in again to manage your listings.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 p-4 pt-2">
            <Button variant="outline" onClick={() => setIsLogoutAlertOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={confirmLogout} className="flex-1 rounded-xl font-bold">Yes, Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Sub-component for Desktop Nav Links with Active State
function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`text-sm font-semibold transition-all relative py-2 ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {/* Animated underline for active state */}
      {active && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-md animate-in slide-in-from-bottom-1" />
      )}
    </Link>
  );
}

// Sub-component for Mobile Menu Links
function MobileNavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors text-sm font-medium group">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">{icon}</div>
        <span>{label}</span>
      </div>
      <ChevronRight size={14} className="text-muted-foreground" />
    </Link>
  );
}