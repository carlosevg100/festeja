'use client';

import type { Event } from '@/types';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Shirt,
  FileText,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatEventDate } from '@/lib/date-format';

interface EventDetailsProps {
  event: Event;
}

export function EventDetails({ event }: EventDetailsProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const googleMapsUrl = event.location_address
    ? `https://www.google.com/maps/search/${encodeURIComponent(event.location_address)}`
    : undefined;

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-bg-primary"
    >
      <div className="max-w-4xl mx-auto">
        {/* Glassmorphism Card */}
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 sm:p-8 space-y-6 sm:space-y-8">
          {/* Date & Time */}
          <motion.div
            variants={itemVariants}
            className="flex items-start gap-4"
          >
            <div className="p-3 rounded-lg bg-accent-pink/10 flex-shrink-0 mt-0.5">
              <Calendar className="w-5 h-5 text-accent-pink" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">
                Data e Hora
              </h3>
              <p className="text-lg sm:text-xl text-white font-medium">
                {formatEventDate(event.event_date, true)}
              </p>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            variants={itemVariants}
            className="flex items-start gap-4"
          >
            <div className="p-3 rounded-lg bg-blue-500/10 flex-shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">
                Local
              </h3>
              <p className="text-lg sm:text-xl text-white font-medium mb-2">
                {event.location_name}
              </p>
              <p className="text-text-secondary text-sm sm:text-base mb-3">
                {event.location_address}
              </p>
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-accent-pink hover:text-accent-pink/80 transition-colors text-sm font-semibold"
                >
                  Ver no mapa →
                </a>
              )}
            </div>
          </motion.div>

          {/* Dress Code */}
          {event.dress_code && (
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-4"
            >
              <div className="p-3 rounded-lg bg-purple-500/10 flex-shrink-0 mt-0.5">
                <Shirt className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Dress Code
                </h3>
                <Badge variant="info" size="md">
                  {event.dress_code}
                </Badge>
              </div>
            </motion.div>
          )}

          {/* Observations */}
          {event.observations && (
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-4 pt-2"
            >
              <div className="p-3 rounded-lg bg-yellow-500/10 flex-shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Observações
                </h3>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  {event.observations}
                </p>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </motion.section>
  );
}
