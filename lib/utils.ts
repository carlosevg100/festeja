import { Countdown } from '@/types';

/**
 * Merge Tailwind CSS classes safely
 * Uses manual template literal concatenation for class merging
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter(
      (cls): cls is string =>
        typeof cls === 'string' && cls.length > 0,
    )
    .join(' ');
}

/**
 * Format date to Brazilian Portuguese format
 * PT-BR: dd/mm/yyyy HH:mm
 */
export function formatDate(
  date: Date | string,
  includeTime = true,
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  if (!includeTime) {
    return `${day}/${month}/${year}`;
  }

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Format currency to Brazilian Real (BRL)
 * Format: R$ 1.234,56
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate a URL-safe slug from title + short random ID
 * Example: "Festa da Maria" -> "festa-da-maria-abc123"
 */
export function generateSlug(title: string): string {
  const sanitized = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  const nanoidShort = Math.random()
    .toString(36)
    .substring(2, 8);

  return `${sanitized}-${nanoidShort}`;
}

/**
 * Calculate countdown to a date
 * Returns days, hours, minutes, seconds and isOver flag
 */
export function getCountdown(targetDate: Date | string): Countdown {
  const target = typeof targetDate === 'string'
    ? new Date(targetDate)
    : targetDate;
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isOver: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isOver: false,
  };
}

/**
 * Get initials from a full name
 * Example: "Maria Silva" -> "MS"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Truncate text to a maximum length with ellipsis
 * Example: truncate("Hello World", 5) -> "Hello..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Calculate gift contribution progress
 */
export function calculateGiftProgress(
  raised: number,
  goal: number,
): { percentage: number; remaining: number } {
  const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const remaining = Math.max(goal - raised, 0);

  return {
    percentage,
    remaining,
  };
}

/**
 * Format relative time (e.g., "há 2 horas", "em 3 dias")
 * PT-BR relative dates
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'agora mesmo';
  if (minutes < 60) return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  if (hours < 24) return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (days < 7) return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;

  return formatDate(d, false);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getTime() > new Date().getTime();
}

/**
 * Format event type label in Portuguese
 */
export function getEventTypeLabel(eventType: string): string {
  const labels: Record<string, string> = {
    birthday: 'Aniversário',
    baby_shower: 'Chá de Bebê',
    quinceanera: 'Quinze Anos',
    corporate: 'Corporativo',
    other: 'Outro',
  };

  return labels[eventType] || eventType;
}

/**
 * Format gift type label in Portuguese
 */
export function getGiftTypeLabel(giftType: string): string {
  const labels: Record<string, string> = {
    product: 'Produto',
    quota: 'Cota de Presente',
    experience: 'Experiência',
    pix: 'PIX',
  };

  return labels[giftType] || giftType;
}

/**
 * Format RSVP status label in Portuguese
 */
export function getRSVPStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    declined: 'Recusado',
    maybe: 'Talvez',
  };

  return labels[status] || status;
}
