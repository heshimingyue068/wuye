import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Phone,
  Camera,
  Check,
  ChevronRight,
  HardHat,
  AlertTriangle,
  Send,
  X,
} from 'lucide-react';
import { TicketItem } from '../../types';

export const StaffWorkspace: React.FC = () => {
  const { tickets, staffAcceptTicket, resolveTicket, showToast, setRoleMode } = useProperty();

  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [completionImage, setCompletionImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&auto=format&fit=crop&q=60'
  );

  // Tickets assigned or pending
  const staffTickets = tickets.filter(
    (t) => t.status === 'processing' || t.status === 'pending' || t.status === 'reopened'
  );
  const completedTickets = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed');

  const handleOpenResolveModal = (ticket: TicketItem) => {
    setSelectedTicket(ticket);
    setResolveNote('已上门完成检修并更换了老化损坏的高压软管密封环，现场压力测试正常，无漏水现象。');
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    resolveTicket(selectedTicket.id, resolveNote, completionImage || undefined);
    setSelectedTicket(null);
  };

  const handleCall = (phone: string, name: string) => {
    showToast(`正在通过工作手机外呼【${name} (${phone})】...`, 'info');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 text-xs">
      {/* Staff Header Card */}
      <div className="bg-slate-900 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-inner">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>张师傅 (工程维修组)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-normal">
                  值班在岗
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">工号：ENG-8021 · 幸福里花园网格A区</div>
            </div>
          </div>

          {/* Quick toggle back to owner view */}
          <button
            onClick={() => setRoleMode('owner')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] transition-colors"
          >
            切回业主端
          </button>
        </div>

        {/* Staff Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
          <div>
            <div className="text-slate-400 text-[10px]">待接单/处理</div>
            <div className="text-base font-bold text-amber-400 font-mono mt-0.5">{staffTickets.length}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">今日已完工</div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">{completedTickets.length}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">综合好评率</div>
            <div className="text-base font-bold text-blue-400 font-mono mt-0.5">100%</div>
          </div>
        </div>
      </div>

      {/* Main Task List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        <div className="flex items-center justify-between text-slate-700 px-1">
          <span className="font-bold text-xs">我的任务工单 ({staffTickets.length})</span>
          <span className="text-[11px] text-slate-500">点击接单或提交完工照片</span>
        </div>

        {staffTickets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <div className="font-semibold text-slate-700">暂无待办工单</div>
            <div className="text-[11px] mt-1">您负责的网格所有报修事项均已处理完毕！</div>
          </div>
        ) : (
          staffTickets.map((ticket) => {
            const isReopened = ticket.status === 'reopened';
            return (
              <div
                key={ticket.id}
                className={`bg-white rounded-2xl border p-3.5 shadow-xs space-y-2.5 transition-all ${
                  isReopened
                    ? 'border-red-300 ring-1 ring-red-200 bg-red-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header row */}
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
                    <span className="text-slate-400 font-mono text-[11px]">{ticket.id}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ticket.status === 'processing'
                        ? 'bg-amber-50 text-amber-700'
                        : ticket.status === 'reopened'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ticket.status === 'processing'
                      ? '处理中'
                      : ticket.status === 'reopened'
                      ? '⚠️ 不满意重新督办'
                      : '待接单'}
                  </span>
                </div>

                {/* Room & Content */}
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>
                      {ticket.isAnonymous ? '*** (匿名业主)' : ticket.roomNumber}{' '}
                      {!ticket.isAnonymous && (
                        <span className="font-normal text-slate-500">({ticket.submitterName})</span>
                      )}
                    </span>
                    {!ticket.isAnonymous && (
                      <button
                        onClick={() => handleCall(ticket.submitterPhone, ticket.submitterName)}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[11px] font-medium"
                      >
                        <Phone className="w-3 h-3" />
                        <span>联系业主</span>
                      </button>
                    )}
                  </div>
                  <p className="text-slate-700 mt-1 leading-relaxed">{ticket.content}</p>
                </div>

                {/* Expected time info */}
                {ticket.expectedTime && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] bg-slate-50 p-1.5 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>预约上门: {ticket.expectedTime}</span>
                  </div>
                )}

                {/* Attached image if any */}
                {ticket.images.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <img
                      src={ticket.images[0]}
                      alt="报修附件"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                    />
                    <span className="text-[10px] text-slate-400">业主提交的故障照片</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  {ticket.status === 'pending' ? (
                    <button
                      onClick={() => staffAcceptTicket(ticket.id)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>立即接单并出发</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenResolveModal(ticket)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>上传完工照片并结案</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completion Modal for Staff */}
      {selectedTicket && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl flex flex-col space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">上传完工总结并结案</h4>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  完工处理说明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
                  placeholder="写明解决方式、更换配件或检测结果..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  <span>维修完工照 (已自动拍摄)</span>
                </label>
                {completionImage ? (
                  <div className="relative rounded-xl border border-slate-200 overflow-hidden aspect-video">
                    <img
                      src={completionImage}
                      alt="完工照"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      水印：经纬度定位 幸福里花园
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setCompletionImage(
                        'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&auto=format&fit=crop&q=60'
                      )
                    }
                    className="w-full p-3 border border-dashed border-slate-300 rounded-xl text-center text-slate-500 text-xs hover:bg-slate-50"
                  >
                    点击拍摄现场完工照片
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  确认办结工单
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
