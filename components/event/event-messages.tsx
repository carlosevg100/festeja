'use client';

import { useState } from 'react';
import type { Event, EventMessage } from '@/types';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { getInitials, formatRelativeTime } from '@/lib/utils';
import { mockMessages } from '@/lib/mock-data';

interface EventMessagesProps {
  event: Event;
}

export function EventMessages({ event }: EventMessagesProps) {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [messages, setMessages] = useState<EventMessage[]>(
    mockMessages.filter((m) => m.event_id === event.id)
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: '-80px' }}
      className="py-16 sm:py-20 px-4 sm:px-6 bg-bg-secondary"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-purple to-violet-500 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">Mural de Recados</h2>
          <p className="text-sm text-text-secondary">Deixe uma mensagem especial</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2">Seu Nome</label>
              <Input
                type="text"
                placeholder="Joao Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2">Mensagem</label>
              <Textarea
                placeholder="Escreva uma mensagem especial..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="min-h-24"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSendMessage}
                disabled={!formData.name.trim() || !formData.message.trim()}
                icon={<Send className="w-4 h-4" />}
              >
                Enviar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-text-muted/20 mx-auto mb-3" />
              <p className="text-text-muted text-sm">Seja o primeiro a deixar um recado!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
              >
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 sm:p-5 hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-white">{getInitials(msg.author_name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">{msg.author_name}</p>
                      <p className="text-[10px] text-text-muted">{formatRelativeTime(msg.created_at)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{msg.message}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}
