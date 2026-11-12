import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Home,
  KeyRound,
  FileText,
  User,
  HardHat,
  Wifi,
  BatteryMedium,
  RotateCcw,
} from 'lucide-react';
import { HomeTab } from './HomeTab';
import { AccessTab } from './AccessTab';
import { RecordsTab } from './RecordsTab';
import { ProfileTab } from './ProfileTab';
import { StaffWorkspace } from './StaffWorkspace';

export const MobileSimulator: React.FC = () => {
  const { roleMode, setRoleMode, currentProperty } = useProperty();
  const [activeTab, setActiveTab] = useState<'home' | 'access' | 'records' | 'profile'>('home');

  // Time display
  const currentTime = '09:41';

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* Phone Case Frame */}
      <div className="w-[390px] h-[780px] bg-slate-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-800/80 flex flex-col relative overflow-hidden">
        {/* Dynamic Island / Notch Bezel */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-28 h-6 bg-black rounded-full flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <div className="w-2 h-2 rounded-full bg-blue-900/40" />
        </div>

        {/* Screen Bezel Inner Container */}
        <div className="w-full h-full bg-slate-100 rounded-[34px] overflow-hidden flex flex-col relative">
          {/* iOS / WeChat Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-slate-800 text-[11px] font-semibold shrink-0 z-30">
            <span className="font-mono tracking-tight">{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-sans">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>

          {/* Body Area */}
          <div className="flex-1 overflow-hidden flex flex-col relative">
            {roleMode === 'staff' ? (
              <StaffWorkspace />
            ) : (
              <>
                {activeTab === 'home' && <HomeTab onNavigateTab={setActiveTab} />}
                {activeTab === 'access' && <AccessTab />}
                {activeTab === 'records' && <RecordsTab />}
                {activeTab === 'profile' && <ProfileTab />}
              </>
            )}
          </div>

          {/* Bottom Navigation Bar (for owner view) */}
          {roleMode === 'owner' ? (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/80 grid grid-cols-4 items-center z-30 px-2 pb-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Home className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px] tracking-tight mt-1">首页</span>
              </button>

              <button
                onClick={() => setActiveTab('access')}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  activeTab === 'access' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <KeyRound className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px] tracking-tight mt-1">门禁通行</span>
              </button>

              <button
                onClick={() => setActiveTab('records')}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  activeTab === 'records' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <FileText className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px] tracking-tight mt-1">服务记录</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <User className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px] tracking-tight mt-1">我的</span>
              </button>
            </div>
          ) : (
            /* Bottom Bar in Staff Mode */
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 z-30 text-white">
              <div className="flex items-center gap-2 text-xs">
                <HardHat className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-[11px]">员工接单工作台</span>
              </div>
              <button
                onClick={() => setRoleMode('owner')}
                className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs border border-slate-700 transition-colors"
              >
                返回业主模式
              </button>
            </div>
          )}

          {/* iOS Bottom Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/50 rounded-full pointer-events-none z-40" />
        </div>
      </div>
    </div>
  );
};
