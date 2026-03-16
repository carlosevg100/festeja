import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Festeja — Organize sua festa perfeita',
  description:
    'Crie convites lindos, gerencie a lista de presentes inteligente e organize RSVPs automaticamente. Tudo em um só lugar para sua festa ser inesquecível.',
  openGraph: {
    title: 'Festeja — Organize sua festa perfeita',
    description:
      'Crie convites lindos, gerencie a lista de presentes inteligente e organize RSVPs automaticamente.',
    siteName: 'Festeja',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-bg-primary text-text-primary antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
