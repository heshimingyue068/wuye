import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  KeyRound,
  CreditCard,
  Wrench,
  MessageSquareWarning,
  ChevronRight,
  Bell,
  Sparkles,
  Phone,
  ShieldCheck,
  Building,
  UserCheck,
  ChevronDown,
  Plus,
  ArrowRight,
  Layers,
  QrCode,
  Sun,
} from 'lucide-react';
import { PaymentModal } from './modals/PaymentModal';
import { RepairModal } from './modals/RepairModal';
import { ComplaintModal } from './modals/ComplaintModal';
import { VisitorPassModal } from './modals/VisitorPassModal';
import { NoticeDetailModal } from './modals/NoticeDetailModal';
import { BindHouseModal } from './modals/BindHouseModal';
import { AnnouncementItem, TicketType } from '../../types';

interface HomeTabProps {
  onNavigateTab: (tab: 'home' | 'access' | 'records' | 'profile') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigateTab }) => {
  const {
    currentProperty,
    properties,
    setCurrentPropertyId,
    bills,
    tickets,
    announcements,
    triggerDoorOpen,
  } = useProperty();

  // Modals state
  const [showPayment, setShowPayment] = useState(false);
  const [showRepair, setShowRepair] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);
  const [complaintType, setComplaintType] = useState<TicketType>('complaint');
  const [showVisitor, setShowVisitor] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<AnnouncementItem | null>(null);
  const [showBindHouse, setShowBindHouse] = useState(false);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);

  // Unpaid bills count for current property
  const currentRoomName = `${currentProperty.building}${currentProperty.unit}${currentProperty.room}`;
  const unpaidCount = bills.filter(
    (b) => b.roomNumber === currentRoomName && b.status === 'unpaid'
  ).length;

  // Most recent ongoing ticket
  const activeTicket = tickets.find(
    (t) =>
      t.roomNumber === currentRoomName &&
      (t.status === 'pending' || t.status === 'processing' || t.status === 'reopened')
  );

  // Pinned urgent notice
  const pinnedNotice = announcements.find((a) => a.isPinned) || announcements[0];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 text-xs pb-16 no-scrollbar">
      {/* Top Identity Card & Role Switcher */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white p-4 pt-3 shadow-md rounded-b-3xl">
        <div className="flex items-center justify-between">
          {/* Property Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
              className="flex items-center gap-1.5 text-left bg-white/15 hover:bg-white/20 backdrop-blur-xs py-1 px-2.5 rounded-full border border-white/20 transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-blue-200" />
              <span className="font-bold text-xs truncate max-w-[150px]">
                {currentProperty.name} {currentProperty.building}{currentProperty.room}
              </span>
              <ChevronDown className="w-3 h-3 text-blue-200" />
            </button>

            {/* Dropdown Menu */}
            {showPropertyDropdown && (
              <div className="absolute left-0 mt-2 w-60 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 p-2 z-30 animate-in fade-in">
                <div className="text-[10px] font-semibold text-slate-400 px-2 py-1">我的绑定房产</div>
                {properties.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentPropertyId(p.id);
                      setShowPropertyDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      p.id === currentProperty.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div>{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        {p.building}{p.unit}{p.room} · {p.area}㎡
                      </div>
                    </div>
                    {p.id === currentProperty.id && <span className="text-[10px] text-blue-600 font-bold">当前</span>}
                  </button>
                ))}
                <div className="pt-1 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowPropertyDropdown(false);
                      setShowBindHouse(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-blue-600 hover:bg-blue-50 font-medium text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增房屋绑定申请</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Weather Chip */}
          <div className="flex items-center gap-1.5 text-[11px] text-blue-100/90 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            <span>晴 24℃</span>
          </div>
        </div>

        {/* Resident Greeting */}
        <div className="mt-3.5">
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <span>您好，{currentProperty.residentName}</span>
            <span className="text-[10px] bg-emerald-400/30 text-emerald-100 border border-emerald-300/40 px-2 py-0.5 rounded-full font-medium">
              已认证业主
            </span>
          </div>
          <p className="text-[11px] text-blue-100/90 mt-0.5">幸福里花园物业管家竭诚守护</p>
        </div>
      </div>

      <div className="px-3.5 -mt-3 space-y-3">
        {/* Urgent Announcement Pinned Card */}
        {pinnedNotice && (
          <div
            onClick={() => setSelectedNotice(pinnedNotice)}
            className="bg-white rounded-2xl p-3 border border-red-100 shadow-xs flex items-center gap-2.5 cursor-pointer hover:border-red-200 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 truncate text-xs">
                  {pinnedNotice.title}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                {pinnedNotice.publishedAt} · 点击查看停水检修详细范围及应对措施
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        )}

        {/* Kingkong 4 Core Entry Points */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center">
            {/* 1. 一键开门 */}
            <button
              onClick={() => onNavigateTab('access')}
              className="flex flex-col items-center group transition-transform active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-lg transition-shadow">
                <KeyRound className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-800 text-[11px] mt-1.5">一键开门</span>
              <span className="text-[10px] text-slate-400">蓝牙/访客码</span>
            </button>

            {/* 2. 物业缴费 */}
            <button
              onClick={() => setShowPayment(true)}
              className="flex flex-col items-center group relative transition-transform active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:shadow-lg transition-shadow">
                <CreditCard className="w-6 h-6" />
              </div>
              {unpaidCount > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unpaidCount}
                </span>
              )}
              <span className="font-semibold text-slate-800 text-[11px] mt-1.5">物业缴费</span>
              <span className="text-[10px] text-slate-400">
                {unpaidCount > 0 ? `${unpaidCount}笔待缴` : '已结清'}
              </span>
            </button>

            {/* 3. 报事报修 */}
            <button
              onClick={() => setShowRepair(true)}
              className="flex flex-col items-center group transition-transform active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:shadow-lg transition-shadow">
                <Wrench className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-800 text-[11px] mt-1.5">报事报修</span>
              <span className="text-[10px] text-slate-400">快速派单</span>
            </button>

            {/* 4. 投诉建议 */}
            <button
              onClick={() => {
                setComplaintType('complaint');
                setShowComplaint(true);
              }}
              className="flex flex-col items-center group transition-transform active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:shadow-lg transition-shadow">
                <MessageSquareWarning className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-800 text-[11px] mt-1.5">投诉建议</span>
              <span className="text-[10px] text-slate-400">支持匿名</span>
            </button>
          </div>
        </div>

        {/* Ongoing Service Progress Card */}
        {activeTicket ? (
          <div
            onClick={() => onNavigateTab('records')}
            className="bg-white rounded-2xl p-3.5 border border-blue-200 shadow-xs cursor-pointer hover:border-blue-300 transition-colors space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="font-bold text-slate-900 text-xs">正在处理中的诉求</span>
              </div>
              <span className="text-[11px] text-blue-600 font-medium flex items-center gap-0.5">
                <span>跟踪进度</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 truncate max-w-[210px]">
                  {activeTicket.category}
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {activeTicket.status === 'processing'
                    ? '师傅已接单处理'
                    : activeTicket.status === 'reopened'
                    ? '⚠️ 重新督办中'
                    : '待派单'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-1">{activeTicket.content}</p>
              {activeTicket.assignedStaff && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>接单技工：{activeTicket.assignedStaff.name} ({activeTicket.assignedStaff.role})</span>
                  <span className="text-blue-600 font-medium">电话预约就绪</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* When no ongoing tickets, show quick banner */
          <div
            onClick={() => setShowVisitor(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-3 shadow-xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <QrCode className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-xs">生成临时访客二维码</div>
                <div className="text-[10px] text-emerald-100">亲友自驾或外卖快递快速扫码进门</div>
              </div>
            </div>
            <button className="px-2.5 py-1 rounded-lg bg-white text-emerald-800 font-bold text-[11px] shadow-xs">
              立即生成
            </button>
          </div>
        )}

        {/* Resident Convenience Services */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
          <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
            <span>便民管家服务专区</span>
            <span className="text-[11px] text-slate-400">24小时值守</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => setShowVisitor(true)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 cursor-pointer hover:bg-slate-100/80 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-xs">访客邀约</div>
                <div className="text-[10px] text-slate-500">限时有效免登记</div>
              </div>
            </div>

            <div
              onClick={() => {
                setComplaintType('suggestion');
                setShowComplaint(true);
              }}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 cursor-pointer hover:bg-slate-100/80 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-xs">优化建议</div>
                <div className="text-[10px] text-slate-500">社区治理有您一份</div>
              </div>
            </div>

            <div
              onClick={() => setShowPayment(true)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 cursor-pointer hover:bg-slate-100/80 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-xs">电子发票/收据</div>
                <div className="text-[10px] text-slate-500">线上即时查验开具</div>
              </div>
            </div>

            <div
              onClick={() => setShowBindHouse(true)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 cursor-pointer hover:bg-slate-100/80 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-xs">房屋绑定申请</div>
                <div className="text-[10px] text-slate-500">多套房产/租客认证</div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Announcements List */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">社区通知公告</span>
            <span className="text-[11px] text-slate-400">{announcements.length}条动态</span>
          </div>

          <div className="divide-y divide-slate-100">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                onClick={() => setSelectedNotice(ann)}
                className="py-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-lg px-1 transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-slate-800 truncate text-xs">{ann.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {ann.publishedAt} · {ann.publisher}
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Render Modals */}
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
      <RepairModal isOpen={showRepair} onClose={() => setShowRepair(false)} />
      <ComplaintModal
        isOpen={showComplaint}
        defaultType={complaintType}
        onClose={() => setShowComplaint(false)}
      />
      <VisitorPassModal isOpen={showVisitor} onClose={() => setShowVisitor(false)} />
      <NoticeDetailModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      <BindHouseModal isOpen={showBindHouse} onClose={() => setShowBindHouse(false)} />
    </div>
  );
};
