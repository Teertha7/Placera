import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { NotificationDropdown } from '../common/NotificationDropdown';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  GitPullRequest,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Companies', path: '/admin/companies', icon: Building2 },
    { name: 'Job Postings', path: '/admin/jobs', icon: Briefcase },
    { name: 'Applications', path: '/admin/applications', icon: GitPullRequest },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar for Desktop (Fixed in place, never scrolls with page) */}
      <aside className="hidden md:flex flex-col w-64 h-full bg-slate-900 border-r border-slate-800 text-slate-300 flex-shrink-0 select-none">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <Logo to="/admin" inverted size="md" showTagline />
        </div>

        <div className="px-6 py-3 bg-blue-950/40 border-b border-slate-800 flex items-center gap-2 flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
            Placement Cell Admin
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {user?.firstName?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">Placement Officer</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Independent scroll container) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Admin Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-800 font-semibold capitalize">
                {window.location.pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {user?.firstName?.charAt(0) || 'A'}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-800">
                {user?.fullName}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-1 flex-shrink-0">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
