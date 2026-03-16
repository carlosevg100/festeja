'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  Users,
  Gift,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  Cake,
  Baby,
  Crown,
  Utensils,
  GraduationCap,
  PartyPopper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockUser, mockEvents } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const eventTypeConfig: Record<string, { icon: any; gradient: string; label: string }> = {
  birthday: { icon: Cake, gradient: 'from-pink-500 to-rose-500', label: 'Aniversario' },
  baby_shower: { icon: Baby, gradient: 'from-sky-400 to-blue-500', label: 'Cha de Bebe' },
  quinceanera: { icon: Crown, gradient: 'from-amber-400 to-yellow-500', label: '15 Anos' },
  corporate: { icon: GraduationCap, gradient: 'from-emerald-400 to-green-500', label: 'Corporativo' },
  other: { icon: PartyPopper, gradient: 'from-purple-400 to-violet-500', label: 'Evento' },
};

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  suffix,
}: {
  label: string;
  value: number | string;
  icon: any;
  gradient: string;
  suffix?: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <TrendingUp className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-bold font-display text-text-primary">
          {value}
          {suffix && <span className="text-sm font-normal text-text-muted ml-1">{suffix}</span>}
        </p>
        <p className="text-xs text-text-muted mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

function EventCard({ event }: { event: (typeof mockEvents)[0] }) {
  const confirmedGuests = Math.floor(Math.random() * 20) + 5;
  const totalGuests = event.max_guests || 30;
  const config = eventTypeConfig[event.event_type] || eventTypeConfig.other;
  const Icon = config.icon;
  const isPublished = event.is_published;
  const daysUntil = Math.ceil(
    (new Date(event.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div variants={itemVariants}>
      <Link href={`/dashboard/event/${event.id}`}>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300 cursor-pointer"
        >
          {/* Header with gradient */}
          <div className={`relative h-36 bg-gradient-to-br ${config.gradient} overflow-hidden`}>
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }} />
            </div>
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>
            {/* Status badge */}
            <div className="absolute top-3 right-3">
              <Badge variant={isPublished ? 'success' : 'pending'} className="text-[10px]">
                {isPublished ? 'Publicado' : 'Rascunho'}
              </Badge>
            </div>
            {/* Days counter */}
            {daysUntil > 0 && (
              <div className="absolute bottom-3 left-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-white text-[10px] font-medium">
                  <Clock className="w-3 h-3" />
                  em {daysUntil} dias
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-base font-bold font-display text-text-primary mb-1.5 group-hover:text-accent-pink transition-colors line-clamp-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-1.5 text-text-muted text-xs mb-4">
              <CalendarDays className="w-3.5 h-3.5" />
              {formatDate(event.event_date, false)}
              {event.location_name && (
                <>
                  <span className="text-white/10 mx-1">|</span>
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{event.location_name}</span>
                </>
              )}
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-accent-pink" />
                <span className="text-xs text-text-secondary">
                  <strong className="text-text-primary">{confirmedGuests}</strong>/{totalGuests}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-accent-gold" />
                <span className="text-xs text-text-secondary">
                  <strong className="text-text-primary">{Math.floor(Math.random() * 15) + 3}</strong> presentes
                </span>
              </div>
              <div className="ml-auto">
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent-pink group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function NewEventCard() {
  return (
    <motion.div variants={itemVariants}>
      <Link href="/dashboard/event/new">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="h-full min-h-[340px] bg-white/[0.01] border border-dashed border-white/[0.08] rounded-2xl flex items-center justify-center cursor-pointer hover:border-accent-pink/30 hover:bg-accent-pink/[0.02] transition-all duration-300 group"
        >
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ duration: 0.3 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-coral flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent-pink/20"
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-sm font-bold font-display mb-1 group-hover:text-accent-pink transition-colors">
              Criar novo evento
            </h3>
            <p className="text-xs text-text-muted">Organize sua proxima festa</p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const firstName = mockUser.name.split(' ')[0];
  const totalEvents = mockEvents.length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Welcome */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm text-text-muted mb-1">{greeting},</p>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">
              {firstName}
            </h1>
          </div>
          <Link href="/dashboard/event/new">
            <Button size="md" icon={<Plus className="w-4 h-4" />}>
              Novo Evento
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Eventos Ativos" value={totalEvents} icon={CalendarDays} gradient="from-accent-pink to-accent-coral" />
        <StatCard label="Convidados" value={74} icon={Users} gradient="from-accent-purple to-violet-500" suffix="total" />
        <StatCard label="Confirmados" value={48} icon={Users} gradient="from-emerald-400 to-green-500" />
        <StatCard label="Presentes" value={32} icon={Gift} gradient="from-accent-gold to-amber-500" suffix="reservados" />
      </div>

      {/* Events */}
      <motion.div variants={itemVariants} className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display">Meus Eventos</h2>
          <span className="text-xs text-text-muted">{totalEvents} evento{totalEvents !== 1 ? 's' : ''}</span>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          <NewEventCard />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
