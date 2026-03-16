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
  PartyPopper,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { mockUser } from '@/lib/mock-data';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Meus Eventos', href: '/dashboard/events', icon: Calendar },
  { label: 'Criar Evento', href: '/dashboard/event/new', icon: Plus },
  { label: 'Configuracoes', href: '/dashboard/settings', icon: Settings },
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: open ? 0 : -280 }}
        exit={{ x: -280 }}
        transition={{ type: 'spring' as const, damping: 25, stiffness: 300 }}
        className="fixed left-0 top-0 h-full w-[260px] bg-bg-secondary/95 backdrop-blur-xl border-r border-white/[0.06] z-50 md:static md:z-0 md:translate-x-0 flex flex-col"
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-pink to-accent-coral flex items-center justify-center shadow-lg">
              <PartyPopper className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold font-display bg-gradient-to-r from-accent-pink to-accent-coral bg-clip-text text-transparent">
              Festeja
            </span>
          </Link>
          <button onClick={onClose} className="md:hidden text-text-muted hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            const isCreate = item.href === '/dashboard/event/new';

            if (isCreate) {
              return (
                <div key={item.href} className="pt-3 pb-1">
                  <Link href={item.href} onClick={onClose}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-pink to-accent-coral text-white font-semibold text-sm shadow-lg shadow-accent-pink/20 hover:shadow-accent-pink/30 transition-shadow"
                    >
                      <Plus className="w-4 h-4" />
                      Criar Evento
                    </motion.div>
                  </Link>
                </div>
              );
            }

            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.06] text-text-primary border border-white/[0.06]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-accent-pink' : ''}`} />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer">
            <Avatar name={mockUser.name} src={mockUser.avatar_url ?? undefined} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{mockUser.name}</p>
              <p className="text-[11px] text-text-muted truncate">{mockUser.email}</p>
            </div>
            <LogOut className="w-4 h-4 text-text-muted hover:text-error transition-colors" />
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-bg-primary/70 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <button onClick={onMenuClick} className="md:hidden text-text-secondary hover:text-text-primary transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-pink rounded-full" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <Avatar name={mockUser.name} src={mockUser.avatar_url ?? undefined} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium">{mockUser.name}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted hidden sm:block" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-bg-secondary/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl shadow-black/30 py-1.5 z-50"
                  >
                    <div className="px-3 py-2.5 border-b border-white/[0.06]">
                      <p className="text-sm font-medium">{mockUser.name}</p>
                      <p className="text-[11px] text-text-muted">{mockUser.email}</p>
                    </div>
                    <a
                      href="/dashboard/settings"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Perfil
                    </a>
                    <button
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-error/80 hover:text-error hover:bg-error/[0.05] transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar open={true} onClose={() => {}} />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
