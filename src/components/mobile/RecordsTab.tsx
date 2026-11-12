import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Wrench,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { TicketItem, TicketType } from '../../types';

export const RecordsTab: React.FC = () => {
  const { tickets, evaluateTicket, currentProperty } = useProperty();

  const [filterType, setFilterType] = useState<'all' | 'repair' | 'complaint'>('all');
  const [unsatisfiedModalTicket, setUnsatisfiedModalTicket] = useState<TicketItem | null>(null);
  const [unsatisfiedReason, setUnsatisfiedReason] = useState('');

  // Filter tickets for current property
  const currentRoomName = `${currentProperty.building}${currentProperty.unit}${currentProperty.room}`;
  const myTickets = tickets.filter((t) => {
    const isMyRoom = t.roomNumber === currentRoomName;
    if (filterType === 'all') return isMyRoom;
    if (filterType === 'repair') return isMyRoom && t.type === 'repair';
    if (filterType === 'complaint') return isMyRoom && (t.type === 'complaint' || t.type === 'suggestion');
    return isMyRoom;
  });

  const handleSatisfied = (ticketId: string) => {
    evaluateTicket(ticketId, 'satisfied', '处理迅速，服务态度好，问题已解决！');
  };

  const handleConfirmUnsatisfied = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unsatisfiedModalTicket) return;
    evaluateTicket(
      unsatisfiedModalTicket.id,
      'unsatisfied',
      unsatisfiedReason || '处理不彻底，现场未完全修复或仍有隐患，要求重新派工检查！'
    );
    setUnsatisfiedModalTicket(null);
    setUnsatisfiedReason('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 text-xs pb-16 no-scrollbar p-3.5 space-y-3">
      {/* Top Header & Filter Segmented Controls */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">服务进度与工单记录</h2>
            <p className="text-[11px] text-slate-500">跟踪报修维修与投诉建议闭环</p>
          </div>
          <span className="text-xs text-blue-600 font-semibold font-mono">共 {myTickets.length} 条</span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            全部服务单
          </button>
          <button
            onClick={() => setFilterType('repair')}
            className={`flex-1 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              filterType === 'repair'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            报修维修
          </button>
          <button
            onClick={() => setFilterType('complaint')}
            className={`flex-1 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              filterType === 'complaint'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            投诉与建议
          </button>
        </div>
      </div>

      {/* Tickets List */}
      {myTickets.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400">
          <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <div className="font-semibold text-slate-600 text-xs">暂无相关服务记录</div>
          <div className="text-[11px] mt-1">如需报修或提建议，可前往首页提交需求</div>
        </div>
      ) : (
        myTickets.map((ticket) => {
          const isResolved = ticket.status === 'resolved';
          const isClosed = ticket.status === 'closed';
          const isProcessing = ticket.status === 'processing';
          const isReopened = ticket.status === 'reopened';
          const isPending = ticket.status === 'pending';

          return (
            <div
              key={ticket.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 transition-all ${
                isReopened
                  ? 'border-red-300 ring-1 ring-red-200 bg-red-50/10'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      ticket.type === 'complaint'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : ticket.type === 'repair'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}
                  >
                    {ticket.category}
                  </span>
                  {ticket.isAnonymous && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      匿名保护
                    </span>
                  )}
                  {ticket.isEmergency && (
                    <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                      紧急督办
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isClosed
                      ? 'bg-emerald-50 text-emerald-700'
                      : isResolved
                      ? 'bg-blue-50 text-blue-700'
                      : isProcessing
                      ? 'bg-amber-50 text-amber-700'
                      : isReopened
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isClosed
                    ? '已办结评价'
                    : isResolved
                    ? '待业主验收'
                    : isProcessing
                    ? '处理中'
                    : isReopened
                    ? '重新流转整改'
                    : '待派单受理'}
                </span>
              </div>

              {/* Ticket description */}
              <div>
                <p className="text-slate-800 leading-relaxed text-xs">{ticket.content}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                  <span>编号: {ticket.id}</span>
                  <span>·</span>
                  <span>提交时间: {ticket.createdAt}</span>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="grid grid-cols-4 gap-1 text-center relative text-[10px]">
                  {/* Step 1 */}
                  <div>
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-1 font-bold text-[10px]">
                      ✓
                    </div>
                    <span className="font-semibold text-slate-800">已提交</span>
                  </div>

                  {/* Step 2 */}
                  <div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mx-auto mb-1 font-bold text-[10px] ${
                        isProcessing || isResolved || isClosed || isReopened
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isProcessing || isResolved || isClosed || isReopened ? '✓' : '2'}
                    </div>
                    <span
                      className={`font-semibold ${
                        isProcessing || isResolved || isClosed || isReopened
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      已派单
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mx-auto mb-1 font-bold text-[10px] ${
                        isResolved || isClosed
                          ? 'bg-blue-600 text-white'
                          : isProcessing || isReopened
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isResolved || isClosed ? '✓' : '3'}
                    </div>
                    <span
                      className={`font-semibold ${
                        isResolved || isClosed || isProcessing || isReopened
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {isResolved || isClosed ? '已处置' : '处理中'}
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mx-auto mb-1 font-bold text-[10px] ${
                        isClosed
                          ? 'bg-emerald-600 text-white'
                          : isResolved
                          ? 'bg-blue-500 text-white animate-pulse'
                          : isReopened
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isClosed ? '★' : '4'}
                    </div>
                    <span
                      className={`font-semibold ${
                        isClosed
                          ? 'text-emerald-700'
                          : isResolved
                          ? 'text-blue-700'
                          : isReopened
                          ? 'text-red-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {isClosed ? '已好评' : isResolved ? '待评价' : isReopened ? '重督办' : '验收'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Reply / Completion Record */}
              {(ticket.adminReply || ticket.resolutionNote) && (
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-blue-900 font-semibold text-[11px]">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>物业官方回复与跟进记录</span>
                    </span>
                    <span className="text-[10px] text-blue-600 font-mono">{ticket.repliedAt}</span>
                  </div>
                  {ticket.adminReply && (
                    <p className="text-slate-700 leading-relaxed text-xs">{ticket.adminReply}</p>
                  )}
                  {ticket.resolutionNote && (
                    <div className="text-[11px] text-emerald-800 bg-white/80 p-2 rounded-lg border border-emerald-100">
                      <strong>整改结案结果：</strong> {ticket.resolutionNote}
                    </div>
                  )}
                </div>
              )}

              {/* Evaluation Status or Action Buttons */}
              {isClosed && ticket.evaluation ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>业主评价：★★★★★ 满意</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-mono">
                    {ticket.evaluation.evaluatedAt}
                  </span>
                </div>
              ) : isReopened ? (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[11px] flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">业主对处理结果不满意，工单已自动升级重新流转！</div>
                    <div className="text-[10px] text-red-600 mt-0.5">
                      客服主管已将该单置顶为红色紧急任务，将安排资深主管进行电话回访或二次整改。
                    </div>
                  </div>
                </div>
              ) : isResolved ? (
                /* When resolved: Resident can click Satisfied or Unsatisfied */
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="text-center text-slate-600 font-semibold text-xs">
                    物业已完成处理，请您对本次服务进行验收评价：
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSatisfied(ticket.id)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>满意 (五星结案)</span>
                    </button>
                    <button
                      onClick={() => setUnsatisfiedModalTicket(ticket)}
                      className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>不满意 (触发重流转)</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })
      )}

      {/* Unsatisfied Feedback Modal */}
      {unsatisfiedModalTicket && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl flex flex-col space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-red-600 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>提交不满意反馈 · 触发工单升级</span>
              </h4>
              <button
                onClick={() => setUnsatisfiedModalTicket(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmUnsatisfied} className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                感谢您的监督。点击提交后，该工单将立即升级为<strong>【红色超时预警单】</strong>并直接呈报物业项目经理重新派员彻底整改。
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  不满意具体原因与整改要求
                </label>
                <textarea
                  rows={3}
                  required
                  value={unsatisfiedReason}
                  onChange={(e) => setUnsatisfiedReason(e.target.value)}
                  placeholder="如：问题未彻底解决、角阀仍微渗、师傅态度敷衍、现场未清理干净等..."
                  className="w-full p-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setUnsatisfiedModalTicket(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  确认升级重新流转
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
