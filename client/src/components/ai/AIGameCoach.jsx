import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Lightbulb, Target, Trophy, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import aiService from '@/services/aiService';

export function AIGameCoach({ gameId, gameTitle }) {
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('getting-started');

  const fetchCoaching = async () => {
    setLoading(true);
    try {
      const data = await aiService.getGameCoach(gameId);
      setCoaching(data.coaching);
    } catch (error) {
      console.error('Failed to fetch AI coaching:', error);
    } finally {
      setLoading(false);
    }
  };

  const iconMap = {
    'getting-started': <Lightbulb className="w-4 h-4 text-amber-400" />,
    advanced: <Brain className="w-4 h-4 text-gaming-purple" />,
    mistakes: <AlertTriangle className="w-4 h-4 text-destructive" />,
    'pro-tips': <Trophy className="w-4 h-4 text-gaming-cyan" />,
  };

  if (loading) {
    return (
      <Card className="border-2 border-gaming-purple/30 bg-gaming-dark/80 backdrop-blur-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-gaming-purple animate-spin" />
          <div>
            <h3 className="font-orbitron font-bold text-lg text-white">AI Tactical Coach</h3>
            <p className="text-xs text-muted-foreground">Synthesizing battle tactics for {gameTitle}...</p>
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </Card>
    );
  }

  if (!coaching) {
    return (
      <Card className="border-2 border-gaming-purple/30 bg-gradient-to-br from-gaming-dark via-gaming-card to-gaming-purple/10 p-6 text-center">
        <div className="flex flex-col items-center max-w-md mx-auto">
          <div className="p-3 rounded-2xl bg-gaming-purple/20 border border-gaming-purple/40 text-gaming-purple mb-4">
            <Brain className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-orbitron text-white mb-2">Groq AI Combat Coach</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Get personalized game strategies, secret mechanics, and pro shortcuts generated specifically for {gameTitle}.
          </p>
          <Button onClick={fetchCoaching} className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron px-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze & Generate Tactics
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gaming-purple/40 bg-gaming-dark/90 backdrop-blur-xl shadow-2xl overflow-hidden">
      <CardHeader className="p-6 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gaming-purple/20 text-gaming-purple border border-gaming-purple/40">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">AI Game Coach • {gameTitle}</CardTitle>
            <p className="text-xs text-muted-foreground">High-performance tactics powered by Groq Llama 3.3</p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={fetchCoaching} className="border-gaming-purple/30 hover:bg-gaming-purple/20">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Re-Analyze
        </Button>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {coaching.motivationalMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gradient-to-r from-gaming-purple/20 via-gaming-blue/20 to-transparent border border-gaming-purple/30 flex items-start gap-3"
          >
            <Sparkles className="w-5 h-5 text-gaming-cyan shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-white italic">"{coaching.motivationalMessage}"</p>
          </motion.div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-black/40 gap-1">
            <TabsTrigger value="getting-started" className="flex items-center gap-1.5 py-2.5 text-xs">
              {iconMap['getting-started']}
              <span>Beginner</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1.5 py-2.5 text-xs">
              {iconMap['advanced']}
              <span>Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="mistakes" className="flex items-center gap-1.5 py-2.5 text-xs">
              {iconMap['mistakes']}
              <span>Mistakes</span>
            </TabsTrigger>
            <TabsTrigger value="pro-tips" className="flex items-center gap-1.5 py-2.5 text-xs">
              {iconMap['pro-tips']}
              <span>Pro Tips</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value={activeTab} className="mt-4 space-y-3">
                {(
                  activeTab === 'getting-started'
                    ? coaching.gettingStarted
                    : activeTab === 'advanced'
                    ? coaching.advancedStrategies
                    : activeTab === 'mistakes'
                    ? coaching.commonMistakes
                    : coaching.proTips
                )?.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-gaming-card/80 border border-white/5 hover:border-gaming-purple/40 transition-colors"
                  >
                    <Badge variant="outline" className="mt-0.5 bg-black/40 border-gaming-purple/40 text-gaming-cyan font-orbitron shrink-0">
                      {index + 1}
                    </Badge>
                    <p className="text-sm text-gray-200 leading-relaxed">{tip}</p>
                  </motion.div>
                ))}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default AIGameCoach;
