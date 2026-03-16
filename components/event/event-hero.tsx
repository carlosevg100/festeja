'use client';

import { useEffect, useState } from 'react';
import type { Event } from '@/types';
import { motion } from 'framer-motion';
import { Cake, Baby, Crown, GraduationCap, PartyPopper } from 'lucide-react';
import { getCountdown, getEventTypeLabel } from '@/lib/utils';
import type { Countdown } from '@/types';

interface EventHeroProps {
  event: Event;
}

const eventTypeIcons: Record<string, any> = {
  birthday: Cake,
  baby_shower: Baby,
  quinceanera: Crown,
  corporate: GraduationCap,
  other: PartyPopper,
};

export function EventHero({ event }: EventHeroProps) {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false,
  });

  useEffect(() => {
    setCountdown(getCountdown(event.event_date));
    const interval = setInterval(() => {
      setCountdown(getCountdown(event.event_date));
    }, 1000);
    return () => clearInterval(interval);
  }, [event.event_date]);

  const Icon = eventTypeIcons[event.event_type] || PartyPopper;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: event.cover_image_url
            ? `url(${event.cover_image_url})`
            : `linear-gradient(135deg, ${event.color_primary || '#FF6B9D'} 0%, ${event.color_secondary || '#A855F7'} 50%, ${event.color_primary || '#FF6B9D'}80 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay layers */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary" />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-[10%] w-2 h-2 rounded-full bg-white/20"
      />
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/3 right-[15%] w-3 h-3 rounded-full bg-white/10"
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full px-4 sm:px-6 max-w-3xl mx-auto text-center"
      >
        {/* Type badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white/90 border border-white/10">
            <Icon className="w-3.5 h-3.5" />
            {getEventTypeLabel(event.event_type)}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 font-display tracking-tight leading-[1.05]"
        >
          {event.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-lg sm:text-xl md:text-2xl text-white/80 mb-12 font-light">
          {event.honoree_age !== null && event.honoree_age !== undefined
            ? `${event.honoree_name} faz ${event.honoree_age} anos!`
            : `Celebrando ${event.honoree_name}`}
        </motion.p>

        {/* Countdown */}
        {!countdown.isOver ? (
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-3 sm:gap-5">
              {[
                { value: countdown.days, label: 'dias' },
                { value: countdown.hours, label: 'hrs' },
                { value: countdown.minutes, label: 'min' },
                { value: countdown.seconds, label: 'seg' },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-3 sm:gap-5">
                  <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                      <span className="text-2xl sm:text-3xl font-bold text-white font-display tabular-nums">
                        {String(item.value).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-medium">
                      {item.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <span className="text-white/20 text-2xl font-light mb-5 hidden sm:block">:</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">
              <PartyPopper className="w-5 h-5 text-yellow-400" />
              <span className="text-lg text-white font-semibold">A festa ja comecou!</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-8 h-12 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-white/50 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
