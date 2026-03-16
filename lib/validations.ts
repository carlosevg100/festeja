import { z } from 'zod';

// Event schema
export const eventSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(100),
  description: z.string().max(1000).optional(),
  event_type: z.enum(['birthday', 'baby_shower', 'quinceanera', 'corporate', 'other']),
  honoree_name: z.string().min(2, 'Nome do homenageado é obrigatório').max(100),
  honoree_age: z.number().int().min(0).max(150).optional(),
  event_date: z.date(),
  event_end_date: z.date().optional(),
  location_name: z.string().max(100).optional(),
  location_address: z.string().max(255).optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  theme: z.string().max(100).optional(),
  color_primary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor primária deve ser um código hex válido').default('#FF6B9D'),
  color_secondary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor secundária deve ser um código hex válido').default('#C44569'),
  dress_code: z.string().max(100).optional(),
  observations: z.string().max(1000).optional(),
  max_guests: z.number().int().min(1).optional(),
  allow_plus_ones: z.boolean().default(true),
  ask_dietary_restrictions: z.boolean().default(false),
  pix_enabled: z.boolean().default(false),
  photo_wall_enabled: z.boolean().default(true),
  message_board_enabled: z.boolean().default(true),
});

export type EventSchemaType = z.infer<typeof eventSchema>;

// Guest RSVP schema
export const guestRsvpSchema = z.object({
  event_id: z.string().uuid(),
  name: z.string().min(2, 'Nome é obrigatório').max(100),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  rsvp_status: z.enum(['pending', 'confirmed', 'declined', 'maybe']),
  plus_ones: z.number().int().min(0).max(10).default(0),
  dietary_restrictions: z.string().max(255).optional(),
  notes: z.string().max(500).optional(),
});

export type GuestRsvpSchemaType = z.infer<typeof guestRsvpSchema>;

// Gift schema
export const giftSchema = z.object({
  event_id: z.string().uuid(),
  name: z.string().min(3, 'Nome do presente deve ter pelo menos 3 caracteres').max(100),
  description: z.string().max(500).optional(),
  image_url: z.string().url('URL da imagem deve ser válida').optional().or(z.literal('')),
  price: z.number().positive('Preço deve ser maior que zero').optional(),
  product_url: z.string().url('URL do produto deve ser válida').optional().or(z.literal('')),
  store_name: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
  gift_type: z.enum(['product', 'quota', 'experience', 'pix']),
  is_group_gift: z.boolean().default(false),
  group_goal: z.number().positive('Meta deve ser maior que zero').optional(),
  priority: z.number().int().min(0).default(0),
});

export type GiftSchemaType = z.infer<typeof giftSchema>;

// Gift contribution schema
export const giftContributionSchema = z.object({
  gift_id: z.string().uuid(),
  contributor_name: z.string().min(2, 'Nome do contribuidor é obrigatório').max(100),
  amount: z.number().positive('Valor da contribuição deve ser maior que zero'),
  payment_method: z.string().max(50).optional(),
  payment_status: z.enum(['pending', 'completed', 'failed']).default('pending'),
});

export type GiftContributionSchemaType = z.infer<typeof giftContributionSchema>;

// Message schema
export const messageSchema = z.object({
  event_id: z.string().uuid(),
  author_name: z.string().min(2, 'Nome do autor é obrigatório').max(100),
  message: z.string().min(1, 'Mensagem não pode estar vazia').max(500, 'Mensagem não pode ter mais de 500 caracteres'),
});

export type MessageSchemaType = z.infer<typeof messageSchema>;

// Guest invite/create schema
export const guestCreateSchema = z.object({
  event_id: z.string().uuid(),
  name: z.string().min(2, 'Nome é obrigatório').max(100),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
});

export type GuestCreateSchemaType = z.infer<typeof guestCreateSchema>;

// User profile update schema
export const userProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().max(20).optional(),
  avatar_url: z.string().url('URL de avatar deve ser válida').optional().or(z.literal('')),
  pix_key: z.string().max(255).optional(),
});

export type UserProfileSchemaType = z.infer<typeof userProfileSchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

// Sign up schema
export const signUpSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'As senhas não correspondem',
  path: ['passwordConfirm'],
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
