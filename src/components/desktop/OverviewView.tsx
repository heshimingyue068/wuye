import React from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  DollarSign,
  Wrench,
  AlertOctagon,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Bell,
  HardHat,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { TicketItem } from '../../types';

interface OverviewViewProps {
  onNavigateTab: (tab: 'overview' | 'tickets' | 'finance' | 'residents' | 'notices') => void;
  onOpenTicket: (ticket: TicketItem) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateTab, onOpenTicket }) => {
  const {
    bills,
    tickets,
    residentAudits,
    accessLogs,
    visitorPasses,
    quickDemoTrigger,
  } = useProperty();

  // Metrics calculation
  const totalPaidRevenue = bills
    .filter((b) => b.status === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingRepairs = tickets.filter(
    (t) => t.type === 'repair' && (t.status === 'pending' || t.status === 'processing' || t.status === 'reopened')
  ).length;

  const urgentComplaints = tickets.filter(
    (t) =>
      (t.type === 'complaint' || t.status === 'reopened') &&
      t.status !== 'closed'
  );

  const pendingAudits = residentAudits.filter((a) => a.status === 'pending').length;

  // Urgent todos: unhandled complaints or reopened tickets
  const urgentTodos = tickets.filter(
    (t) => (t.isEmergency || t.status === 'reopened' || (t.type === 'complaint' && t.status === 'pending')) && t.status !== 'closed'
  );

  return (
    <div className="space-y-6">
      {/* 4 Core Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">本月实收物业费总额</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
              ¥{totalPaidRevenue.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>较昨日净增实缴 · 双端已实时同步</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Active Repairs */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">待办报修处理数</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
              {pendingRepairs} <span className="text-xs font-normal text-slate-400">单</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">工程班组正在有序检修</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Red Alert Complaints (Critical requirement) */}
        <div className="bg-white rounded-2xl p-4 border border-red-200 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-red-50/40">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-red-600">红色预警投诉数</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <div className="text-2xl font-extrabold text-red-600 mt-1 tabular-nums">
              {urgentComplaints.length} <span className="text-xs font-normal text-red-400">单重点督办</span>
            </div>
            <div className="text-[11px] text-red-500/80 mt-1">要求15分钟内快速响应</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Pending Resident Audits */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">待审核业主房产</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
              {pendingAudits} <span className="text-xs font-normal text-slate-400">户申请</span>
            </div>
            <div className="text-[11px] text-blue-600 mt-1 cursor-pointer hover:underline" onClick={() => onNavigateTab('residents')}>
              点击前往核验证件 →
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Left Urgent Todos & Dispatch, Right Live Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Todos & Priority Escalated Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">重点待办与超时预警督办池</h3>
                  <p className="text-xs text-slate-500">标红置顶紧急投诉与业主不满意重新流转工单</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('tickets')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>进入统一工单中心</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {urgentTodos.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <span className="font-semibold text-slate-700">当前无超时或红色预警诉求！</span>
                <p className="text-[11px] mt-1 text-slate-400">所有投诉与复查事项均在时效控制内</p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentTodos.map((ticket) => {
                  const isReopened = ticket.status === 'reopened';
                  return (
                    <div
                      key={ticket.id}
                      className="p-3.5 rounded-xl border border-red-200 bg-red-50/30 hover:bg-red-50/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                            {isReopened ? '⚠️ 业主评价不满意·重新督办' : '红色紧急督办'}
                          </span>
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            {ticket.id}
                          </span>
                          <span className="text-xs text-slate-500">·</span>
                          <span className="text-xs font-semibold text-slate-800">
                            {ticket.isAnonymous ? '*** (匿名业主)' : ticket.roomNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-snug line-clamp-2">
                          {ticket.content}
                        </p>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                          <span>提单时间: {ticket.createdAt}</span>
                          {ticket.category && <span>· 类别: {ticket.category}</span>}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => onOpenTicket(ticket)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-xs"
                        >
                          即刻处理 / 派单
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Operations Strip */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <HardHat className="w-4 h-4 text-blue-600" />
              <span>当前在岗管家：<strong>李主管 (前台总机)</strong>、值班工程：<strong>张师傅、王师傅</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('tickets')}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                + 客服代客录单
              </button>
              <button
                onClick={() => onNavigateTab('notices')}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                发布紧急通知
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Realtime Operation Activity Logs */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">园区实时物联与动态流</h3>
              </div>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono font-medium">
                双端联动实时中
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] text-xs divide-y divide-slate-100">
              {accessLogs.slice(0, 7).map((log) => (
                <div key={log.id} className="pt-2.5 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{log.doorName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.time.split(' ')[1] || log.time}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 flex items-center justify-between">
                    <span>
                      {log.user} · <span className="text-slate-400">{log.method}</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">通行成功</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visitor pass summary */}
            <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-2.5 rounded-xl">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">有效访客通行码:</span>
                <span className="font-bold text-emerald-700 font-mono">{visitorPasses.length} 张生效中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
