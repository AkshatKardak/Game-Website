import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/utils/cn';

const TabsContext = createContext();

export function Tabs({ value, onValueChange, defaultValue, className, children }) {
  const [activeTab, setActiveTab] = useState(value || defaultValue);

  const currentTab = value !== undefined ? value : activeTab;
  const setTab = (newTab) => {
    if (onValueChange) onValueChange(newTab);
    else setActiveTab(newTab);
  };

  return (
    <TabsContext.Provider value={{ currentTab, setTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div
      className={cn(
        'inline-flex h-12 items-center justify-center rounded-xl bg-gaming-dark/80 p-1 text-muted-foreground border border-white/10',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children }) {
  const { currentTab, setTab } = useContext(TabsContext);
  const isActive = currentTab === value;

  return (
    <button
      type="button"
      onClick={() => setTab(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-gaming-purple text-white shadow-lg shadow-purple-900/40 font-semibold'
          : 'hover:bg-white/5 hover:text-white',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }) {
  const { currentTab } = useContext(TabsContext);
  if (currentTab !== value) return null;

  return (
    <div
      className={cn(
        'mt-4 ring-offset-background focus-visible:outline-none animate-in fade-in duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}
