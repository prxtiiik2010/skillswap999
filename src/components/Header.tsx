import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const openLoginModal = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const openSignupModal = () => {
    setAuthModalTab("signup");
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      // If not authenticated, open login modal
      setAuthModalTab("login");
      setIsAuthModalOpen(true);
    }
    setIsMenuOpen(false);
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      // Scroll to section on same page
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.startsWith("/")) {
      // Navigate to different page
      navigate(href);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SkillSwap
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavClick("/")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick("/search")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Find Tutors
            </button>
            <button 
              onClick={() => handleNavClick("#teach")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Teach
            </button>
            <button 
              onClick={handleProfileClick}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              My Profile
            </button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.name}
                </span>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  <User className="h-4 w-4 mr-2" />
                  My Dashboard
                </Button>
                <Button variant="outline" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={openLoginModal}>Login</Button>
                <Button variant="gradient" onClick={openSignupModal}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="flex flex-col space-y-4 px-4 py-4">
              <button 
                onClick={() => handleNavClick("/")}
                className="text-foreground hover:text-primary transition-colors font-medium text-left"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick("/search")}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Find Tutors
              </button>
              <button 
                onClick={() => handleNavClick("#teach")}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Teach
              </button>
              <button 
                onClick={handleProfileClick}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                My Profile
              </button>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-muted-foreground px-3 py-2">
                      Welcome, {user?.name}
                    </span>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate("/dashboard")}>
                      <User className="h-4 w-4 mr-2" />
                      My Dashboard
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={openLoginModal}>Login</Button>
                    <Button variant="gradient" className="justify-start" onClick={openSignupModal}>Sign Up</Button>
                  </>
                )}
              </div>
            </nav>
        </div>
      )}
    </div>

    {!isAuthenticated && (
      <AuthModal 
        open={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen} 
        defaultTab={authModalTab}
      />
    )}
    </header>
  );
};

export default Header;