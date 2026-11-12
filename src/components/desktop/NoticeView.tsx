import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Bell,
  Plus,
  Pin,
  Calendar,
  Eye,
  CheckCircle2,
  X,
  AlertTriangle,
  Megaphone,
} from 'lucide-react';
import { AnnouncementItem } from '../../types';

export const NoticeView: React.FC = () => {
  const { announcements, publishAnnouncement } = useProperty();

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'紧急通知' | '工程维修' | '便民活动' | '温馨提示'>('紧急通知');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(true);
  const [publisher, setPublisher] = useState('幸福里花园物业服务中心');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    publishAnnouncement({
      title: title.trim(),
      category,
      content: content.trim(),
      isPinned,
      publisher,
    });

    setTitle('');
    setContent('');
    setIsPinned(false);
    setShowPublishModal(false);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">社区通知与公告发布管理</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            发布的新公告将毫秒级推送到业主轻量化 H5 首页滚动横幅与弹窗中
          </p>
        </div>

        <button
          onClick={() => setShowPublishModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>发布新社区公告</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between space-y-3 transition-all ${
              ann.isPinned ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ann.category === '紧急通知'
                      ? 'bg-red-100 text-red-700'
                      : ann.category === '工程维修'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {ann.category}
                </span>

                {ann.isPinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    <Pin className="w-3 h-3 rotate-45" />
                    置顶广播
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                {ann.title}
              </h3>

              <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                {ann.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{ann.publishedAt}</span>
              <span className="flex items-center gap-1 text-slate-500 font-sans">
                <Eye className="w-3.5 h-3.5" />
                {ann.readCount} 次查阅
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <span>撰写并发布全区社区公告</span>
              </h3>
              <button onClick={() => setShowPublishModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  公告标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="如：【工程通知】明日外立面清洗高空作业警示"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">分类属性</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="紧急通知">紧急通知</option>
                    <option value="工程维修">工程维修</option>
                    <option value="便民活动">便民活动</option>
                    <option value="温馨提示">温馨提示</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">发布部门署名</label>
                  <input
                    type="text"
                    required
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  正文详细内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="写明通知时间、波及楼栋单元、防护注意细节以及紧急联系人电话..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs resize-none"
                />
              </div>

              {/* Pin Switch */}
              <div className="p-3 bg-red-50/60 border border-red-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-red-900 text-xs flex items-center gap-1">
                    <Pin className="w-3.5 h-3.5 rotate-45 text-red-600" />
                    <span>设为紧急置顶公告</span>
                  </div>
                  <div className="text-[11px] text-red-600/80">
                    开启后，该通知将在所有业主 H5 首页顶部以高亮跑马灯形式强制置顶展示。
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  即刻向全区广播发布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
