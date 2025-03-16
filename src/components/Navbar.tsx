
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import AuthModal from './AuthModal';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Dashboard',
    path: '/dashboard'
  },
  {
    name: 'Transfer',
    path: '/transfer'
  }
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setActiveTab('login');
    setShowAuthModal(true);
    closeMobileMenu();
  };

  const handleSignup = () => {
    setActiveTab('signup');
    setShowAuthModal(true);
    closeMobileMenu();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    closeMobileMenu();
  };

  // Mock login function (would normally come from auth provider)
  const mockSuccessfulLogin = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
          isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="z-50">
            <AnimatedLogo className="transition-all hover:scale-105" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors",
                  location.pathname === item.path && "text-gray-900 dark:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            {isLoggedIn ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white transition-all"
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline"
                  className="border-youtube text-youtube hover:bg-youtube/10"
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden z-50 text-gray-700 dark:text-gray-300"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className="animate-fade-in" />
            ) : (
              <Menu size={24} className="animate-fade-in" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white dark:bg-gray-900 transform transition-transform duration-300 md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-24 px-8 pb-8">
          <nav className="flex flex-col space-y-6 items-center text-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-xl font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-all duration-200",
                  location.pathname === item.path && "text-gray-900 dark:text-white"
                )}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto flex flex-col space-y-4">
            {isLoggedIn ? (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white transition-all"
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-youtube text-youtube hover:bg-youtube/10"
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={mockSuccessfulLogin}
        initialTab={activeTab}
      />
    </>
  );
};

export default Navbar;
