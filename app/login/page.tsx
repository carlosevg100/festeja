'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Chrome, PartyPopper, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | null>(null);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast({ message: 'Digite seu email para continuar.', type: 'error' });
      return;
    }
    setIsLoading(true);
    setAuthMethod('email');
    setTimeout(() => {
      addToast({ message: 'Bem-vindo ao Festeja!', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 500);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setAuthMethod('google');
    setTimeout(() => {
      addToast({ message: 'Bem-vindo ao Festeja!', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-accent-pink/[0.06] rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] bg-accent-purple/[0.06] rounded-full blur-[100px]"
      />

      {/* Top bar */}
      <div className="relative z-10 px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="w-full max-w-[420px]"
        >
          {/* Logo */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-coral flex items-center justify-center mx-auto mb-5 shadow-glow-pink"
            >
              <PartyPopper className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold font-display mb-2">Entre no Festeja</h1>
            <p className="text-sm text-text-secondary">Organize sua proxima festa em minutos</p>
          </div>

          {/* Card */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-7 shadow-2xl shadow-black/20">
            {/* Google OAuth */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-text-primary font-semibold text-sm hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && authMethod === 'google' ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Autenticando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continuar com Google
                  </>
                )}
              </button>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs text-text-muted bg-bg-primary">ou entre com email</span>
              </div>
            </motion.div>

            {/* Email Form */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleMagicLink}
            >
              <div className="mb-4">
                <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-2">
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
                icon={<Mail className="w-4 h-4" />}
              >
                Enviar link magico
              </Button>
            </motion.form>

            {/* Terms */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[11px] text-text-muted text-center mt-5 leading-relaxed"
            >
              Ao entrar, voce concorda com os{' '}
              <a href="#" className="text-accent-pink hover:underline">Termos</a>{' '}
              e{' '}
              <a href="#" className="text-accent-pink hover:underline">Privacidade</a>
            </motion.p>
          </div>

          {/* Subtle feature note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-6 text-xs text-text-muted"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
            100% gratis. Sem cartao de credito.
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
