'use client';

import type { Event } from '@/types';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Shirt, FileText, ExternalLink } from 'lucide-react';
import { formatEventDate } from '@/lib/date-format';

interface EventDetailsProps {
  event: Event;
}

export function EventDetails({ event }: EventDetailsProps) {
  const googleMapsUrl = event.location_address
    ? `https://www.google.com/maps/search/${encodeURIComponent(event.location_address)}`
    : undefined;

  const details = [
    {
      icon: Calendar,
      label: 'Data e Hora',
      value: formatEventDate(event.event_date, true),
      gradient: 'from-accent-pink to-accent-coral',
    },
    {
      icon: MapPin,
      label: 'Local',
      value: event.location_name || '',
      subValue: event.location_address,
      link: googleMapsUrl,
      linkText: 'Abrir no mapa',
      gradient: 'from-blue-400 to-indigo-500',
    },
    ...(event.dress_code ? [{
      icon: Shirt,
      label: 'Dress Code',
      value: event.dress_code,
      gradient: 'from-accent-purple to-violet-500',
    }] : []),
    ...(event.observations ? [{
      icon: FileText,
      label: 'Observacoes',
      value: event.observations,
      gradient: 'from-accent-gold to-amber-500',
    }] : []),
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      viewport={{ once: true, margin: '-80px' }}
      className="py-16 sm:py-20 px-4 sm:px-6 bg-bg-primary"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold font-display text-center mb-10"
        >
          Detalhes do Evento
        </motion.h2>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden">
          {details.map((detail, idx) => {
            const Icon = detail.icon;
            return (
              <motion.div
                key={detail.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-start gap-4 p-5 sm:p-6 ${idx > 0 ? 'border-t border-white/[0.04]' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${detail.gradient} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                    {detail.label}
                  </p>
                  <p className="text-base sm:text-lg text-text-primary font-medium">
                    {detail.value}
                  </p>
                  {'subValue' in detail && detail.subValue && (
                    <p className="text-sm text-text-secondary mt-1">{detail.subValue as string}</p>
                  )}
                  {'link' in detail && detail.link && (
                    <a
                      href={detail.link as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent-pink hover:text-accent-pink/80 text-sm font-semibold mt-2 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {('linkText' in detail ? detail.linkText : 'Abrir') as string}
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
