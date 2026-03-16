'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Minimal Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xl font-bold font-display bg-gradient-primary bg-clip-text text-transparent"
            >
              Festeja
            </motion.div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Optional: Minimal Footer */}
      <footer className="border-t border-border bg-bg-secondary mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-text-muted text-sm">
          <p>&copy; 2026 Festeja. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
