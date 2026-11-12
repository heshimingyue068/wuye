import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  User,
  Building,
  Car,
  Phone,
  ShieldCheck,
  ChevronRight,
  Plus,
  HardHat,
  FileText,
  LifeBuoy,
  LogOut,
} from 'lucide-react';
import { BindHouseModal } from './modals/BindHouseModal';

export const ProfileTab: React.FC = () => {
  const {
    currentProperty,
    properties,
    setCurrentPropertyId,
    setRoleMode,
    showToast,
  } = useProperty();

  const [showBindModal, setShowBindModal] = useState(false);

  const handleCallHotline = () => {
    showToast('正在为您拨打物业24小时管家服务热线：0755-88889999...', 'info');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 text-xs pb-16 no-scrollbar p-3.5 space-y-3">
      {/* Resident Profile Header Card */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            张
          </div>
          <div className="min-w-0">
            <div className="text-base font-bold flex items-center gap-1.5 truncate">
              <span>{currentProperty.residentName}</span>
              <span className="text-[10px] bg-emerald-400/30 text-emerald-100 border border-emerald-300/40 px-2 py-0.2 rounded-full font-normal">
                实名认证业主
              </span>
            </div>
            <div className="text-xs text-blue-100/80 mt-0.5 font-mono">138****8000</div>
          </div>
        </div>

        {/* 员工端切换按钮 */}
        <button
          onClick={() => {
            setRoleMode('staff');
            showToast('已切换至员工接单工作台模式', 'info');
          }}
          className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium flex items-center gap-1.5 border border-white/20 backdrop-blur-xs transition-colors active:scale-95 shrink-0"
        >
          <HardHat className="w-3.5 h-3.5 text-blue-200" />
          <span>员工</span>
        </button>
      </div>

      {/* Bound Properties List */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 text-xs">我的绑定房产 ({properties.length})</span>
          <button
            onClick={() => setShowBindModal(true)}
            className="text-blue-600 hover:text-blue-700 font-semibold text-[11px] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增绑定申请</span>
          </button>
        </div>

        <div className="space-y-2">
          {properties.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setCurrentPropertyId(p.id);
                showToast(`已切换当前管理房产为【${p.name} ${p.building}${p.room}】`, 'info');
              }}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                p.id === currentProperty.id
                  ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    p.id === currentProperty.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">
                    {p.name} {p.building}{p.unit}{p.room}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    建筑面积: {p.area}㎡ · 业主身份已生效
                  </div>
                </div>
              </div>
              {p.id === currentProperty.id && (
                <span className="text-[10px] text-blue-600 font-bold bg-blue-100/60 px-2 py-0.5 rounded">
                  当前房屋
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Management */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 text-xs">绑定车牌与月卡</span>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
            道闸自动通行
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-600" />
            <div>
              <span className="font-bold text-slate-900 font-mono text-xs">粤B·88888</span>
              <span className="text-[10px] text-slate-500 ml-2">地下专属车位 B2-088</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">正常月保</span>
        </div>
      </div>

      {/* Hotline & Help */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2 text-xs">
        <div className="font-bold text-slate-900">管家便民与服务支持</div>
        <button
          onClick={handleCallHotline}
          className="w-full p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>24小时物业管家服务热线</span>
          </div>
          <span className="font-mono text-blue-600 font-semibold text-xs">0755-88889999</span>
        </button>
      </div>

      <BindHouseModal isOpen={showBindModal} onClose={() => setShowBindModal(false)} />
    </div>
  );
};
