import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  LayoutDashboard,
  Layers,
  CreditCard,
  Users,
  Megaphone,
  Building,
  Bell,
  HardHat,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { OverviewView } from './OverviewView';
import { TicketCenterView } from './TicketCenterView';
import { FinanceView } from './FinanceView';
import { ResidentsView } from './ResidentsView';
import { NoticeView } from './NoticeView';
import { TicketItem } from '../../types';

export const DesktopLayout: React.FC = () => {
  const { tickets, residentAudits, bills } = useProperty();

  const [activeMenu, setActiveMenu] = useState<'overview' | 'tickets' | 'finance' | 'residents' | 'notices'>('overview');
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState<TicketItem | null>(null);

  // Red badge for urgent complaints or reopened tickets
  const urgentCount = tickets.filter(
    (t) => (t.type === 'complaint' || t.status === 'reopened') && t.status !== 'closed'
  ).length;

  const pendingAuditCount = residentAudits.filter((a) => a.status === 'pending').length;

  const handleOpenTicketFromOverview = (ticket: TicketItem) => {
    setSelectedTicketForDetail(ticket);
    setActiveMenu('tickets');
  };

  const menuTitles: Record<string, string> = {
    overview: '综合监控工作台',
    tickets: '统一工单处理调度中心',
    finance: '财务物业费收缴管理',
    residents: '房产档案与住户审核',
    notices: '社区广播与公告发布',
  };

  return (
    <div className="flex h-full min-h-[750px] bg-slate-100/90 text-slate-800 text-xs overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-60 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        {/* Sidebar Brand Header */}
        <div className="p-4 border-b border-slate-800/90 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight">智慧邻里物管系统</h1>
            <div className="text-[11px] text-slate-400">幸福里花园服务中心</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => {
              setActiveMenu('overview');
              setSelectedTicketForDetail(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
              activeMenu === 'overview'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>工作台 (数据看板)</span>
            </div>
          </button>

          <button
            onClick={() => setActiveMenu('tickets')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
              activeMenu === 'tickets'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>统一工单中心</span>
            </div>
            {urgentCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                {urgentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveMenu('finance');
              setSelectedTicketForDetail(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
              activeMenu === 'finance'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4" />
              <span>财务收费管理</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveMenu('residents');
              setSelectedTicketForDetail(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
              activeMenu === 'residents'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>房产与住户审核</span>
            </div>
            {pendingAuditCount > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingAuditCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveMenu('notices');
              setSelectedTicketForDetail(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
              activeMenu === 'notices'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4" />
              <span>公告发布管理</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
              李
            </div>
            <div>
              <div className="font-semibold text-white text-xs">李主管 (总调度)</div>
              <div className="text-[10px] text-slate-400">客服中心经理</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400" title="系统在线" />
        </div>
      </aside>

      {/* Main Right Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">幸福里智慧社区</span>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-900 text-sm">{menuTitles[activeMenu]}</span>
          </div>

          {/* Right Header Status Widgets */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs hidden sm:flex">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>实时联通 H5 终端 (内存储蓄状态秒级互通)</span>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-medium">
                SaaS v3.2 Pro
              </span>
            </div>
          </div>
        </header>

        {/* Content Area Container */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeMenu === 'overview' && (
            <OverviewView
              onNavigateTab={(tab) => {
                setActiveMenu(tab);
                setSelectedTicketForDetail(null);
              }}
              onOpenTicket={handleOpenTicketFromOverview}
            />
          )}

          {activeMenu === 'tickets' && (
            <TicketCenterView initialSelectedTicket={selectedTicketForDetail} />
          )}

          {activeMenu === 'finance' && <FinanceView />}

          {activeMenu === 'residents' && <ResidentsView />}

          {activeMenu === 'notices' && <NoticeView />}
        </main>
      </div>
    </div>
  );
};
