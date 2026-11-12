import React, { useState, useEffect } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  KeyRound,
  Lock,
  Unlock,
  QrCode,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Smartphone,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { VisitorPassModal } from './modals/VisitorPassModal';

export const AccessTab: React.FC = () => {
  const { doors, accessLogs, triggerDoorOpen, currentProperty } = useProperty();

  const [selectedDoor, setSelectedDoor] = useState(doors[0]);
  const [unlockStatus, setUnlockStatus] = useState<'idle' | 'unlocking' | 'unlocked'>('idle');
  const [countdown, setCountdown] = useState(5);
  const [showVisitorModal, setShowVisitorModal] = useState(false);

  // Auto relock countdown
  useEffect(() => {
    let timer: any;
    if (unlockStatus === 'unlocked') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setUnlockStatus('idle');
        setCountdown(5);
      }
    }
    return () => clearTimeout(timer);
  }, [unlockStatus, countdown]);

  const handleUnlock = (doorName: string = selectedDoor) => {
    if (unlockStatus !== 'idle') return;
    setSelectedDoor(doorName);
    setUnlockStatus('unlocking');

    // Haptic vibration if available in browser
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch (e) {
        // ignore
      }
    }

    setTimeout(() => {
      setUnlockStatus('unlocked');
      setCountdown(5);
      triggerDoorOpen(doorName);
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 text-xs pb-16 no-scrollbar p-3.5 space-y-3.5">
      {/* Top Status Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>智能蓝牙门禁·已授权通行</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            当前绑定：{currentProperty.name} {currentProperty.building}{currentProperty.room}
          </div>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
          白名单已生效
        </span>
      </div>

      {/* Main Big Tactile Lock Button */}
      <div className="bg-gradient-to-b from-white to-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center relative overflow-hidden">
        {/* Ambient Ring Glow */}
        {unlockStatus === 'unlocked' && (
          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse" />
        )}

        <div className="mb-2">
          <span className="text-xs text-slate-500 font-medium">目标通道</span>
          <h2 className="text-base font-bold text-slate-900 mt-0.5">{selectedDoor}</h2>
        </div>

        {/* Circular Unlock Button */}
        <div className="py-4 relative flex items-center justify-center">
          <button
            onClick={() => handleUnlock(selectedDoor)}
            disabled={unlockStatus !== 'idle'}
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl relative ${
              unlockStatus === 'unlocked'
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30 scale-105'
                : unlockStatus === 'unlocking'
                ? 'bg-blue-500 text-white scale-95 animate-pulse'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/30 active:scale-95'
            }`}
          >
            {unlockStatus === 'unlocked' ? (
              <>
                <Unlock className="w-10 h-10 mb-1 animate-in zoom-in-50 duration-200" />
                <span className="font-extrabold text-sm">门锁已开启</span>
                <span className="text-[10px] text-emerald-100 font-mono mt-0.5">{countdown}s 后自动上锁</span>
              </>
            ) : unlockStatus === 'unlocking' ? (
              <>
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mb-1.5" />
                <span className="text-xs font-bold">校验权限中...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-10 h-10 mb-1" />
                <span className="font-extrabold text-sm tracking-wide">点击一键开门</span>
                <span className="text-[10px] text-blue-100/90 mt-0.5">蓝牙/NFC极速感应</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          手机靠近门禁机1米范围内，亦支持自动蓝牙无感感应通行
        </p>
      </div>

      {/* Visitor Pass Entry Banner */}
      <div
        onClick={() => setShowVisitorModal(true)}
        className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/20 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs">生成访客临时二维码凭证</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              发送临时二维码或通行口令给亲友，支持限时自动核销
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {/* Available Doors List */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2">
        <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
          <span>授权门禁点列表</span>
          <span className="text-[11px] text-slate-400">点击快捷开门</span>
        </div>

        <div className="space-y-1.5">
          {doors.map((door) => (
            <div
              key={door}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                selectedDoor === door ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800 text-xs">{door}</span>
              </div>
              <button
                onClick={() => handleUnlock(door)}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] transition-colors"
              >
                开门
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Access Logs History */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">今日通行安全记录</span>
          <span className="text-[11px] text-slate-400 font-mono">共 {accessLogs.length} 条</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-44 overflow-y-auto">
          {accessLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-2 flex items-center justify-between text-xs">
              <div>
                <div className="text-slate-800 font-medium">{log.doorName}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {log.time} · {log.user} ({log.method})
                </div>
              </div>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <VisitorPassModal isOpen={showVisitorModal} onClose={() => setShowVisitorModal(false)} />
    </div>
  );
};
