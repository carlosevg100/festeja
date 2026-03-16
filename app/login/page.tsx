'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | null>(null);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      addToast({
        message: 'Por favor, digite seu email para continuar.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    setAuthMethod('email');

    // Simulate API call
    setTimeout(() => {
      addToast({
        message: 'Bem-vindo à Festeja! Redirecionando...',
        type: 'success',
      });

      // Redirect to dashboard after brief delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setAuthMethod('google');

    // Simulate Google auth
    setTimeout(() => {
      addToast({
        message: 'Bem-vindo à Festeja! Redirecionando...',
        type: 'success',
      });

      // Redirect to dashboard after brief delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-mesh opacity-40" />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-accent-pink/10 rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl -z-10"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-4xl font-bold font-display bg-gradient-primary bg-clip-text text-transparent cursor-pointer"
            >
              Festeja
            </motion.div>
          </Link>
        </motion.div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold font-display mb-2">
              Entre na Festeja
            </h1>
            <p className="text-text-secondary mb-6">
              Comece a organizar sua festa perfeita
            </p>
          </motion.div>

          {/* Email Magic Link Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleMagicLink}
            className="mb-6"
          >
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading && authMethod === 'google'}
                required
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading && authMethod === 'email'}
              disabled={isLoading}
              icon={<Mail className="w-5 h-5" />}
            >
              Entrar com email mágico
            </Button>
          </motion.form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-secondary">ou</span>
            </div>
          </motion.div>

          {/* Google OAuth Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 text-base font-semibold rounded-lg bg-surface border border-border text-text-primary hover:bg-surface-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && authMethod === 'google' ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                />
                Autenticando...
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                Continuar com Google
              </>
            )}
          </motion.button>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-text-muted text-center mt-6"
          >
            Ao entrar, você concorda com os{' '}
            <a href="#" className="text-accent-pink hover:underline">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" className="text-accent-pink hover:underline">
              Privacidade
            </a>
          </motion.p>
        </div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-text-secondary text-sm mt-6"
        >
          Ainda não tem conta?{' '}
          <Link
            href="/login"
            className="text-accent-pink hover:underline font-medium"
          >
            Comece grátis
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
