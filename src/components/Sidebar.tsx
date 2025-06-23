import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Home, Users, FileText, DollarSign, Menu, LogOut, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { useLogoutUser } from '@/api/login';
import { useGetProfile } from '@/api/userManagement';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window?.innerWidth < 768);
  const location = useLocation();
  const { data: currentUser } = useGetProfile();
  const pathname = location.pathname;
  const { mutate: logoutUser } = useLogoutUser();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define the type for navigation items
  type NavItem = {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onClick?: () => void;
  };

  // Base navigation items common to all users
  const baseNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Blogs', href: '/blogs', icon: FileText },
    { name: 'Social Media', href: '/social-media', icon: Globe },
    { name: 'Subscriptions', href: '/subscriptions', icon: DollarSign },
  ];

  // Create the full navigation menu based on user role
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin';
  const navItems: NavItem[] = [
    baseNavItems[0],
    isAdmin
      ? { name: 'Users', href: '/users', icon: Users }
      : { name: 'Profile', href: `/users/${currentUser?.id}/user-info`, icon: Users },
    ...baseNavItems.slice(1),
    {
      name: 'Log Out',
      href: '/',
      icon: LogOut,
      onClick: () => logoutUser(),
    },
  ];

  return (
    <aside
      className={cn(
        'z-50 h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out',
        isOpen && !isMobile ? 'w-64' : 'w-16'
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between p-4">
        {isOpen && !isMobile && (
          <h2 className="text-xl font-bold">
            {currentUser?.role === 'Admin'
              ? 'Admin Panel'
              : currentUser?.role === 'SuperAdmin'
                ? 'Super Admin Panel'
                : 'Grow Your Brand'}
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          disabled={isMobile}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => {
          const isActive = item.name !== 'Log Out' && (pathname === item.href || pathname.startsWith(item.href + '/'));

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn('flex items-center px-4 py-2 hover:bg-gray-700', isActive && 'bg-gray-700')}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {isOpen && !isMobile && <span className="ml-4">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
