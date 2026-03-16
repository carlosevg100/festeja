'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, PartyPopper } from 'lucide-react';

export function EventFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-12 sm:py-16 px-4 sm:px-6 bg-bg-primary border-t border-white/[0.04]"
    >
      <div className="max-w-3xl mx-auto text-center space-y-5">
        <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
          <span>Organizado com</span>
          <div className="w-5 h-5 rounded bg-gradient-to-br from-accent-pink to-accent-coral flex items-center justify-center">
            <PartyPopper className="w-3 h-3 text-white" />
          </div>
          <Link href="/" className="font-bold text-text-primary hover:text-accent-pink transition-colors">
            Festeja
          </Link>
        </div>

        <Link href="/">
          <motion.span
            whileHover={{ gap: '10px' }}
            className="inline-flex items-center gap-2 text-accent-pink hover:text-accent-pink/80 text-sm font-semibold transition-colors"
          >
            Crie sua festa tambem
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </Link>

        <p className="text-text-muted text-xs pt-4 border-t border-white/[0.04]">
          2026 Festeja by Olpi Technologies
        </p>
      </div>
    </motion.footer>
  );
}
