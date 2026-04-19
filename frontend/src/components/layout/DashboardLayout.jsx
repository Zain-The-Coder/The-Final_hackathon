import { Link } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Explore Feed', path: '/explore', icon: '🔍' },
    { name: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
    { name: 'AI Center', path: '/ai-center', icon: '✨' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      {/* Sidebar - Fixed for Premium Feel */}
      <aside className="w-64 border-r border-white/5 bg-[#09090b] p-6 flex flex-col">
        <div className="text-xl font-bold mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">H</div>
          Helplytics AI
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <span>{item.icon}</span> {item.name}
            </Link>
          ))}
        </nav>

        {/* User Info at Bottom */}
        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
            <div>
              <p className="text-sm font-semibold">User Name</p>
              <p className="text-xs text-zinc-500">Trust Score: 120</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;