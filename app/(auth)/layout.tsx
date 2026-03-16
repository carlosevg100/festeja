'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Calendar,
  Plus,
  Settings,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { mockUser } from '@/lib/mock-data';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Meus Eventos', href: '/dashboard/events', icon: Calendar },
  { label: 'Criar Evento', href: '/dashboard/event/new', icon: Plus },
  { label: 'Configurações', href: '/dashboard/settings', icon: Settings },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: open ? 0 : -250 }}
        exit={{ x: -250 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed left-0 top-0 h-full w-64 bg-bg-secondary border-r border-border z-50 md:static md:z-0 md:translate-x-0 flex flex-col"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/">
            <div className="text-2xl font-bold font-display bg-gradient-primary bg-clip-text text-transparent">
              Festeja
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden text-text-secondary hover:text-text-primary"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.href}
                whileHover={{ x: 4 }}
                whileTap={{ x: 2 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-primary text-white shadow-glow-pink'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border space-y-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar
              name={mockUser.name}
              src={mockUser.avatar_url ?? undefined}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{mockUser.name}</p>
              <p className="text-xs text-text-muted truncate">
                {mockUser.email}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            icon={<LogOut className="w-4 h-4" />}
            className="justify-start"
          >
            Sair
          </Button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-bg-primary border-b border-border">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="md:hidden text-text-secondary hover:text-text-primary"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors"
            >
              <Avatar
                name={mockUser.name}
                src={mockUser.avatar_url ?? undefined}
                size="sm"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{mockUser.name}</p>
                <p className="text-xs text-text-muted">Anfitrião</p>
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border rounded-xl shadow-card py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <p className="font-medium">{mockUser.name}</p>
                    <p className="text-sm text-text-muted">{mockUser.email}</p>
                  </div>

                  <a
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-surface transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm">Perfil</span>
                  </a>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface transition-colors text-error"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sair</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar open={true} onClose={() => {}} />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden md:w-full">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
