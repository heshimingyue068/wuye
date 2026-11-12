import React from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Smartphone,
  LayoutDashboard,
  RotateCcw,
  Building2,
} from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    resetToMockData,
  } = useProperty();

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md">
      <div className="max-w-[1720px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Brand & Platform Tag */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 font-semibold text-sm text-white tracking-tight">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span>智慧邻里 · 物业协同平台</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">智慧社区数字化运营协同平台</span>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-150 ${
              viewMode === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>业主端 H5 视图</span>
          </button>

          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-150 ${
              viewMode === 'desktop'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>物业后台 Web 视图</span>
          </button>
        </div>

        {/* Quick Helper Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={resetToMockData}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="重置测试数据"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">重置数据</span>
          </button>
        </div>
      </div>
    </header>
  );
};
