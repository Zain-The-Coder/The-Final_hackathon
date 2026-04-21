import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { Bell, LayoutDashboard, User as UserIcon, LogOut, Settings } from 'lucide-react';
import api from '../api/axios';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchUnread = async () => {
        try {
          const { data } = await api.get('/notifications');
          if (data.success) setUnreadCount(data.unreadCount);
        } catch (error) { }
      };
      fetchUnread();
    }
  }, [user, location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#F8F7F0]/90 backdrop-blur-md">
      <div className="flex justify-between items-center px-12 py-6 max-w-[1440px] mx-auto">
        
        {/* Left Side: Brand & Links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0d3b34] rounded-xl flex items-center justify-center text-white text-lg font-bold">H</div>
            <span className="text-xl font-extrabold text-[#0d3b34] tracking-tight">HelpHub AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-[#0d3b34]/60">
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
            <NavLink to="/explore" active={isActive('/explore')}>Explore</NavLink>
            <NavLink to="/leaderboard" active={isActive('/leaderboard')}>Leaderboard</NavLink>
            <NavLink to="/ai-center" active={isActive('/ai-center')}>AI Center</NavLink>
            {user && <NavLink to="/messages" active={isActive('/messages')}>Messages</NavLink>}
          </div>
        </div>

        {/* Right Side: Account Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[11px] font-bold uppercase tracking-wider text-[#22b29e] border border-[#22b29e]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22b29e]"></span>
            Live community signals
          </div>

          {user ? (
            <div className="flex items-center gap-4 border-l border-[#0d3b34]/5 pl-6">
               <Link 
                to="/notifications" 
                className={cn(
                  "p-2.5 rounded-full transition-all relative",
                  isActive('/notifications') ? "text-[#22b29e] bg-[#e3efe9]" : "text-[#0d3b34]/40 hover:text-[#0d3b34]"
                )}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-[#F8F7F0]">
                    {unreadCount}
                  </span>
                )}
              </Link>
              
              <Link 
                to="/dashboard" 
                className={cn(
                  "p-2.5 rounded-full transition-all",
                  isActive('/dashboard') ? "text-[#22b29e] bg-[#e3efe9]" : "text-[#0d3b34]/40 hover:text-[#0d3b34]"
                )}
              >
                <LayoutDashboard size={20} />
              </Link>

              <Link 
                to="/profile" 
                className={cn(
                  "p-2.5 rounded-full transition-all",
                  isActive('/profile') ? "text-[#22b29e] bg-[#e3efe9]" : "text-[#0d3b34]/40 hover:text-[#0d3b34]"
                )}
              >
                <UserIcon size={20} />
              </Link>

              {user.role === 'admin' && (
                <Link to="/admin" className="p-2.5 text-red-500 hover:bg-neutral-100 rounded-full">
                  <Settings size={20} />
                </Link>
              )}

              <button 
                onClick={logout}
                className="bg-[#0d3b34] text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-tight hover:shadow-lg transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="bg-[#0d3b34] text-white px-6 py-3 rounded-full font-bold text-sm tracking-tight hover:shadow-lg transition-all">
              Join the platform
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={cn(
      "transition-colors whitespace-nowrap",
      active 
        ? "text-[#22b29e] bg-[#e3efe9] px-4 py-1.5 rounded-full" 
        : "hover:text-[#0d3b34]"
    )}
  >
    {children}
  </Link>
);

export default Navbar;
