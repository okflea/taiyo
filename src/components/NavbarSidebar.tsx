import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

interface NavbarSidebarProps {
  children: React.ReactNode
}
const NavbarSidebar = ({ children }: NavbarSidebarProps) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar */}
      <div className="bg-muted-foreground dark:bg-muted w-36 flex flex-col">
        <div className="h-16 flex items-center justify-center bg-secondary-foreground/40 dark:bg-primary/40 ">
          <img src='../../public/Taiyo-logo.png' alt="logo" className="h-10" />
        </div>
        <nav className="flex-1 py-6 space-y-2">
          <Link to="/" className="block py-2.5 text-center  hover:bg-primary/50">Contact</Link>
          <Link to="/charts-maps" className="block py-2.5 text-center  hover:bg-primary/50">Charts & Maps</Link>
          <Link to="/colors" className="block py-2.5 text-center  hover:bg-primary/50">Colors</Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-muted-foreground/80 dark:bg-muted/80  h-16 flex items-center justify-between px-6">
          <h2>
            {pathname === '/' && "Contact Page"}
            {pathname === '/charts-maps' && "Charts & Map Page"}
          </h2>
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NavbarSidebar;
