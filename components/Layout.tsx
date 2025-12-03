import React, { ReactNode } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  MessageSquareWarning,
  Radio,
  Coins,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const SidebarLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${active
      ? 'bg-primary text-white'
      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-light overflow-hidden">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-dark flex flex-col transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">SD</div>
            <h1 className="text-xl font-bold text-white tracking-tight">Shonali Desh</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-gray-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 sidebar-scroll overflow-y-auto">
          <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" active={isActive('/')} />
          <SidebarLink to="/users" icon={Users} label="Users" active={isActive('/users')} />
          <SidebarLink to="/experts" icon={GraduationCap} label="Experts" active={isActive('/experts')} />
          <SidebarLink to="/reports" icon={MessageSquareWarning} label="Reports & Feedback" active={isActive('/reports')} />
          <SidebarLink to="/iot" icon={Radio} label="IoT Devices" active={isActive('/iot')} />
          <SidebarLink to="/financials" icon={Coins} label="Financials" active={isActive('/financials')} />
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              AD
            </div>
            <div>
              <p className="text-white text-sm font-medium">Admin User</p>
              <p className="text-gray-400 text-xs">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
          <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-800">Shonali Desh Admin</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
