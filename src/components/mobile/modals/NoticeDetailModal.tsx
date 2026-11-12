import React from 'react';
import { AnnouncementItem } from '../../../types';
import { X, Bell, Pin, Calendar, Eye } from 'lucide-react';

interface NoticeDetailModalProps {
  notice: AnnouncementItem | null;
  onClose: () => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ notice, onClose }) => {
  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                notice.category === '紧急通知'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-blue-50 text-blue-600 border border-blue-200'
              }`}
            >
              {notice.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 overflow-y-auto space-y-3">
          <h2 className="text-base font-bold text-slate-900 leading-snug">{notice.title}</h2>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 border-b border-slate-100 pb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {notice.publishedAt}
            </span>
            <span>·</span>
            <span>发布方: {notice.publisher}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {notice.readCount} 次阅读
            </span>
          </div>

          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line py-1">
            {notice.content}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">客服服务中心热线</div>
            <div>如对上述内容有任何疑问，可随时联系幸福里花园24小时服务热线：0755-88889999</div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};
