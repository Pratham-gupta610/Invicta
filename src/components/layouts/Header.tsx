import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, User, LogOut, Shield, ArrowLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { HomeIcon, MyEventsIcon } from '@/components/icons/NavigationIcons';
import { useState } from 'react';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Detect if we're on a sport detail page, registration page, or dashboard page
  const isOnSportDetailPage = location.pathname.startsWith('/sports/');
  const isOnRegistrationPage = location.pathname.startsWith('/register/');
  const isOnAdminDashboard = location.pathname === '/admin';
  const isOnUserDashboard = location.pathname === '/dashboard';
  const showBackArrow = isOnSportDetailPage || isOnRegistrationPage || isOnAdminDashboard || isOnUserDashboard;

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'My Events', href: '/dashboard', requireAuth: true, icon: MyEventsIcon },
  ];

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full glass-header h-16" role="banner">
      <div className="container flex h-16 items-center justify-between px-6 relative">
        {/* Back Arrow - Absolute positioned to the LEFT of SC logo */}
        {showBackArrow && (
          <button
            onClick={() => {
              // For sport detail pages, go to home; for other pages (registration, dashboards), go back in history
              if (isOnSportDetailPage) {
                navigate('/');
              } else {
                navigate(-1);
              }
            }}
            className="header-back-arrow"
            aria-label={isOnSportDetailPage ? "Back to home" : "Go back"}
          >
            <ArrowLeft className="w-7 h-7 xl:w-8 xl:h-8" aria-hidden="true" />
          </button>
        )}
        
        {/* Logo - Shifted right when back arrow is visible */}
        <Link 
          to="/" 
          className={`flex items-center gap-3 transition-all duration-300 ${
            showBackArrow 
              ? 'ml-[60px] xl:ml-[90px]' 
              : ''
          }`} 
          aria-label="IIIT Guwahati Sports Board Carnival Home"
        >
          <img 
            src="https://miaoda-conversation-file.s3cdn.medo.dev/user-8uulh0d0bh8g/conv-8uulibpxqebk/20260114/file-8xez7jrwlm9s.jpg" 
            alt="IIIT Guwahati Sports Board Logo" 
            className="logo-image"
          />
          <div className="flex flex-col">
            <span className="font-bold text-base text-foreground">IIIT GUWAHATI SPORTS BOARD</span>
            <span className="text-xs text-muted-foreground">
              <span className="carnival-gradient-text font-semibold">Carnival</span> '26
            </span>
          </div>
        </Link>
        
        {/* Navigation - Desktop Only: Center aligned */}
        <nav className="hidden xl:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2" role="navigation" aria-label="Main navigation">
          {navigation.map((item) => {
            if (item.requireAuth && !user) return null;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link flex items-center gap-2 group"
                aria-label={item.name}
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons - Right */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Desktop: Horizontal layout */}
              <div className="hidden xl:flex items-center gap-3">
                {profile?.role === 'admin' && (
                  <Link to="/admin">
                    <button className="btn-secondary flex items-center gap-2" aria-label="Admin Dashboard">
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      Admin
                    </button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <button className="btn-secondary flex items-center gap-2" aria-label={`User profile: ${profile?.username}`}>
                    <User className="h-4 w-4" aria-hidden="true" />
                    {profile?.username}
                  </button>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="nav-link p-2"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              
              {/* Mobile: Hamburger menu with 48px touch target */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="xl:hidden">
                  <Button variant="ghost" size="icon" className="touch-target text-primary" aria-label="Open menu">
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="glass-header" aria-label="Mobile navigation menu">
                  <nav className="flex flex-col gap-2 mt-8" role="navigation">
                    <div className="text-sm text-muted-foreground mb-4 px-6">
                      Welcome, <span className="font-medium text-foreground">{profile?.full_name || profile?.username}</span>
                    </div>
                    {navigation.map((item) => {
                      if (item.requireAuth && !user) return null;
                      const Icon = item.icon;
                      return (
                        <Link key={item.name} to={item.href} className="nav-link border-l-4 border-transparent hover:border-primary flex items-center gap-3" aria-label={item.name} onClick={closeMobileMenu}>
                          <Icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      );
                    })}
                    {profile?.role === 'admin' && (
                      <Link to="/admin" className="nav-link border-l-4 border-transparent hover:border-primary" aria-label="Admin Dashboard" onClick={closeMobileMenu}>
                        <Shield className="h-5 w-5 mr-3 inline" aria-hidden="true" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleSignOut} className="nav-link border-l-4 border-transparent hover:border-primary text-left" aria-label="Logout">
                      <LogOut className="h-5 w-5 mr-3 inline" aria-hidden="true" />
                      Logout
                    </button>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              {/* Desktop: Login + Sign Up buttons */}
              <div className="hidden xl:flex items-center gap-3">
                <Link to="/login">
                  <button className="btn-secondary" aria-label="Login to your account">
                    Login
                  </button>
                </Link>
                <Link to="/login">
                  <button className="btn-primary" aria-label="Sign up for an account">
                    Sign Up
                  </button>
                </Link>
              </div>
              
              {/* Mobile: Hamburger menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="xl:hidden">
                  <Button variant="ghost" size="icon" className="touch-target text-primary" aria-label="Open menu">
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="glass-header" aria-label="Mobile navigation menu">
                  <nav className="flex flex-col gap-2 mt-8" role="navigation">
                    {navigation.map((item) => {
                      if (item.requireAuth && !user) return null;
                      const Icon = item.icon;
                      return (
                        <Link key={item.name} to={item.href} className="nav-link border-l-4 border-transparent hover:border-primary flex items-center gap-3" aria-label={item.name} onClick={closeMobileMenu}>
                          <Icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      );
                    })}
                    <div className="mt-6 px-6 flex flex-col gap-3">
                      <Link to="/login" onClick={closeMobileMenu}>
                        <button className="btn-secondary w-full" aria-label="Login to your account">Login</button>
                      </Link>
                      <Link to="/login" onClick={closeMobileMenu}>
                        <button className="btn-primary w-full" aria-label="Sign up for an account">Sign Up</button>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
