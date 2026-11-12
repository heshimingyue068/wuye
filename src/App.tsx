import React from 'react';
import { PropertyProvider, useProperty } from './context/PropertyContext';
import { DemoSwitcher } from './components/common/DemoSwitcher';
import { MobileSimulator } from './components/mobile/MobileSimulator';
import { DesktopLayout } from './components/desktop/DesktopLayout';

const MainView: React.FC = () => {
  const { viewMode } = useProperty();

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-200/70">
      {/* 1. Mobile View */}
      {viewMode === 'mobile' && (
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 bg-gradient-to-b from-slate-200 to-slate-300">
          <MobileSimulator />
        </div>
      )}

      {/* 2. Desktop SaaS Web View */}
      {viewMode === 'desktop' && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <DesktopLayout />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <PropertyProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden text-slate-800 antialiased font-sans">
        {/* Global Demo Switcher Navigation Bar */}
        <DemoSwitcher />

        {/* Dynamic Dual-Screen or Full View Container */}
        <MainView />
      </div>
    </PropertyProvider>
  );
}
