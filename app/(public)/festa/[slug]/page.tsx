import type { Metadata } from 'next';
import { mockEvents } from '@/lib/mock-data';
import { EventHero } from '@/components/event/event-hero';
import { EventDetails } from '@/components/event/event-details';
import { EventRSVP } from '@/components/event/event-rsvp';
import { EventGiftList } from '@/components/event/event-gift-list';
import { EventMessages } from '@/components/event/event-messages';
import { EventFooter } from '@/components/event/event-footer';

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string) {
  // In a real app, fetch from database by slug
  // For now, use mock data - fallback to first event or find by slug
  const event = mockEvents.find((e) => e.slug === slug) || mockEvents[0];
  return event;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  const title = event.title;
  const description = `${event.honoree_name} te convidou! Confirme sua presença e conheça a lista de presentes.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: event.cover_image_url
        ? [
            {
              url: event.cover_image_url,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  return (
    <div className="w-full">
      <EventHero event={event} />
      <EventDetails event={event} />
      <EventRSVP event={event} />
      <EventGiftList event={event} />
      <EventMessages event={event} />
      <EventFooter />
    </div>
  );
}
