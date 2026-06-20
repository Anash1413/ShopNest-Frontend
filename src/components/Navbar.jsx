import React, { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth"
import { NavLink } from 'react-router-dom';
import logoImg from '../assets/Logo.png';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User, 
  ClipboardList, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  Layers,
  LayoutDashboard,
  Plus,
  Heart,
  Sun,
  Moon
} from 'lucide-react';

const Navbar = () => {
  const {isAdmin , isAuthentic} = useAuth()
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Styling helpers for active/inactive links
  const navLinkClass = ({ isActive }) => 
    `font-mono text-xs uppercase tracking-wider transition-all duration-300 py-1 ${
      isActive 
        ? 'text-ochi-green font-bold border-b border-ochi-green' 
        : 'text-white/70 hover:text-white border-b border-transparent'
    }`;

  const mobileNavLinkClass = ({ isActive }) => 
    `block font-mono text-sm uppercase tracking-wider transition-all duration-300 py-3 border-b border-white/5 ${
      isActive 
        ? 'text-ochi-green font-bold' 
        : 'text-white/70 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-ochi-charcoal/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <img src={logoImg} alt="ShopNest Logo" className="h-8 w-8 object-contain rounded-lg group-hover:scale-105 transition-transform duration-350" />
              <span className="text-xl font-black uppercase tracking-tight text-white group-hover:text-ochi-green transition-colors duration-300">
                ShopNest
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {isAuthentic && 
            <>
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/products" className={navLinkClass}>
                Products
              </NavLink>
              {!isAdmin && (
                <>
                  <NavLink to="/favourites" className={navLinkClass}>
                    Wishlist
                  </NavLink>
                  <NavLink to="/cart" className={navLinkClass}>
                    Cart
                  </NavLink>
                </>
              )}
              {isAdmin && (
                <>
                  <NavLink to="/admin" className={navLinkClass} end>
                    Dashboard
                  </NavLink>
                  <NavLink to="/admin/add-product" className={navLinkClass}>
                    Add Product
                  </NavLink>
                </>
              )}
              <NavLink to={isAdmin?"/admin/orders":"/orders"} className={navLinkClass}>
                Orders
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
            </>}
          </nav>

          {/* Desktop Auth & Theme Toggle Section */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="px-4 py-2 rounded-full border border-white/20 hover:border-white font-mono text-[10px] uppercase tracking-wider text-white transition-all cursor-pointer flex items-center gap-1.5"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-ochi-green" />
                  <span>Light Theme</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-ochi-green" />
                  <span>Dark Theme</span>
                </>
              )}
            </button>

            {isAuthentic ? (
              <NavLink 
                to="/logout" 
                className="px-5 py-2.5 rounded-full border border-rose-500/30 font-mono text-xs uppercase tracking-wider text-rose-450 hover:bg-rose-500 hover:text-white transition-all duration-300"
              >
                Logout
              </NavLink>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className="px-5 py-2.5 rounded-full border border-white/20 font-mono text-xs uppercase tracking-wider text-white hover:bg-white hover:text-ochi-charcoal transition-all duration-300"
                >
                  Sign In
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="px-5 py-2.5 rounded-full bg-ochi-green border border-ochi-green font-mono text-xs uppercase tracking-wider text-ochi-charcoal hover:bg-transparent hover:text-white transition-all duration-300"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Burger Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition-all duration-300 focus:outline-none"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-ochi-green" /> : <Moon className="h-4 w-4 text-ochi-green" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition-all duration-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] border-t border-white/10 bg-ochi-charcoal/98 backdrop-blur-xl' : 'max-h-0'
        }`}
      >
        <div className="px-6 py-6 space-y-4">
          {isAuthentic && (
            <>
              <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                Home
              </NavLink>
              <NavLink to="/products" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                Products
              </NavLink>
              {!isAdmin && (
                <>
                  <NavLink to="/favourites" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                    Wishlist
                  </NavLink>
                  <NavLink to="/cart" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                    Cart
                  </NavLink>
                </>
              )}
              {isAdmin && (
                <>
                  <NavLink to="/admin" onClick={() => setIsOpen(false)} className={mobileNavLinkClass} end>
                    Dashboard
                  </NavLink>
                  <NavLink to="/admin/add-product" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                    Add Product
                  </NavLink>
                </>
              )}
              <NavLink to={isAdmin ? "/admin/orders" : "/orders"} onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                Orders
              </NavLink>
              <NavLink to="/profile" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                Profile
              </NavLink>
            </>
          )}

          {/* Mobile Auth Actions */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
            {!isAuthentic ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-3 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider hover:bg-white hover:text-ochi-charcoal transition-all duration-300"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-3 rounded-full bg-ochi-green text-ochi-charcoal font-mono text-xs uppercase tracking-wider hover:bg-transparent hover:text-white border border-ochi-green transition-all duration-300"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <NavLink
                to="/logout"
                onClick={() => setIsOpen(false)}
                className="col-span-2 flex items-center justify-center px-4 py-3 rounded-full border border-rose-500/30 text-rose-450 font-mono text-xs uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all duration-300"
              >
                Logout
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;