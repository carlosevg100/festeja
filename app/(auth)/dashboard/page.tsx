'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Users, Gift, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockUser, mockEvents } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="p-6 bg-surface border border-border hover:border-border-strong transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm mb-1">{label}</p>
            <p className="text-3xl font-bold font-display text-white">
              {value}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
            {Icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function EventCard({ event }: { event: (typeof mockEvents)[0] }) {
  // Calculate stats from mock data
  const confirmedGuests = Math.floor(Math.random() * 20) + 5;
  const totalGuests = event.max_guests || 30;
  const reservedGifts = Math.floor(Math.random() * 15) + 3;

  const eventTypeEmojis: Record<string, string> = {
    birthday: '🎂',
    baby_shower: '🍼',
    quinceanera: '👑',
    corporate: '💼',
    other: '🎉',
  };

  const emoji = eventTypeEmojis[event.event_type] || '🎉';

  const isPublished = event.is_published;
  const daysUntil = Math.ceil(
    (new Date(event.event_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <motion.div variants={itemVariants}>
      <Link href={`/dashboard/event/${event.id}`}>
        <Card className="overflow-hidden bg-surface border border-border hover:border-border-strong transition-all duration-200 hover:shadow-card-hover cursor-pointer group">
          {/* Cover image */}
          <div className="relative h-40 bg-gradient-primary overflow-hidden flex items-center justify-center">
            <div className="text-6xl">{emoji}</div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold font-display text-white line-clamp-2">
                {event.title}
              </h3>
              <Badge
                variant={isPublished ? 'success' : 'pending'}
                className="shrink-0 ml-2"
              >
                {isPublished ? 'Publicado' : 'Rascunho'}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <CalendarDays className="w-4 h-4" />
                {formatDate(event.event_date, false)} {daysUntil > 0 && `(em ${daysUntil} dias)`}
              </div>
              {event.location_name && (
                <p className="text-text-secondary text-sm line-clamp-1">
                  {event.location_name}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent-pink" />
                <div>
                  <p className="text-xs text-text-muted">Confirmados</p>
                  <p className="font-semibold">
                    {confirmedGuests}/{totalGuests}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-accent-gold" />
                <div>
                  <p className="text-xs text-text-muted">Presentes</p>
                  <p className="font-semibold">{reservedGifts}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function NewEventCard() {
  return (
    <motion.div variants={itemVariants}>
      <Link href="/dashboard/event/new">
        <Card className="h-full min-h-96 bg-surface border border-dashed border-border hover:border-border-strong transition-all duration-200 cursor-pointer flex items-center justify-center group">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">
              Criar novo evento
            </h3>
            <p className="text-text-secondary text-sm">
              Organize sua próxima festa
            </p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const firstName = mockUser.name.split(' ')[0];

  // Calculate stats
  const totalEvents = mockEvents.length;
  const totalConfirmedGuests = Math.floor(Math.random() * 50) + 24;
  const totalReservedGifts = Math.floor(Math.random() * 40) + 18;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold font-display mb-2"
        >
          Olá, {firstName}! 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary text-lg"
        >
          Bem-vindo ao seu painel de controle. Aqui você gerencia todas as suas
          festas.
        </motion.p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total de Eventos"
          value={totalEvents}
          icon={<CalendarDays className="w-6 h-6" />}
        />
        <StatCard
          label="Convidados Confirmados"
          value={totalConfirmedGuests}
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          label="Presentes Reservados"
          value={totalReservedGifts}
          icon={<Gift className="w-6 h-6" />}
        />
      </div>

      {/* Events Section */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold font-display">Meus Eventos</h2>
            <p className="text-text-secondary mt-1">
              Você tem {totalEvents} evento{totalEvents !== 1 ? 's' : ''} criado{totalEvents !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/dashboard/event/new">
            <Button size="lg" icon={<Plus className="w-5 h-5" />}>
              Novo Evento
            </Button>
          </Link>
        </div>

        {/* Events Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          <NewEventCard />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
