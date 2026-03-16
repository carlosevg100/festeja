// Re-export database types
export type {
  Database,
  User,
  Event,
  Guest,
  Gift,
  GiftContribution,
  EventPhoto,
  EventMessage,
  EventInsert,
  EventUpdate,
  GuestInsert,
  GuestUpdate,
  GiftInsert,
  GiftUpdate,
  GiftContributionInsert,
} from './database';

// App-level enums and types
export enum EventType {
  BIRTHDAY = 'birthday',
  BABY_SHOWER = 'baby_shower',
  QUINCEANERA = 'quinceanera',
  CORPORATE = 'corporate',
  OTHER = 'other',
}

export enum RSVPStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
  MAYBE = 'maybe',
}

export enum GiftType {
  PRODUCT = 'product',
  QUOTA = 'quota',
  EXPERIENCE = 'experience',
  PIX = 'pix',
}

export enum GiftStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  PURCHASED = 'purchased',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
}

export interface EventWizardData {
  title: string;
  eventType: EventType;
  honoree_name: string;
  honoree_age?: number;
  event_date: Date;
  event_end_date?: Date;
  location_name?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  theme?: string;
  color_primary: string;
  color_secondary: string;
  dress_code?: string;
  observations?: string;
  max_guests?: number;
  allow_plus_ones: boolean;
  ask_dietary_restrictions: boolean;
  pix_enabled: boolean;
  photo_wall_enabled: boolean;
  message_board_enabled: boolean;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

export interface GiftProgress {
  raised: number;
  goal: number;
  percentage: number;
  remaining: number;
}

export type EventTypeLabel = {
  [key in EventType]: string;
};

export type GiftTypeLabel = {
  [key in GiftType]: string;
};
