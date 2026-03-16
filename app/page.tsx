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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

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
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg-primary/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold font-display bg-gradient-primary bg-clip-text text-transparent">
            Festeja
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#como-funciona"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Como Funciona
          </a>
          <a
            href="#recursos"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Recursos
          </a>
        </div>

        <Link href="/login">
          <Button size="md">
            Criar minha festa
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let timer: NodeJS.Timeout;
    if (count < 2847) {
      timer = setTimeout(() => {
        setCount((prev) => Math.min(prev + 28, 2847));
      }, 10);
    }

    return () => clearTimeout(timer);
  }, [count, isInView]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute bottom-40 right-20 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative z-10 max-w-4xl mx-auto px-4 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6"
        >
          Sua festa.{' '}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Sem caos.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto"
        >
          Convites lindos, lista de presentes inteligente, RSVP automático. Tudo em um só lugar.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link href="/login">
            <Button size="lg">
              Criar minha festa grátis
            </Button>
          </Link>
          <a href="#como-funciona">
            <Button
              variant="ghost"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Ver como funciona
            </Button>
          </a>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-surface border border-border rounded-2xl p-6 inline-block"
        >
          <div className="text-sm text-text-secondary mb-2">Festas já organizadas</div>
          <div className="text-4xl font-bold text-white font-display">
            {count.toLocaleString('pt-BR')}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      number: 1,
      title: 'Crie',
      description: 'Monte sua festa em minutos com nosso wizard inteligente',
      icon: Wand2,
    },
    {
      number: 2,
      title: 'Compartilhe',
      description: 'Envie convites lindos pelo WhatsApp com um toque',
      icon: Share2,
    },
    {
      number: 3,
      title: 'Celebre',
      description: 'RSVPs, presentes e fotos — tudo organizado',
      icon: PartyPopper,
    },
  ];

  return (
    <section
      id="como-funciona"
      ref={ref}
      className="py-24 px-4 max-w-6xl mx-auto scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
          Como Funciona
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Três passos simples para organizar a melhor festa
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-primary opacity-20" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              viewport={{ once: true, margin: '-100px' }}
              className="relative"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold font-display text-white mb-6 relative z-10 ring-4 ring-bg-primary">
                  {step.number}
                </div>

                <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-accent-gold mb-4">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-bold font-display mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-center">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: 'Convites com IA',
      description: 'Gere convites profissionais em segundos',
      icon: Sparkles,
    },
    {
      title: 'Lista Inteligente',
      description: 'Presentes, cotas e experiências. Sem duplicata.',
      icon: Gift,
    },
    {
      title: 'RSVP Sem Atrito',
      description: 'Convidado confirma em 30 segundos. Sem baixar app.',
      icon: UserCheck,
    },
    {
      title: 'Tudo pelo WhatsApp',
      description: 'Preview bonito, link direto. O Brasil inteiro usa.',
      icon: MessageCircle,
    },
  ];

  return (
    <section
      id="recursos"
      className="py-24 px-4 max-w-6xl mx-auto scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
          Recursos Poderosos
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Tudo que você precisa para organizar uma festa incrível
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
              className="bg-surface border border-border rounded-2xl p-8 hover:border-border-strong transition-colors group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function EventTypesSection() {
  const eventTypes = [
    { label: 'Aniversário Infantil', emoji: '🎂' },
    { label: 'Chá de Bebê', emoji: '🍼' },
    { label: '15 Anos', emoji: '👑' },
    { label: 'Churrascos', emoji: '🥩' },
    { label: 'Formaturas', emoji: '🎓' },
  ];

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-12"
      >
        <h3 className="text-2xl font-bold font-display mb-2">
          Tipos de Festa
        </h3>
        <p className="text-text-secondary">
          Funciona para qualquer tipo de celebração
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {eventTypes.map((type, idx) => (
          <motion.div
            key={type.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true, margin: '-100px' }}
            className="bg-surface border border-border rounded-xl p-6 text-center hover:border-border-strong transition-colors"
          >
            <div className="text-4xl mb-2">{type.emoji}</div>
            <div className="text-sm font-medium">{type.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-3xl mx-auto text-center bg-surface border border-border rounded-3xl p-12 md:p-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
          Pronta para a melhor festa?
        </h2>
        <p className="text-lg text-text-secondary mb-10">
          Comece gratuitamente agora. Sem cartão de crédito. Sem pegadinha.
        </p>
        <Link href="/login" className="inline-block w-full">
          <Button size="lg" fullWidth className="mb-4">
            Criar minha festa — é grátis
          </Button>
        </Link>
        <p className="text-sm text-text-muted">
          Sem cartão. Sem pegadinha. 100% grátis.
        </p>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary py-12 px-4 mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-xl font-bold font-display bg-gradient-primary bg-clip-text text-transparent mb-2">
              Festeja
            </div>
            <p className="text-text-secondary text-sm">
              Organize sua festa perfeita
            </p>
          </div>

          <div>
            <h4 className="font-semibold font-display mb-4">Produto</h4>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>
                <a href="#" className="hover:text-text-primary transition-colors">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-text-primary transition-colors">
                  Preços
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold font-display mb-4">Empresa</h4>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>
                <a href="#" className="hover:text-text-primary transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold font-display mb-4">Legal</h4>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>
                <a href="#" className="hover:text-text-primary transition-colors">
                  Termos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-text-primary transition-colors">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-text-muted text-sm">
          <p>&copy; 2026 Festeja. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="bg-bg-primary">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <EventTypesSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
