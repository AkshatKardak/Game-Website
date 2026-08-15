import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, X, Send, Sparkles, Bot, Zap, Minimize2 } from 'lucide-react';
import aiService from '@/services/aiService';
import { useAuth } from '@/context/AuthContext';

export function AIChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Greetings Commander! 🚀 I'm your AI Gaming Co-Pilot. Ask me about game tips, secret maneuvers, achievements, or personalized game recommendations!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const data = await aiService.chat(userMessage, messages);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response || "Systems nominal! What else can I calculate for you, pilot?",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Neural link recalibrating! I'm here to help you dominate the leaderboards.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Recommend a game for me",
    "How do I earn XP fast?",
    "Tips for Planetary Battle Royale",
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.8 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-gaming-purple via-gaming-blue to-gaming-pink hover:opacity-95 shadow-[0_0_30px_rgba(139,92,246,0.6)] p-0 relative group"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <Bot className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gaming-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gaming-cyan border-2 border-gaming-dark"></span>
              </span>
            </>
          )}
        </Button>
      </motion.div>

      {/* Interactive Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[410px] max-w-full"
          >
            <Card className="border-2 border-gaming-purple/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden bg-gaming-dark/95 backdrop-blur-2xl rounded-2xl">
              {/* Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-gaming-purple/30 via-gaming-blue/20 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gaming-purple/30 border border-gaming-purple/50 text-gaming-cyan">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-orbitron text-white flex items-center gap-1.5">
                      GALACTIC AI CO-PILOT
                      <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Groq Llama 3.1 Ultra-Fast Inference</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-white p-1 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Area */}
              <ScrollArea className="h-80 p-4 space-y-4" ref={scrollRef}>
                <div className="space-y-3.5">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="w-7 h-7 shrink-0 border border-gaming-purple/40">
                        {msg.role === 'assistant' ? (
                          <div className="w-full h-full bg-gaming-purple flex items-center justify-center text-white">
                            <Bot className="w-4 h-4" />
                          </div>
                        ) : (
                          <AvatarFallback className="bg-gaming-blue text-white text-[10px]">
                            {user?.username?.slice(0, 2) || 'YOU'}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[82%] shadow-md ${
                          msg.role === 'user'
                            ? 'bg-gaming-purple text-white rounded-br-none'
                            : 'bg-gaming-card border border-white/10 text-gray-200 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7 shrink-0 bg-gaming-purple flex items-center justify-center text-white">
                        <Bot className="w-4 h-4" />
                      </Avatar>
                      <div className="p-3 rounded-2xl bg-gaming-card border border-white/10 rounded-bl-none flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gaming-purple animate-ping" />
                        <span className="w-1.5 h-1.5 rounded-full bg-gaming-cyan animate-ping delay-75" />
                        <span className="w-1.5 h-1.5 rounded-full bg-gaming-pink animate-ping delay-150" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Prompts */}
              <div className="px-3 py-1.5 border-t border-white/5 flex gap-1.5 overflow-x-auto text-[10px]">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(prompt);
                    }}
                    className="whitespace-nowrap rounded-full bg-white/5 hover:bg-gaming-purple/20 hover:text-gaming-purple border border-white/10 px-2.5 py-1 text-muted-foreground transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 flex gap-2 bg-black/40">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your AI Co-Pilot..."
                  disabled={loading}
                  className="h-10 text-xs bg-black/60 border-white/15 focus-visible:ring-gaming-purple"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || !input.trim()}
                  className="h-10 w-10 shrink-0 bg-gaming-purple hover:bg-gaming-purple/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatbot;
