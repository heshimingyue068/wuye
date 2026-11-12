import React, { useState } from 'react';
import { useProperty } from '../../../context/PropertyContext';
import { X, Wrench, Camera, Clock, Image as ImageIcon, Check } from 'lucide-react';

interface RepairModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RepairModal: React.FC<RepairModalProps> = ({ isOpen, onClose }) => {
  const { createTicket, currentProperty } = useProperty();

  const [scope, setScope] = useState<'居家维修' | '公共区域'>('居家维修');
  const [category, setCategory] = useState('室内水暖洁具');
  const [content, setContent] = useState('');
  const [expectedTime, setExpectedTime] = useState('今天下午 14:00-16:00');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen) return null;

  const homeCategories = ['室内水暖洁具', '电路跳闸/开关', '门窗与五金锁具', '燃气/热水器故障', '墙面脱落/渗水'];
  const publicCategories = ['电梯运行异响', '楼道路灯损坏', '单元门禁/道闸', '绿化带杂草清理', '下水管道堵塞'];

  const presetPhotos = [
    { label: '水管滴水', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=60' },
    { label: '水盆下水', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60' },
    { label: '开关接触不良', url: 'https://images.unsplash.com/photo-1558227691-41ea78d1f631?w=500&auto=format&fit=crop&q=60' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createTicket({
      type: 'repair',
      category: `${scope} · ${category}`,
      roomNumber: `${currentProperty.building}${currentProperty.unit}${currentProperty.room}`,
      submitterName: currentProperty.residentName,
      submitterPhone: currentProperty.residentPhone,
      isAnonymous: false,
      isEmergency: false,
      content: content.trim(),
      images: selectedPhoto ? [selectedPhoto] : [],
      expectedTime,
    });

    setContent('');
    setSelectedPhoto(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">提交报事报修</h3>
              <p className="text-xs text-slate-500">{currentProperty.name} {currentProperty.building}{currentProperty.room}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-3 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Scope Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">报修区域</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setScope('居家维修');
                  setCategory('室内水暖洁具');
                }}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                  scope === '居家维修'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🏠 居家自费/保修范围
              </button>
              <button
                type="button"
                onClick={() => {
                  setScope('公共区域');
                  setCategory('电梯运行异响');
                }}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                  scope === '公共区域'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🏢 公共区域及设施
              </button>
            </div>
          </div>

          {/* Category Tags */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">具体故障类型</label>
            <div className="flex flex-wrap gap-1.5">
              {(scope === '居家维修' ? homeCategories : publicCategories).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] transition-all ${
                    category === cat
                      ? 'border-blue-600 bg-blue-600 text-white font-medium'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              故障具体描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请详细描述故障现象、发生位置（如：主卫洗手池角阀漏水、开关无法复位）..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs resize-none"
            />
          </div>

          {/* Photo attachment mock */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                <span>现场故障照片</span>
              </label>
              {selectedPhoto && (
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="text-red-500 text-[11px] hover:underline"
                >
                  清除已选
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {presetPhotos.map((preset) => {
                const isSelected = selectedPhoto === preset.url;
                return (
                  <div
                    key={preset.label}
                    onClick={() => setSelectedPhoto(preset.url)}
                    className={`relative rounded-xl border overflow-hidden cursor-pointer aspect-video flex flex-col justify-end p-1.5 transition-all ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/30'
                        : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="absolute inset-0 w-full h-full object-cover -z-10"
                    />
                    <div className="bg-black/60 rounded px-1 py-0.5 text-[10px] text-white flex items-center justify-between">
                      <span className="truncate">{preset.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expected Time */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>期望上门服务时间</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                '今天下午 14:00-16:00',
                '今天傍晚 18:00-20:00',
                '明天上午 09:00-11:30',
                '电话提前与我预约',
              ].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setExpectedTime(time)}
                  className={`py-1.5 px-2.5 rounded-lg border text-left text-[11px] truncate transition-colors ${
                    expectedTime === time
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Submit CTA */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={!content.trim()}
              className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                content.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              立即提交报修需求
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
