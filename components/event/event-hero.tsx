'use client';

import { useEffect, useState } from 'react';
import type { Event } from '@/types';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCountdown, getEventTypeLabel } from '@/lib/utils';
import type { Countdown } from '@/types';

interface EventHeroProps {
  event: Event;
}

export function EventHero({ event }: EventHeroProps) {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    setCountdown(getCountdown(event.event_date));

    const interval = setInterval(() => {
      setCountdown(getCountdown(event.event_date));
    }, 1000);

    return () => clearInterval(interval);
  }, [event.event_date]);

  const getEventTypeEmoji = (type: string): string => {
    const emojis: Record<string, string> = {
      birthday: '🎂',
      baby_shower: '👶',
      quinceanera: '💃',
      corporate: '🎉',
      other: '🎊',
    };
    return emojis[type] || '🎉';
  };

  const bgGradient = {
    backgroundImage: event.cover_image_url
      ? `linear-gradient(135deg, ${event.color_primary}40 0%, ${event.color_secondary}40 100%), url(${event.cover_image_url})`
      : `linear-gradient(135deg, ${event.color_primary} 0%, ${event.color_secondary} 100%)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const chevronVariants = {
    animate: {
      y: [0, 8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  const CountdownBox = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center"
    >
      <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 sm:px-6 sm:py-4 text-center">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display">
          {String(value).padStart(2, '0')}
        </div>
        <div className="text-xs sm:text-sm text-white/80 mt-1 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-end overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={bgGradient}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full px-4 sm:px-6 pb-16 sm:pb-20 md:pb-24 max-w-4xl mx-auto text-center"
      >
        {/* Event Type Badge */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <Badge variant="accent" size="md" className="inline-block">
            {getEventTypeEmoji(event.event_type)} {getEventTypeLabel(event.event_type)}
          </Badge>
        </motion.div>

        {/* Event Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 font-display tracking-tight"
        >
          {event.title}
        </motion.h1>

        {/* Honoree Info */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12"
        >
          {event.honoree_age !== null && event.honoree_age !== undefined
            ? `${event.honoree_name} faz ${event.honoree_age} anos!`
            : `Celebrando ${event.honoree_name}!`}
        </motion.p>

        {/* Countdown */}
        {!countdown.isOver ? (
          <motion.div
            variants={itemVariants}
            className="mb-10 sm:mb-14"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 justify-center">
              <CountdownBox value={countdown.days} label="Dias" />
              <CountdownBox value={countdown.hours} label="Horas" />
              <CountdownBox value={countdown.minutes} label="Min" />
              <CountdownBox value={countdown.seconds} label="Seg" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="mb-10 sm:mb-14"
          >
            <div className="inline-block bg-black/60 backdrop-blur-md border border-white/20 rounded-lg px-8 py-4">
              <p className="text-xl text-white font-semibold">
                A festa já começou! 🎉
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        variants={chevronVariants}
        animate="animate"
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <ChevronDown className="w-8 h-8 text-white/60 drop-shadow-lg" />
      </motion.div>
    </div>
  );
}
