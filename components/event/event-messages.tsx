'use client';

import { useState } from 'react';
import type { Event, EventMessage } from '@/types';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { getInitials, formatRelativeTime } from '@/lib/utils';
import { mockMessages } from '@/lib/mock-data';

interface EventMessagesProps {
  event: Event;
}

interface MessageFormState {
  name: string;
  message: string;
}

export function EventMessages({ event }: EventMessagesProps) {
  const [formData, setFormData] = useState<MessageFormState>({
    name: '',
    message: '',
  });
  const [messages, setMessages] = useState<EventMessage[]>(
    mockMessages.filter((m) => m.event_id === event.id),
  );

  const handleSendMessage = () => {
    if (!formData.name.trim() || !formData.message.trim()) return;

    const newMessage: EventMessage = {
      id: Math.random().toString(36).substr(2, 9),
      event_id: event.id,
      author_name: formData.name,
      message: formData.message,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [newMessage, ...prev]);
    setFormData({ name: '', message: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-bg-secondary"
    >
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <motion.div
          className="flex items-center gap-3 mb-10 justify-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <MessageSquare className="w-8 h-8 text-accent-pink" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Mural de Recados
          </h2>
        </motion.div>

        {/* Message Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <Card className="bg-surface border border-border p-6 sm:p-8 space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Seu Nome
              </label>
              <Input
                type="text"
                placeholder="João Silva"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-bg-primary border-border text-white placeholder:text-text-muted"
              />
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Sua Mensagem
              </label>
              <Textarea
                placeholder="Escreva uma mensagem especial..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="bg-bg-primary border-border text-white placeholder:text-text-muted min-h-24 resize-none"
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!formData.name.trim() || !formData.message.trim()}
              className="w-full sm:w-auto ml-auto flex items-center gap-2 py-2.5 px-6 font-semibold bg-gradient-primary hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Send className="w-4 h-4" />
              Enviar
            </Button>
          </Card>
        </motion.div>

        {/* Messages Feed */}
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {messages.length === 0 ? (
            <motion.div
              variants={messageVariants}
              className="text-center py-12"
            >
              <MessageSquare className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
              <p className="text-text-muted text-lg">
                Nenhuma mensagem ainda. Seja o primeiro a deixar um recado!
              </p>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                variants={messageVariants}
              >
                <Card className="bg-surface border border-border p-4 sm:p-6 hover:border-accent-pink/30 transition-colors duration-300">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar
                        initials={getInitials(msg.author_name)}
                        size="md"
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm sm:text-base">
                          {msg.author_name}
                        </p>
                        <p className="text-xs sm:text-sm text-text-muted">
                          {formatRelativeTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Text */}
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed break-words">
                    {msg.message}
                  </p>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
