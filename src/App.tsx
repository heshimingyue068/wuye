import React from 'react';
import { PropertyProvider, useProperty } from './context/PropertyContext';
import { DemoSwitcher } from './components/common/DemoSwitcher';
import { ToastContainer } from './components/common/Toast';
import { MobileSimulator } from './components/mobile/MobileSimulator';
import { DesktopLayout } from './components/desktop/DesktopLayout';
import { Smartphone, LayoutDashboard, Sparkles } from 'lucide-react';

const MainView: React.FC = () => {
  const { viewMode } = useProperty();

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-200/70">
      {/* 1. Mobile View */}
      {viewMode === 'mobile' && (
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 bg-gradient-to-b from-slate-200 to-slate-300">
          <div className="flex flex-col items-center">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/80 px-3 py-1 rounded-full shadow-xs border border-slate-300">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>微信端轻量化 H5 客户端 · 390px 视口</span>
            </div>
            <MobileSimulator />
          </div>
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

        {/* Global Floating Toast Center */}
        <ToastContainer />

        {/* Dynamic Dual-Screen or Full View Container */}
        <MainView />
      </div>
    </PropertyProvider>
  );
}
