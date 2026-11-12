import React, { useState } from 'react';
import { useProperty } from '../../../context/PropertyContext';
import { X, ShieldAlert, Lightbulb, Shield, Camera, EyeOff, AlertCircle } from 'lucide-react';
import { TicketType } from '../../../types';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TicketType;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'complaint',
}) => {
  const { createTicket, currentProperty } = useProperty();

  const [ticketType, setTicketType] = useState<TicketType>(defaultType);
  const [category, setCategory] = useState('环境卫生');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isEmergency, setIsEmergency] = useState(false);

  if (!isOpen) return null;

  const complaintTags = ['环境卫生', '安保秩序', '设施噪音', '服务态度', '车辆违停', '装修违规'];
  const suggestionTags = ['社区设施优化', '绿化景观提升', '便民活动建议', '管家服务改进', '垃圾分类优化'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createTicket({
      type: ticketType,
      category,
      roomNumber: `${currentProperty.building}${currentProperty.unit}${currentProperty.room}`,
      submitterName: currentProperty.residentName,
      submitterPhone: currentProperty.residentPhone,
      isAnonymous,
      isEmergency: ticketType === 'complaint' && isEmergency,
      content: content.trim(),
      images: [],
    });

    setContent('');
    setIsEmergency(false);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                ticketType === 'complaint' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
              }`}
            >
              {ticketType === 'complaint' ? <ShieldAlert className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {ticketType === 'complaint' ? '业主投诉建议直通车' : '社区发展好点子'}
              </h3>
              <p className="text-xs text-slate-500">直达项目经理与客服督办中心</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Complaint vs Suggestion */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl mt-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setTicketType('complaint');
              setCategory('环境卫生');
            }}
            className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              ticketType === 'complaint'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>我要投诉</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTicketType('suggestion');
              setCategory('社区设施优化');
            }}
            className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              ticketType === 'suggestion'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>优化建议</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-3 overflow-y-auto flex-1 space-y-3.5 text-xs">
          {/* Category Tag Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">涉及类别</label>
            <div className="flex flex-wrap gap-1.5">
              {(ticketType === 'complaint' ? complaintTags : suggestionTags).map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setCategory(tag)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                    category === tag
                      ? ticketType === 'complaint'
                        ? 'border-red-600 bg-red-600 text-white font-medium'
                        : 'border-blue-600 bg-blue-600 text-white font-medium'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              {ticketType === 'complaint' ? '投诉事实与诉求' : '建议细节与期待效果'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                ticketType === 'complaint'
                  ? '请具体说明发生的时间、地点、涉及部门或现象，我们将以最高优先级督办整改...'
                  : '分享您对小区绿化、公共设施、便民活动等方面的建设性好想法...'
              }
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs resize-none"
            />
          </div>

          {/* Anonymous Switcher Card */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    isAnonymous ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-xs">匿名提交模式</div>
                  <div className="text-[10px] text-slate-500">
                    {isAnonymous ? '已开启隐私保护：后台隐去姓名与房号' : '实名提交：便于管家点对点联系您'}
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-11 h-6 flex items-center rounded-full p-1 duration-200 transition-colors ${
                  isAnonymous ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${
                    isAnonymous ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {isAnonymous && (
              <div className="text-[11px] text-emerald-700 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/60 flex items-start gap-1.5 leading-relaxed">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  后台客服与工程人员将仅看到 <strong>*** (匿名业主)</strong>，绝不泄露您的户号。
                </span>
              </div>
            )}
          </div>

          {/* Emergency Red Alert Tag (for complaints) */}
          {ticketType === 'complaint' && (
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-red-100 bg-red-50/50">
              <div className="flex items-center gap-1.5 text-xs text-red-800">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <span className="font-medium">标记为紧急超时预警督办单</span>
              </div>
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={!content.trim()}
              className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                content.trim()
                  ? ticketType === 'complaint'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              {isAnonymous ? '以匿名身份安全提交' : '确认提交'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
