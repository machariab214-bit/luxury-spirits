'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function AISommelier({ productList = [] }: { productList?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([
    {
      role: 'assistant',
      content:
        'Good evening. I am your personal sommelier. How may I assist your palate tonight?',
    },
  ]);

  const handleChat = async () => {
    const userMsg = { role: 'user', content: input };
    setChat([...chat, userMsg]);
    setInput('');

    // Track AI interaction
    trackEvent('ai_interaction', {
      action: 'recommendation_given',
      query: input,
    });

    const res = await fetch('/api/sommelier', {
      method: 'POST',
      body: JSON.stringify({
        messages: [...chat, userMsg],
        productList, // Use the passed product list
      }),
    });

    const data = await res.json();
    setChat((prev) => [...prev, data]);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 h-96 mb-4 border border-white/10 bg-[#0C0C0C]/80 backdrop-blur-2xl rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 bg-white/5 font-serif text-[#D4AF37]">
              The Sommelier
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-hide">
              {chat.map((m, i) => (
                <div
                  key={i}
                  className={m.role === 'user' ? 'text-right' : 'text-left'}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      m.role === 'user'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white/5 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask for a recommendation..."
                className="bg-transparent border-none focus:ring-0 text-xs flex-1 text-white outline-none"
              />
              <button onClick={handleChat} className="text-[#D4AF37]">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-110 transition-transform"
      >
        {isOpen ? <X color="black" /> : <MessageSquare color="black" />}
      </button>
    </div>
  );
}