import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, LogIn, LayoutDashboard, UserPlus } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, role, user } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    return role === 'ADMIN' ? '/admin' : '/student';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo to="/" showTagline={false} size="md" />

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Platform Features
          </Link>
          <Link to="/#workflow" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Recruitment Process
          </Link>
          <Link to="/#faq" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            FAQ
          </Link>
          <Link to="/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Explore Opportunities
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              onClick={() => navigate(getDashboardPath())}
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
