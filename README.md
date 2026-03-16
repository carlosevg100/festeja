# Festeja — Organize sua festa perfeita 🎉

O iCasei das festas. Só que para tudo.

Uma plataforma premium para organizar qualquer tipo de festa — aniversários infantis, chás de bebê, festas de 15 anos e mais. Convites lindos, lista de presentes inteligente, RSVP automático. Tudo em um só lugar.

## Stack Técnico

- **Framework**: Next.js 14 (App Router, Server Components)
- **Linguagem**: TypeScript (strict mode)
- **Estilo**: TailwindCSS 3 + Framer Motion
- **Backend**: Supabase (Auth, PostgreSQL, Storage, Realtime)
- **Validação**: Zod
- **Ícones**: Lucide React
- **Deploy**: Vercel-ready

## Setup

### 1. Clone e instale

```bash
git clone <repo-url>
cd festeja
npm install
```

### 2. Configure o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Rode o SQL migration em `supabase/migrations/001_initial_schema.sql`
3. Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Festeja
```

### 3. Rode localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

**Nota:** O app roda com mock data por padrão. Para conectar ao Supabase real, substitua as credenciais no `.env.local`.

## Estrutura do Projeto

```
/app
  /(public)/festa/[slug]    → Página pública do evento (convidados)
  /(auth)/dashboard          → Dashboard do organizador
  /(auth)/dashboard/event/new → Wizard de criação de evento
  /(auth)/dashboard/event/[id] → Gerenciar evento
  /login                     → Autenticação
  /page.tsx                  → Landing page
/components
  /ui/                       → Design system
  /event/                    → Componentes de evento
/lib
  /supabase/                 → Clientes Supabase
  /mock-data.ts              → Dados mock para desenvolvimento
  /utils.ts                  → Utilidades
  /validations.ts            → Schemas Zod
/types                       → TypeScript types
/supabase/migrations         → SQL migrations
```

## Features do MVP

- ✅ Landing page premium com animações
- ✅ Autenticação (Magic Link + Google OAuth)
- ✅ Dashboard do organizador
- ✅ Wizard de criação de evento (5 steps)
- ✅ Página pública do evento com:
  - Hero com countdown ao vivo
  - Detalhes do evento com mapa
  - RSVP com confetti animation
  - Lista de presentes (produto, cota, experiência, Pix)
  - Mural de recados
- ✅ Gestão de evento (convidados, presentes, compartilhar, configurações)
- ✅ QR Code para compartilhamento
- ✅ Integração WhatsApp (deep links + Open Graph)
- ✅ Design system completo (15+ componentes)
- ✅ Dark theme premium
- ✅ Mobile-first responsivo
- ✅ TypeScript strict mode
- ✅ Supabase migrations com RLS

## Próximos Passos (Pós-MVP)

- [ ] Conectar Supabase real (auth + database)
- [ ] AI Invite Generator (Claude API)
- [ ] Integração Pix real (Mercado Pago / Asaas)
- [ ] Affiliate links com lojas
- [ ] Push notifications / WhatsApp API
- [ ] App nativo (React Native)

## Deploy (Vercel)

```bash
npm run build  # Verifica build
vercel          # Deploy
```

---

Feito com 💖 por Olpi Technologies
