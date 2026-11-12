import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Wrench,
  ShieldAlert,
  Lightbulb,
  Search,
  Filter,
  Plus,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Phone,
  Clock,
  EyeOff,
  X,
  Camera,
  Check,
  ChevronRight,
} from 'lucide-react';
import { TicketItem, TicketType, TicketStatus } from '../../types';

interface TicketCenterViewProps {
  initialSelectedTicket?: TicketItem | null;
}

export const TicketCenterView: React.FC<TicketCenterViewProps> = ({ initialSelectedTicket }) => {
  const {
    tickets,
    dispatchTicket,
    quickReplyTicket,
    resolveTicket,
    createManualTicket,
    currentProperty,
  } = useProperty();

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | TicketType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Ticket for Actions
  const [activeTicket, setActiveTicket] = useState<TicketItem | null>(initialSelectedTicket || null);
  const [modalType, setModalType] = useState<'dispatch' | 'reply' | 'resolve' | 'manual' | null>(null);

  // Form states for modals
  const [selectedStaff, setSelectedStaff] = useState({
    name: '张师傅',
    phone: '13911223344',
    role: '高级水电维修工',
  });
  const [replyText, setReplyText] = useState('');
  const [resolveNote, setResolveNote] = useState('');

  // Manual ticket form state (代客录单)
  const [manualRoom, setManualRoom] = useState('2栋1单元302室');
  const [manualName, setManualName] = useState('孙阿姨 (电话报修)');
  const [manualPhone, setManualPhone] = useState('13566778899');
  const [manualType, setManualType] = useState<TicketType>('repair');
  const [manualCategory, setManualCategory] = useState('居家水暖维修');
  const [manualContent, setManualContent] = useState('');
  const [manualExpectedTime, setManualExpectedTime] = useState('今天下午 15:00-17:00');

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRoom = t.isAnonymous ? false : t.roomNumber.toLowerCase().includes(q);
      const matchContent = t.content.toLowerCase().includes(q);
      const matchId = t.id.toLowerCase().includes(q);
      const matchCategory = t.category.toLowerCase().includes(q);
      if (!matchRoom && !matchContent && !matchId && !matchCategory) return false;
    }
    return true;
  });

  const staffOptions = [
    { name: '张师傅', phone: '13911223344', role: '高级水电维修工' },
    { name: '李师傅', phone: '13822334455', role: '综合工程维保班长' },
    { name: '王管家', phone: '13700112233', role: '客服网格主管' },
    { name: '陈队长', phone: '13699887766', role: '安保与秩序队长' },
  ];

  const quickReplyTemplates = [
    '【已受理通知】已收到您的反馈，工程技术人员已备齐耗材配件，将于30分钟内上门检修。',
    '【秩序整改通报】安保班组已对通道违停车辆实施清退，并已安排固定安保岗加强巡查巡检。',
    '【卫生保洁复核】已对相关楼层保洁员进行现场督办，目前已对公共区域进行深度冲洗消杀。',
    '【建议采纳答复】感谢您对小区建设的宝贵建议！物业部已进行实地立项勘验，将尽快落地推进。',
  ];

  const handleOpenDispatch = (ticket: TicketItem) => {
    setActiveTicket(ticket);
    setModalType('dispatch');
  };

  const handleOpenReply = (ticket: TicketItem) => {
    setActiveTicket(ticket);
    setReplyText(quickReplyTemplates[0]);
    setModalType('reply');
  };

  const handleOpenResolve = (ticket: TicketItem) => {
    setActiveTicket(ticket);
    setResolveNote('经工程人员现场排查维修，已完成老化零件替换与通水打压测试，恢复正常使用。');
    setModalType('resolve');
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;
    dispatchTicket(activeTicket.id, selectedStaff);
    setModalType(null);
  };

  const handleConfirmReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;
    quickReplyTicket(activeTicket.id, replyText.trim());
    setModalType(null);
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !resolveNote.trim()) return;
    resolveTicket(
      activeTicket.id,
      resolveNote.trim(),
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&auto=format&fit=crop&q=60'
    );
    setModalType(null);
  };

  const handleConfirmManualTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualContent.trim()) return;
    createManualTicket({
      type: manualType,
      category: manualCategory,
      roomNumber: manualRoom,
      submitterName: manualName,
      submitterPhone: manualPhone,
      isAnonymous: false,
      isEmergency: false,
      content: manualContent.trim(),
      images: [],
      expectedTime: manualExpectedTime,
    });
    setManualContent('');
    setModalType(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Type Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全部工单 ({tickets.length})
            </button>
            <button
              onClick={() => setTypeFilter('repair')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                typeFilter === 'repair'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>报修工单</span>
            </button>
            <button
              onClick={() => setTypeFilter('complaint')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                typeFilter === 'complaint'
                  ? 'bg-white text-red-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
              <span>投诉预警</span>
              <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded-full font-bold">
                红标
              </span>
            </button>
            <button
              onClick={() => setTypeFilter('suggestion')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                typeFilter === 'suggestion'
                  ? 'bg-white text-indigo-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
              <span>优化建议</span>
            </button>
          </div>

          {/* Action: Manual Ticket Button (代客录单) */}
          <button
            onClick={() => setModalType('manual')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>客服代客录单 (电话/前台接待)</span>
          </button>
        </div>

        {/* Secondary Status Filters & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-slate-400 text-[11px] mr-1">工单状态:</span>
            {[
              { id: 'all', label: '全部状态' },
              { id: 'pending', label: '待派单/受理' },
              { id: 'processing', label: '处理中' },
              { id: 'resolved', label: '待业主验收' },
              { id: 'closed', label: '已结案' },
              { id: 'reopened', label: '⚠️ 重新督办单' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === st.id
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索房号、描述或工单号..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Tickets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">工单流水号</th>
                <th className="py-3 px-4">业务分类</th>
                <th className="py-3 px-4">诉求房号 / 业主</th>
                <th className="py-3 px-4 min-w-[260px]">具体事实与诉求描述</th>
                <th className="py-3 px-4">责任跟进人</th>
                <th className="py-3 px-4">流转状态</th>
                <th className="py-3 px-4 text-right">操作处置</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span>未检索到匹配的工单记录</span>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const isComplaint = ticket.type === 'complaint';
                  const isSuggestion = ticket.type === 'suggestion';
                  const isReopened = ticket.status === 'reopened';

                  return (
                    <tr
                      key={ticket.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isReopened ? 'bg-red-50/20' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{ticket.id}</span>
                          {ticket.source === '客服代客录单' && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1 py-0.2 rounded font-sans">
                              代客
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Type & Category */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isComplaint
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : isSuggestion
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                              : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {ticket.category}
                        </span>
                        {ticket.isEmergency && (
                          <span className="ml-1 text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded font-bold">
                            预警
                          </span>
                        )}
                      </td>

                      {/* Room & Resident (Anonymous requirement!) */}
                      <td className="py-3 px-4">
                        {ticket.isAnonymous ? (
                          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-600">*** (匿名业主)</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-semibold text-slate-900">{ticket.roomNumber}</span>
                            <div className="text-[11px] text-slate-500">
                              {ticket.submitterName} · {ticket.submitterPhone}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Content Description */}
                      <td className="py-3 px-4">
                        <p className="text-slate-800 line-clamp-2 leading-relaxed">{ticket.content}</p>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                          <span>提单: {ticket.createdAt}</span>
                          {ticket.expectedTime && <span>· 期望: {ticket.expectedTime}</span>}
                        </div>
                      </td>

                      {/* Staff */}
                      <td className="py-3 px-4">
                        {ticket.assignedStaff ? (
                          <div>
                            <div className="font-semibold text-slate-900">{ticket.assignedStaff.name}</div>
                            <div className="text-[10px] text-slate-500">{ticket.assignedStaff.role}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400">待指派人员</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            ticket.status === 'closed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ticket.status === 'resolved'
                              ? 'bg-blue-50 text-blue-700'
                              : ticket.status === 'processing'
                              ? 'bg-amber-50 text-amber-700'
                              : isReopened
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ticket.status === 'closed'
                            ? '已结案评价'
                            : ticket.status === 'resolved'
                            ? '已处置待验收'
                            : ticket.status === 'processing'
                            ? '处理中'
                            : isReopened
                            ? '⚠️ 重新流转中'
                            : '待派单'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {ticket.status === 'pending' || isReopened ? (
                            <button
                              onClick={() => handleOpenDispatch(ticket)}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors"
                            >
                              派单
                            </button>
                          ) : null}

                          <button
                            onClick={() => handleOpenReply(ticket)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
                            title="使用标准客服话术快捷回复业主"
                          >
                            回复
                          </button>

                          {ticket.status !== 'closed' && (
                            <button
                              onClick={() => handleOpenResolve(ticket)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                              title="填写整改结果并结案"
                            >
                              结案
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. Dispatch Modal (派单弹窗) */}
      {modalType === 'dispatch' && activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                指派工单处理人 ({activeTicket.id})
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="font-semibold text-slate-800">
                  {activeTicket.category} · {activeTicket.isAnonymous ? '*** (匿名业主)' : activeTicket.roomNumber}
                </div>
                <p className="text-slate-600 line-clamp-2">{activeTicket.content}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">选择指派维修工 / 客服人员</label>
                <div className="space-y-2">
                  {staffOptions.map((staff) => (
                    <div
                      key={staff.name}
                      onClick={() => setSelectedStaff(staff)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        selectedStaff.name === staff.name
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {staff.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{staff.name}</div>
                          <div className="text-[11px] text-slate-500">{staff.role} · {staff.phone}</div>
                        </div>
                      </div>
                      {selectedStaff.name === staff.name && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  确认下发派单
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Quick Reply Modal (快捷回复弹窗) */}
      {modalType === 'reply' && activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                向业主发送官方回复 ({activeTicket.id})
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReply} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">快捷标准话术选择</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {quickReplyTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReplyText(tpl)}
                      className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-slate-700 text-[11px] leading-relaxed transition-colors"
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">自定义回复内容 (业主端将实时收到)</label>
                <textarea
                  rows={3}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  立即推送回复
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Resolve & Close Modal (处理完结并填写整改结果) */}
      {modalType === 'resolve' && activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                处理完结并填写整改结果 ({activeTicket.id})
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  现场整改/解决结果说明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs resize-none"
                  placeholder="详细写明解决动作、现场恢复情况，提交后将邀请业主验收评价..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">整改现场确认照片 (已附带)</label>
                <div className="relative rounded-xl border border-slate-200 overflow-hidden aspect-video">
                  <img
                    src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&auto=format&fit=crop&q=60"
                    alt="整改现场照片"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                    工程验收完成
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  确认办结并邀请业主评价
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Manual Ticket Entry Modal (客服代客录单) */}
      {modalType === 'manual' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>客服代客录单 (前台接待/热线服务)</span>
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmManualTicket} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">报修房号</label>
                  <input
                    type="text"
                    required
                    value={manualRoom}
                    onChange={(e) => setManualRoom(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">业主姓名/称谓</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">联系电话</label>
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">工单类型</label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="repair">报事报修</option>
                    <option value="complaint">投诉督办</option>
                    <option value="suggestion">优化建议</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">业务细类</label>
                <input
                  type="text"
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  诉求内容记录 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="如：孙阿姨电话反映家中厨房龙头松动摇晃漏水，老人独居不会使用微信，请求工程师傅下午上门帮忙加固..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">约定上门时间</label>
                <input
                  type="text"
                  value={manualExpectedTime}
                  onChange={(e) => setManualExpectedTime(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  生成代客工单入库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
