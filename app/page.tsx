'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion';
import {
  Sparkles,
  Gift,
  UserCheck,
  MessageCircle,
  Wand2,
  Share2,
  PartyPopper,
  ArrowRight,
  Cake,
  Baby,
  Crown,
  GraduationCap,
  Utensils,
  Heart,
  Star,
  QrCode,
  Users,
  Shield,
  Zap,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ===== Animation Variants ===== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  viewport: { once: true, margin: '-80px' as any },
};

/* ===== Floating Particles Component ===== */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: i % 3 === 0 ? '#FF6B9D' : i % 3 === 1 ? '#A855F7' : '#FFD700',
            opacity: 0.3,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ===== Gradient Border Card ===== */
function GradientBorderCard({
  children,
  className = '',
  gradient = 'from-accent-pink via-accent-purple to-accent-gold',
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div className={`relative group ${className}`}>
      {/* Gradient border glow on hover */}
      <div
        className={`absolute -inset-[1px] bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}
      />
      <div
        className={`absolute -inset-[1px] bg-gradient-to-r ${gradient} rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
      />
      {/* Card content */}
      <div className="relative bg-bg-secondary rounded-2xl h-full">{children}</div>
    </div>
  );
}

/* ===== Navbar ===== */
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-bg-primary/70 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <PartyPopper className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-xl font-bold font-display bg-gradient-to-r from-accent-pink to-accent-coral bg-clip-text text-transparent">
            Festeja
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#como-funciona"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            Como Funciona
          </a>
          <a
            href="#recursos"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            Recursos
          </a>
          <a
            href="#eventos"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            Eventos
          </a>
        </div>

        <Link href="/login">
          <Button size="sm">Criar minha festa</Button>
        </Link>
      </div>
    </motion.nav>
  );
}

/* ===== Hero Section ===== */
function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let timer: NodeJS.Timeout;
    if (count < 2847) {
      timer = setTimeout(() => {
        setCount((prev) => Math.min(prev + 47, 2847));
      }, 12);
    }
    return () => clearTimeout(timer);
  }, [count, isInView]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Layered background */}
      <div className="absolute inset-0 bg-bg-primary" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />

      {/* Animated orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-accent-pink/[0.07] rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent-purple/[0.07] rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-gold/[0.04] rounded-full blur-[120px]"
      />

      <FloatingParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {/* Pill badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-accent-pink/10 text-accent-pink border border-accent-pink/20">
                <Sparkles className="w-3.5 h-3.5" />
                A plataforma #1 para festas no Brasil
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] font-extrabold font-display leading-[1.1] tracking-tight mb-6"
            >
              Sua festa.{' '}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-accent-pink via-accent-coral to-accent-gold bg-clip-text text-transparent">
                Sem o caos.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-text-secondary leading-relaxed mb-8 max-w-lg"
            >
              Convites profissionais, lista de presentes inteligente e RSVP
              automático. Organize tudo pelo WhatsApp em minutos.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/login">
                <Button size="lg" className="shadow-glow-pink">
                  Criar minha festa gratis
                </Button>
              </Link>
              <a href="#como-funciona">
                <Button
                  variant="ghost"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Ver como funciona
                </Button>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 flex-wrap"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    'bg-gradient-to-br from-pink-400 to-rose-500',
                    'bg-gradient-to-br from-purple-400 to-violet-500',
                    'bg-gradient-to-br from-amber-400 to-orange-500',
                    'bg-gradient-to-br from-emerald-400 to-green-500',
                  ].map((bg, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full ${bg} ring-2 ring-bg-primary flex items-center justify-center`}
                    >
                      <span className="text-[10px] font-bold text-white">
                        {['M', 'A', 'L', 'C'][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-text-secondary">
                  <strong className="text-text-primary">{count.toLocaleString('pt-BR')}+</strong>{' '}
                  festas organizadas
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                ))}
                <span className="text-sm text-text-secondary ml-1">4.9/5</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -10 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="relative hidden lg:block"
          >
            {/* Glow behind phone */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-pink/20 via-accent-purple/20 to-accent-gold/10 rounded-[40px] blur-[60px] scale-90" />

            {/* Phone frame */}
            <div className="relative mx-auto w-[320px]">
              <div className="relative bg-bg-secondary rounded-[2.5rem] p-3 border border-white/[0.08] shadow-2xl shadow-black/40">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-bg-secondary rounded-b-2xl z-10" />

                {/* Screen */}
                <div className="rounded-[2rem] overflow-hidden bg-bg-primary">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 pt-3 pb-2">
                    <span className="text-[10px] text-text-secondary font-medium">9:41</span>
                    <div className="flex gap-1.5">
                      <div className="w-3.5 h-2 rounded-sm bg-text-secondary/40" />
                      <div className="w-3 h-2 rounded-sm bg-text-secondary/40" />
                    </div>
                  </div>

                  {/* App preview content */}
                  <div className="px-4 pb-6 space-y-4">
                    {/* Mini hero */}
                    <div className="bg-gradient-to-br from-accent-pink/20 via-accent-purple/10 to-transparent rounded-2xl p-4 border border-white/[0.06]">
                      <div className="text-[10px] text-accent-pink font-semibold mb-1">PROXIMO EVENTO</div>
                      <div className="text-sm font-bold text-text-primary mb-2">Safari do Lucas</div>
                      <div className="flex items-center gap-4">
                        {['12', '08', '45', '22'].map((num, i) => (
                          <div key={i} className="text-center">
                            <div className="text-lg font-bold bg-gradient-to-r from-accent-pink to-accent-coral bg-clip-text text-transparent">
                              {num}
                            </div>
                            <div className="text-[8px] text-text-muted uppercase">
                              {['dias', 'hrs', 'min', 'seg'][i]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Convidados', value: '42', color: 'text-accent-pink' },
                        { label: 'Confirmados', value: '28', color: 'text-success' },
                        { label: 'Presentes', value: '15', color: 'text-accent-gold' },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-white/[0.03] rounded-xl p-2.5 border border-white/[0.06] text-center"
                        >
                          <div className={`text-base font-bold ${stat.color}`}>
                            {stat.value}
                          </div>
                          <div className="text-[8px] text-text-muted">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Guest list preview */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                        Confirmados Recentes
                      </div>
                      {[
                        { name: 'Ana Paula', status: 'Confirmou', color: 'bg-emerald-500' },
                        { name: 'Carlos Silva', status: 'Confirmou', color: 'bg-emerald-500' },
                        { name: 'Julia Santos', status: 'Talvez', color: 'bg-amber-500' },
                      ].map((guest) => (
                        <div
                          key={guest.name}
                          className="flex items-center gap-2.5 bg-white/[0.03] rounded-xl px-3 py-2 border border-white/[0.04]"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center">
                            <span className="text-[9px] font-bold text-white">
                              {guest.name[0]}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-medium text-text-primary truncate">
                              {guest.name}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${guest.color}`} />
                            <span className="text-[9px] text-text-muted">{guest.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification cards */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -left-16 top-24 bg-bg-secondary/90 backdrop-blur-xl border border-white/[0.08] rounded-xl p-3 shadow-xl shadow-black/30 w-44"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-[10px] font-semibold text-success">RSVP Recebido!</span>
                </div>
                <p className="text-[10px] text-text-secondary">Ana confirmou presenca + 2 acompanhantes</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="absolute -right-12 bottom-32 bg-bg-secondary/90 backdrop-blur-xl border border-white/[0.08] rounded-xl p-3 shadow-xl shadow-black/30 w-40"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-accent-gold/20 flex items-center justify-center">
                    <Gift className="w-3 h-3 text-accent-gold" />
                  </div>
                  <span className="text-[10px] font-semibold text-accent-gold">Presente!</span>
                </div>
                <p className="text-[10px] text-text-secondary">Carlos contribuiu R$ 50 para o bolo</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ===== How It Works ===== */
function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Crie',
      description: 'Monte sua festa em minutos com nosso wizard inteligente. Escolha o tema, cores e convite.',
      icon: Wand2,
      gradient: 'from-accent-pink to-accent-coral',
    },
    {
      number: '02',
      title: 'Compartilhe',
      description: 'Envie convites lindos pelo WhatsApp. Preview perfeito, link direto, QR code.',
      icon: Share2,
      gradient: 'from-accent-purple to-violet-500',
    },
    {
      number: '03',
      title: 'Celebre',
      description: 'RSVPs automaticos, lista de presentes organizada e mural de recados. Curta sem estresse.',
      icon: PartyPopper,
      gradient: 'from-accent-gold to-amber-500',
    },
  ];

  return (
    <section
      id="como-funciona"
      className="relative py-28 px-4 scroll-mt-24"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-pink/[0.02] to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div {...fadeInUp} className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent-purple/10 text-accent-purple border border-accent-purple/20 mb-4">
            Simples e rapido
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4 tracking-tight">
            Tres passos para a{' '}
            <span className="bg-gradient-to-r from-accent-pink to-accent-purple bg-clip-text text-transparent">
              festa perfeita
            </span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Da criacao ao dia da festa, tudo funciona automaticamente
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                viewport={{ once: true, margin: '-80px' }}
              >
                <GradientBorderCard gradient={`${step.gradient.replace('from-', 'from-').replace('to-', 'to-')}`}>
                  <div className="p-8 text-center">
                    {/* Step number */}
                    <div className="text-sm font-mono font-bold text-text-muted mb-6">{step.number}</div>

                    {/* Icon circle */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold font-display mb-3">{step.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
                  </div>
                </GradientBorderCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===== Features Section ===== */
function FeaturesSection() {
  const features = [
    {
      title: 'Convites com IA',
      description: 'Gere convites profissionais em segundos. Textos criativos, design perfeito e preview no WhatsApp.',
      icon: Sparkles,
      gradient: 'from-accent-pink to-accent-coral',
      tag: 'Em breve',
    },
    {
      title: 'Lista de Presentes',
      description: 'Produtos, cotas em grupo, experiencias e Pix. Sem duplicatas, com progresso em tempo real.',
      icon: Gift,
      gradient: 'from-accent-gold to-amber-500',
      tag: null,
    },
    {
      title: 'RSVP Sem Atrito',
      description: 'Convidado confirma em 30 segundos direto pelo link. Sem baixar app, sem cadastro.',
      icon: UserCheck,
      gradient: 'from-emerald-400 to-green-500',
      tag: null,
    },
    {
      title: 'WhatsApp Nativo',
      description: 'Preview bonito com Open Graph, link direto e QR Code. O Brasil inteiro ja usa.',
      icon: MessageCircle,
      gradient: 'from-green-400 to-emerald-500',
      tag: null,
    },
    {
      title: 'QR Code & Link',
      description: 'Compartilhe com QR Code em convites fisicos ou link direto para o digital.',
      icon: QrCode,
      gradient: 'from-accent-purple to-violet-500',
      tag: null,
    },
    {
      title: 'Gestao Completa',
      description: 'Dashboard com tudo: convidados, presentes, confirmacoes, mensagens e configuracoes.',
      icon: Users,
      gradient: 'from-blue-400 to-indigo-500',
      tag: null,
    },
  ];

  return (
    <section id="recursos" className="relative py-28 px-4 scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-purple/[0.02] to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent-gold/10 text-accent-gold border border-accent-gold/20 mb-4">
            <Zap className="w-3.5 h-3.5" />
            Recursos poderosos
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4 tracking-tight">
            Tudo que voce precisa.{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-accent-gold to-accent-pink bg-clip-text text-transparent">
              Nada que nao precisa.
            </span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Cada recurso foi pensado para tornar sua vida mais facil
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                viewport={{ once: true, margin: '-60px' }}
                className="group"
              >
                <div className="relative h-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
                  {/* Glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-500`} />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {feature.tag && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink border border-accent-pink/20">
                          {feature.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold font-display mb-2">{feature.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===== Event Types Section ===== */
function EventTypesSection() {
  const eventTypes = [
    { label: 'Aniversario Infantil', icon: Cake, gradient: 'from-pink-400 to-rose-500' },
    { label: 'Cha de Bebe', icon: Baby, gradient: 'from-sky-400 to-blue-500' },
    { label: '15 Anos', icon: Crown, gradient: 'from-amber-400 to-yellow-500' },
    { label: 'Churrascos', icon: Utensils, gradient: 'from-orange-400 to-red-500' },
    { label: 'Formaturas', icon: GraduationCap, gradient: 'from-emerald-400 to-green-500' },
    { label: 'Cha Revelacao', icon: Heart, gradient: 'from-purple-400 to-violet-500' },
  ];

  return (
    <section id="eventos" className="relative py-28 px-4 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent-coral/10 text-accent-coral border border-accent-coral/20 mb-4">
            <Heart className="w-3.5 h-3.5" />
            Para toda ocasiao
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4 tracking-tight">
            Qualquer festa,{' '}
            <span className="bg-gradient-to-r from-accent-coral to-accent-pink bg-clip-text text-transparent">
              uma plataforma
            </span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Do aniversario do seu filho ate a formatura da faculdade
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {eventTypes.map((type, idx) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true, margin: '-60px' }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
              >
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-center hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                    {type.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===== Testimonials Section ===== */
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Mariana Costa',
      role: 'Mae do Lucas, 5 anos',
      text: 'Organizei o safari do meu filho em 20 minutos. Os convidados ficaram impressionados com o convite pelo WhatsApp!',
      rating: 5,
      gradient: 'from-accent-pink to-accent-coral',
    },
    {
      name: 'Fernanda Oliveira',
      role: 'Debutante',
      text: 'Minha festa de 15 anos ficou perfeita. A lista de presentes com Pix foi a melhor ideia!',
      rating: 5,
      gradient: 'from-accent-purple to-violet-500',
    },
    {
      name: 'Juliana Mendes',
      role: 'Cha de bebe da Helena',
      text: 'Todas as amigas elogiaram. O RSVP automatico me poupou de ficar ligando para confirmar uma por uma.',
      rating: 5,
      gradient: 'from-accent-gold to-amber-500',
    },
  ];

  return (
    <section className="relative py-28 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-gold/[0.02] to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent-pink/10 text-accent-pink border border-accent-pink/20 mb-4">
            <Star className="w-3.5 h-3.5" />
            Amado por maes e organizadoras
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4 tracking-tight">
            Quem usa,{' '}
            <span className="bg-gradient-to-r from-accent-pink to-accent-gold bg-clip-text text-transparent">
              recomenda
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <div className="h-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                  ))}
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">{t.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{t.name}</div>
                    <div className="text-xs text-text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Final CTA ===== */
function FinalCTASection() {
  return (
    <section className="relative py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/20 via-accent-purple/10 to-accent-gold/10" />
          <div className="absolute inset-0 bg-bg-secondary/80 backdrop-blur-xl" />
          <div className="absolute inset-[1px] rounded-3xl border border-white/[0.08]" />

          {/* Decorative orbs */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent-pink/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-purple/10 rounded-full blur-[80px]" />

          <div className="relative px-8 py-16 sm:px-12 sm:py-20 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-coral flex items-center justify-center mx-auto mb-8 shadow-glow-pink"
            >
              <PartyPopper className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-5 tracking-tight">
              Pronta para a{' '}
              <span className="bg-gradient-to-r from-accent-pink via-accent-coral to-accent-gold bg-clip-text text-transparent">
                melhor festa?
              </span>
            </h2>
            <p className="text-lg text-text-secondary mb-10 max-w-lg mx-auto">
              Comece agora, gratuitamente. Sem cartao de credito. Sua proxima festa vai ser inesquecivel.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/login">
                <Button size="lg" className="shadow-glow-pink">
                  Criar minha festa — e gratis
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-success" />
                <span>100% gratis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-accent-purple" />
                <span>Dados seguros</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-accent-gold" />
                <span>Pronto em minutos</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ===== Footer ===== */
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
                <PartyPopper className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-lg font-bold font-display bg-gradient-to-r from-accent-pink to-accent-coral bg-clip-text text-transparent">
                Festeja
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              A plataforma premium para organizar qualquer tipo de festa no Brasil.
            </p>
          </div>

          {[
            {
              title: 'Produto',
              links: ['Recursos', 'Precos', 'API'],
            },
            {
              title: 'Empresa',
              links: ['Sobre', 'Blog', 'Contato'],
            },
            {
              title: 'Legal',
              links: ['Termos', 'Privacidade', 'Cookies'],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold font-display mb-4 text-text-primary">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; 2026 Festeja by Olpi Technologies. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-text-muted hover:text-text-primary transition-colors">
              Instagram
            </a>
            <a href="#" className="text-xs text-text-muted hover:text-text-primary transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===== Main Page ===== */
export default function HomePage() {
  return (
    <main className="bg-bg-primary min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <EventTypesSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
