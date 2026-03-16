'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function EventFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-12 sm:py-16 px-4 sm:px-6 bg-bg-primary border-t border-border"
    >
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Main Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-text-secondary text-base sm:text-lg"
        >
          Organizado com 💖 no{' '}
          <span className="text-white font-semibold">Festeja</span>
        </motion.p>

        {/* CTA Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/">
            <motion.button
              whileHover={{ gap: '10px' }}
              className="inline-flex items-center gap-2 text-accent-pink hover:text-accent-pink/80 font-semibold transition-colors group"
            >
              Crie sua festa também
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-text-muted text-xs sm:text-sm pt-4 border-t border-border"
        >
          © 2026 Festeja. Todos os direitos reservados.
        </motion.p>
      </div>
    </motion.footer>
  );
}
