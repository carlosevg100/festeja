'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Share2,
  Edit3,
  Users,
  Gift as GiftIcon,
  MessageSquare,
  Settings,
  Copy,
  Download,
  Archive,
  Trash2,
  Check,
  Clock,
  AlertCircle,
  MessageCircle,
  Plus,
  Filter,
  ChevronRight,
  QrCode as QrCodeIcon,
  Lock,
  Globe,
  MessageSquareText,
  Camera,
} from 'lucide-react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { ProgressBar } from '@/components/ui/progress-bar';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';
import {
  formatDate,
  formatCurrency,
  getInitials,
  cn,
  formatRelativeTime,
} from '@/lib/utils';
import {
  getEventTypeLabel,
  getRSVPStatusLabel,
  getGiftTypeLabel,
} from '@/lib/utils';
import {
  mockEvents,
  mockGuests,
  mockGifts,
  mockMessages,
  mockGiftContributions,
} from '@/lib/mock-data';
import type { Event, Guest, Gift as GiftData, RSVPStatus } from '@/types';

type TabType = 'overview' | 'guests' | 'gifts' | 'share' | 'settings';
type GuestFilterStatus = 'all' | 'confirmed' | 'pending' | 'declined';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'green' | 'yellow' | 'red' | 'blue';
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => {
  const colorClasses: Record<string, string> = {
    green: 'from-success/20 to-success/5 border-success/30',
    yellow: 'from-warning/20 to-warning/5 border-warning/30',
    red: 'from-error/20 to-error/5 border-error/30',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
  };

  const iconColors: Record<string, string> = {
    green: 'text-success',
    yellow: 'text-warning',
    red: 'text-error',
    blue: 'text-blue-400',
  };

  return (
    <Card padding="md" className={cn('bg-gradient-to-br', colorClasses[color])}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-text-secondary mb-2">{label}</p>
          <p className="text-2xl font-bold text-text-primary font-display">
            {value}
          </p>
        </div>
        <div className={cn('w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center', iconColors[color])}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

interface RecentRSVPItemProps {
  guest: Guest;
  rsvpTime: string;
}

const RecentRSVPItem = ({ guest, rsvpTime }: RecentRSVPItemProps) => {
  const statusColorMap: Record<RSVPStatus, 'success' | 'warning' | 'error' | 'pending'> = {
    confirmed: 'success',
    pending: 'pending',
    declined: 'error',
    maybe: 'warning',
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <div className="flex items-center gap-3">
        <Avatar name={guest.name} size="sm" />
        <div>
          <p className="text-sm font-medium text-text-primary">{guest.name}</p>
          <p className="text-xs text-text-muted">{rsvpTime}</p>
        </div>
      </div>
      <Badge
        variant={statusColorMap[guest.rsvp_status as RSVPStatus]}
        size="sm"
      >
        {getRSVPStatusLabel(guest.rsvp_status)}
      </Badge>
    </div>
  );
};

interface GiftCardProps {
  gift: GiftData;
}

const GiftCardComponent = ({ gift }: GiftCardProps) => {
  let statusVariant: 'success' | 'info' | 'accent' = 'info';
  let statusLabel = 'Disponível';

  if (gift.status === 'reserved') {
    statusVariant = 'info';
    statusLabel = 'Reservado';
  } else if (gift.status === 'purchased') {
    statusVariant = 'accent';
    statusLabel = 'Meta Atingida';
  }

  const isQuotaGift = gift.gift_type === 'quota' && gift.is_group_gift;
  const percentage = gift.group_goal && gift.group_goal > 0
    ? Math.min((gift.group_raised / gift.group_goal) * 100, 100)
    : 0;

  return (
    <Card variant="interactive" padding="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-text-primary line-clamp-2">
              {gift.name}
            </h4>
            <div className="flex gap-2 mt-2">
              <Badge variant="info" size="sm">
                {getGiftTypeLabel(gift.gift_type)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Price or Goal */}
        <div className="text-lg font-bold text-accent-pink">
          {formatCurrency(gift.price ?? 0)}
        </div>

        {/* Progress for quota gifts */}
        {isQuotaGift && (
          <div>
            <ProgressBar
              current={gift.group_raised || 0}
              goal={gift.group_goal || (gift.price ?? 0)}
              showLabel={false}
              showPercentage={false}
              height="sm"
              animated={false}
            />
          </div>
        )}

        {/* Status Badge */}
        <div>
          <Badge variant={statusVariant} size="sm">
            {statusLabel}
            {gift.reserved_by && ` - ${gift.reserved_by}`}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default function EventManagementPage({
  params,
}: {
  params: { id: string };
}) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [guestFilter, setGuestFilter] = useState<GuestFilterStatus>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // Get the first event as mock data
  const event: Event = mockEvents[0];

  // Filter guests for this event
  const eventGuests = mockGuests.filter((g) => g.event_id === event.id);
  const eventGifts = mockGifts.filter((g) => g.event_id === event.id);
  const eventMessages = mockMessages.filter((m) => m.event_id === event.id);

  // Calculate stats
  const confirmedCount = eventGuests.filter(
    (g) => g.rsvp_status === 'confirmed',
  ).length;
  const pendingCount = eventGuests.filter((g) => g.rsvp_status === 'pending').length;
  const declinedCount = eventGuests.filter(
    (g) => g.rsvp_status === 'declined',
  ).length;
  const totalGuests = eventGuests.length;

  const reservedGifts = eventGifts.filter((g) => g.status === 'reserved').length;
  const totalGifts = eventGifts.length;

  const totalGiftValue = eventGifts.reduce((sum, g) => sum + (g.price ?? 0), 0);

  // Filter guests by RSVP status
  const filteredGuests =
    guestFilter === 'all'
      ? eventGuests
      : eventGuests.filter((g) => g.rsvp_status === guestFilter);

  // Get recent RSVPs (last 5)
  const recentRSVPs = eventGuests
    .filter((g) => g.rsvp_at)
    .sort(
      (a, b) =>
        new Date(b.rsvp_at || 0).getTime() - new Date(a.rsvp_at || 0).getTime(),
    )
    .slice(0, 5);

  // Get recent gift reservations (last 5)
  const recentGiftReservations = eventGifts
    .filter((g) => g.reserved_at)
    .sort(
      (a, b) =>
        new Date(b.reserved_at || 0).getTime() -
        new Date(a.reserved_at || 0).getTime(),
    )
    .slice(0, 5);

  // Calculate total plus ones
  const totalPlusOnes = eventGuests.reduce((sum, g) => sum + (g.plus_ones || 0), 0);

  // Generate QR Code on mount
  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsGeneratingQR(true);
        const eventUrl = `${window.location.origin}/festa/${event.slug}`;
        const qrDataUrl = await QRCode.toDataURL(eventUrl, {
          errorCorrectionLevel: 'H',
          margin: 1,
          color: {
            dark: '#0A0A0B',
            light: '#FFFFFF',
          },
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
        addToast({
          type: 'error',
          message: 'Erro ao gerar QR Code',
        });
      } finally {
        setIsGeneratingQR(false);
      }
    };

    generateQR();
  }, [event.slug, addToast]);

  const eventPageUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/festa/${event.slug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(eventPageUrl);
    addToast({
      type: 'success',
      message: 'URL copiada para a área de transferência!',
    });
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${event.slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      message: 'QR Code baixado com sucesso!',
    });
  };

  const handleShareWhatsApp = () => {
    const message = `Olá! Você está convidado para ${event.title}! Clique aqui para ver os detalhes: ${eventPageUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleToggleSetting = (setting: string) => {
    addToast({
      type: 'success',
      message: `Configuração "${setting}" atualizada`,
    });
  };

  const handleArchiveEvent = () => {
    addToast({
      type: 'success',
      message: 'Evento arquivado com sucesso',
    });
  };

  const handleDeleteEvent = () => {
    setIsDeleteModalOpen(false);
    addToast({
      type: 'success',
      message: 'Evento deletado com sucesso',
    });
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-bg-primary py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card variant="elevated" padding="lg" className="bg-gradient-to-r from-surface via-surface to-surface-hover">
            <div className="space-y-6">
              {/* Title and Badges */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-text-primary font-display">
                    {event.title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="info">
                      {getEventTypeLabel(event.event_type)}
                    </Badge>
                    <Badge
                      variant={event.is_published ? 'success' : 'warning'}
                    >
                      {event.is_published ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Date and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide">
                    Data e Hora
                  </p>
                  <p className="text-sm text-text-primary mt-1">
                    {formatDate(event.event_date)}
                  </p>
                </div>
                {event.location_name && (
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide">
                      Local
                    </p>
                    <p className="text-sm text-text-primary mt-1">
                      {event.location_name}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Link href={`/festa/${event.slug}`}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Eye size={18} />}
                  >
                    Ver Página
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Share2 size={18} />}
                  onClick={() => setActiveTab('share')}
                >
                  Compartilhar
                </Button>
                <Link href={`/event/${event.id}/edit`}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Edit3 size={18} />}
                  >
                    Editar
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          <StatCard
            icon={<Check size={20} />}
            label="Confirmados"
            value={confirmedCount}
            color="green"
          />
          <StatCard
            icon={<Clock size={20} />}
            label="Pendentes"
            value={pendingCount}
            color="yellow"
          />
          <StatCard
            icon={<GiftIcon size={20} />}
            label="Presentes Reservados"
            value={`${reservedGifts}/${totalGifts}`}
            color="blue"
          />
          <StatCard
            icon={<AlertCircle size={20} />}
            label="Valor Estimado"
            value={formatCurrency(totalGiftValue)}
            color="blue"
          />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-2"
        >
          {[
            { id: 'overview' as TabType, label: 'Visão Geral', icon: Eye },
            { id: 'guests' as TabType, label: 'Convidados', icon: Users },
            { id: 'gifts' as TabType, label: 'Presentes', icon: GiftIcon },
            { id: 'share' as TabType, label: 'Compartilhar', icon: Share2 },
            { id: 'settings' as TabType, label: 'Configurações', icon: Settings },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'bg-surface border border-border text-text-primary hover:border-border-strong',
                )}
              >
                <IconComponent size={18} />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* Overview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent RSVPs */}
                <Card padding="lg">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary font-display flex items-center gap-2">
                      <MessageCircle size={20} />
                      RSVPs Recentes
                    </h3>
                    {recentRSVPs.length > 0 ? (
                      <div className="space-y-0">
                        {recentRSVPs.map((guest) => (
                          <RecentRSVPItem
                            key={guest.id}
                            guest={guest}
                            rsvpTime={formatRelativeTime(guest.rsvp_at || '')}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="Nenhum RSVP ainda"
                        description="Aguardando confirmação dos convidados"
                        className="py-6"
                      />
                    )}
                  </div>
                </Card>

                {/* Recent Gift Reservations */}
                <Card padding="lg">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary font-display flex items-center gap-2">
                      <GiftIcon size={20} />
                      Presentes Reservados
                    </h3>
                    {recentGiftReservations.length > 0 ? (
                      <div className="space-y-3">
                        {recentGiftReservations.map((gift) => (
                          <div
                            key={gift.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary truncate">
                                {gift.name}
                              </p>
                              <p className="text-xs text-text-muted mt-1">
                                Reservado por {gift.reserved_by}
                              </p>
                            </div>
                            <Badge variant="info" size="sm">
                              {formatCurrency(gift.price ?? 0)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="Nenhum presente reservado"
                        description="Aguardando reservas dos convidados"
                        className="py-6"
                      />
                    )}
                  </div>
                </Card>
              </div>

              {/* Summary Cards */}
              <Card padding="lg" className="bg-gradient-to-r from-surface to-surface-hover">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
                      Confirmações
                    </p>
                    <p className="text-2xl font-bold text-success font-display">
                      {confirmedCount}/{totalGuests}
                    </p>
                    <p className="text-xs text-text-muted mt-2">
                      {totalGuests > 0
                        ? `${Math.round((confirmedCount / totalGuests) * 100)}% confirmado`
                        : 'Nenhum convidado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
                      Acompanhantes
                    </p>
                    <p className="text-2xl font-bold text-blue-400 font-display">
                      +{totalPlusOnes}
                    </p>
                    <p className="text-xs text-text-muted mt-2">
                      Pessoas extras confirmadas
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
                      Presentes
                    </p>
                    <p className="text-2xl font-bold text-accent-pink font-display">
                      {reservedGifts}/{totalGifts}
                    </p>
                    <p className="text-xs text-text-muted mt-2">
                      Presentes reservados
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'guests' && (
            <motion.div
              key="guests"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <Card padding="lg">
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-gradient-to-r from-surface to-surface-hover p-4 rounded-lg border border-border">
                    <p className="text-sm text-text-primary">
                      <span className="font-semibold text-accent-pink">
                        {confirmedCount}
                      </span>
                      {' '}
                      confirmados de
                      {' '}
                      <span className="font-semibold">{totalGuests}</span>
                      {' '}
                      convidados
                      <span className="text-text-muted ml-2">
                        (
                        {totalGuests > 0
                          ? Math.round((confirmedCount / totalGuests) * 100)
                          : 0}
                        %)
                      </span>
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="flex gap-2 flex-wrap">
                    {(['all', 'confirmed', 'pending', 'declined'] as const).map(
                      (status) => (
                        <motion.button
                          key={status}
                          onClick={() => setGuestFilter(status)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                            guestFilter === status
                              ? 'bg-gradient-primary text-white'
                              : 'bg-surface border border-border text-text-primary hover:border-border-strong',
                          )}
                        >
                          {status === 'all'
                            ? 'Todos'
                            : status === 'confirmed'
                              ? 'Confirmados'
                              : status === 'pending'
                                ? 'Pendentes'
                                : 'Recusados'}
                        </motion.button>
                      ),
                    )}
                  </div>

                  {/* Guests List */}
                  {filteredGuests.length > 0 ? (
                    <div className="space-y-2">
                      <div className="hidden sm:grid grid-cols-12 gap-4 text-xs text-text-muted uppercase tracking-wide pb-3 border-b border-border px-4">
                        <div className="col-span-4">Convidado</div>
                        <div className="col-span-2">Status RSVP</div>
                        <div className="col-span-2">Acompanhantes</div>
                        <div className="col-span-4">Data de Confirmação</div>
                      </div>
                      {filteredGuests.map((guest) => {
                        const statusColorMap: Record<
                          RSVPStatus,
                          'success' | 'warning' | 'error' | 'pending'
                        > = {
                          confirmed: 'success',
                          pending: 'pending',
                          declined: 'error',
                          maybe: 'warning',
                        };

                        return (
                          <motion.div
                            key={guest.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-0 items-center p-4 rounded-lg bg-surface border border-border hover:border-border-strong transition-colors"
                          >
                            {/* Guest Info */}
                            <div className="col-span-1 sm:col-span-4 flex items-center gap-3">
                              <Avatar name={guest.name} size="sm" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                  {guest.name}
                                </p>
                                <p className="text-xs text-text-muted truncate">
                                  {guest.email}
                                </p>
                              </div>
                            </div>

                            {/* RSVP Status */}
                            <div className="col-span-1 sm:col-span-2 flex items-center gap-2">
                              <span className="sm:hidden text-xs text-text-muted">
                                Status:
                              </span>
                              <Badge
                                variant={statusColorMap[guest.rsvp_status as RSVPStatus]}
                                size="sm"
                              >
                                {getRSVPStatusLabel(guest.rsvp_status)}
                              </Badge>
                            </div>

                            {/* Plus Ones */}
                            <div className="col-span-1 sm:col-span-2">
                              <span className="sm:hidden text-xs text-text-muted">
                                Acompanhantes:
                              </span>
                              <p className="text-sm text-text-primary">
                                +{guest.plus_ones || 0}
                              </p>
                            </div>

                            {/* RSVP Date */}
                            <div className="col-span-1 sm:col-span-4">
                              <span className="sm:hidden text-xs text-text-muted">
                                Confirmação:
                              </span>
                              <p className="text-sm text-text-muted">
                                {guest.rsvp_at
                                  ? formatDate(guest.rsvp_at, false)
                                  : '-'}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      title="Nenhum convidado neste filtro"
                      description="Tente mudar os filtros para ver convidados"
                    />
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'gifts' && (
            <motion.div
              key="gifts"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* Summary */}
              <Card padding="lg" className="bg-gradient-to-r from-surface to-surface-hover">
                <p className="text-sm text-text-primary">
                  <span className="font-semibold text-accent-pink">
                    {reservedGifts}
                  </span>
                  {' '}
                  de
                  {' '}
                  <span className="font-semibold">{totalGifts}</span>
                  {' '}
                  presentes reservados
                  {' '}
                  <span className="text-text-muted">
                    •
                    {' '}
                    {formatCurrency(totalGiftValue)} estimado
                  </span>
                </p>
              </Card>

              {/* Gifts Grid */}
              {eventGifts.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {eventGifts.map((gift) => (
                    <motion.div
                      key={gift.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <GiftCardComponent gift={gift} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  title="Nenhum presente adicionado"
                  description="Comece adicionando presentes para seus convidados"
                  actionLabel="Adicionar Presente"
                />
              )}
            </motion.div>
          )}

          {activeTab === 'share' && (
            <motion.div
              key="share"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* QR Code Section */}
              <Card padding="lg">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-text-primary font-display flex items-center gap-2">
                    <QrCodeIcon size={20} />
                    Código QR
                  </h3>

                  {isGeneratingQR ? (
                    <div className="flex items-center justify-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-8 h-8 border-2 border-accent-pink border-t-transparent rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6">
                      {qrCodeUrl && (
                        <div className="p-6 bg-white rounded-2xl shadow-lg">
                          <img
                            src={qrCodeUrl}
                            alt="Event QR Code"
                            className="w-48 h-48"
                          />
                        </div>
                      )}

                      <Button
                        onClick={handleDownloadQR}
                        variant="primary"
                        icon={<Download size={18} />}
                      >
                        Baixar QR Code
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* URL Section */}
              <Card padding="lg">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary font-display flex items-center gap-2">
                    <Globe size={20} />
                    Link do Evento
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={eventPageUrl}
                      readOnly
                      className="flex-1 px-4 py-3 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none cursor-text"
                    />
                    <Button
                      onClick={handleCopyUrl}
                      variant="secondary"
                      icon={<Copy size={18} />}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
              </Card>

              {/* WhatsApp Section */}
              <Card padding="lg">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary font-display flex items-center gap-2">
                    <MessageCircle size={20} />
                    Compartilhar no WhatsApp
                  </h3>

                  <Button
                    onClick={handleShareWhatsApp}
                    variant="primary"
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A]"
                  >
                    Enviar via WhatsApp
                  </Button>

                  {/* WhatsApp Preview */}
                  <Card variant="default" padding="md" className="bg-white/5">
                    <div className="space-y-3">
                      <p className="text-xs text-text-muted uppercase tracking-wide">
                        Prévia
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-text-primary">
                          {event.title}
                        </div>
                        <div className="text-text-secondary text-xs line-clamp-2">
                          {event.description}
                        </div>
                        <div className="text-accent-pink font-medium text-xs">
                          {eventPageUrl}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* Feature Toggles */}
              <Card padding="lg">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-text-primary font-display">
                    Configurações de Recursos
                  </h3>

                  {[
                    {
                      key: 'allow_plus_ones',
                      label: 'Permitir Acompanhantes',
                      description: 'Convidados podem trazer mais pessoas',
                      icon: Users,
                      value: event.allow_plus_ones,
                    },
                    {
                      key: 'ask_dietary_restrictions',
                      label: 'Perguntar Restrições Alimentares',
                      description: 'Coletar informações de restrições dietéticas',
                      icon: AlertCircle,
                      value: event.ask_dietary_restrictions,
                    },
                    {
                      key: 'pix_enabled',
                      label: 'Ativar PIX',
                      description: 'Permitir contribuições via PIX',
                      icon: AlertCircle,
                      value: event.pix_enabled,
                    },
                    {
                      key: 'photo_wall_enabled',
                      label: 'Mural de Fotos',
                      description: 'Permitir upload de fotos do evento',
                      icon: Camera,
                      value: event.photo_wall_enabled,
                    },
                    {
                      key: 'message_board_enabled',
                      label: 'Quadro de Mensagens',
                      description: 'Permitir que convidados deixem mensagens',
                      icon: MessageSquareText,
                      value: event.message_board_enabled,
                    },
                  ].map((setting) => {
                    const IconComponent = setting.icon;
                    return (
                      <div
                        key={setting.key}
                        className="flex items-start justify-between p-4 rounded-lg bg-surface border border-border hover:border-border-strong transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-accent-pink mt-1">
                            <IconComponent size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {setting.label}
                            </p>
                            <p className="text-xs text-text-muted mt-1">
                              {setting.description}
                            </p>
                          </div>
                        </div>

                        {/* Toggle Switch */}
                        <motion.button
                          onClick={() => handleToggleSetting(setting.label)}
                          className={cn(
                            'relative inline-flex h-8 w-14 items-center rounded-full transition-colors ml-4 flex-shrink-0',
                            setting.value
                              ? 'bg-gradient-primary'
                              : 'bg-surface-hover border border-border',
                          )}
                        >
                          <motion.div
                            layout
                            className="h-6 w-6 rounded-full bg-white shadow-md"
                            initial={false}
                            animate={{
                              x: setting.value ? 28 : 4,
                            }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Danger Zone */}
              <Card padding="lg" className="border-error/30 bg-error/5">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-error font-display flex items-center gap-2">
                    <AlertCircle size={20} />
                    Zona de Perigo
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-surface/50 border border-border">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          Arquivar Evento
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          O evento será movido para o arquivo e não será mais
                          visível
                        </p>
                      </div>
                      <Button
                        onClick={handleArchiveEvent}
                        variant="ghost"
                        size="sm"
                        icon={<Archive size={18} />}
                      >
                        Arquivar
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-surface/50 border border-error/30">
                      <div>
                        <p className="text-sm font-medium text-error">
                          Deletar Evento
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          Esta ação não pode ser desfeita. Todos os dados serão
                          removidos permanentemente.
                        </p>
                      </div>
                      <Button
                        onClick={() => setIsDeleteModalOpen(true)}
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={18} />}
                      >
                        Deletar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Deletar Evento"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-text-primary">
              Você tem certeza que deseja deletar{' '}
              <span className="font-semibold">"{event.title}"</span>?
            </p>
            <p className="text-sm text-error">
              Esta ação não pode ser desfeita. Todos os dados, convidados e
              presentes serão removidos permanentemente.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              variant="secondary"
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteEvent}
              variant="danger"
              fullWidth
              icon={<Trash2 size={18} />}
            >
              Deletar Evento
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
