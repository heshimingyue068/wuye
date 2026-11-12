import React, { useState } from 'react';
import { useProperty } from '../../../context/PropertyContext';
import { X, QrCode, Copy, Check, Clock, Car, User, ShieldCheck } from 'lucide-react';
import { VisitorPassItem } from '../../../types';

interface VisitorPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisitorPassModal: React.FC<VisitorPassModalProps> = ({ isOpen, onClose }) => {
  const { createVisitorPass, currentProperty, showToast } = useProperty();

  const [visitorName, setVisitorName] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [durationHours, setDurationHours] = useState(24);
  const [generatedPass, setGeneratedPass] = useState<VisitorPassItem | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const pass = createVisitorPass({
      visitorName: visitorName.trim() || '亲友访客',
      carPlate: carPlate.trim() || undefined,
      validDurationHours: durationHours,
    });
    setGeneratedPass(pass);
  };

  const handleCopyLink = () => {
    if (!generatedPass) return;
    const shareText = `【幸福里花园访客通行码】\n访客：${generatedPass.visitorName}\n通行口令：${generatedPass.passCode}\n有效期至：${generatedPass.validUntil}\n请至小区东大门或单元门扫码通行。`;
    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    showToast('访客通行邀请口令已复制到剪贴板！', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">访客临时通行凭证</h3>
              <p className="text-xs text-slate-500">免去保安登记，扫码快速抬杆通行</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {generatedPass ? (
          <div className="py-4 overflow-y-auto space-y-4 text-center">
            <div className="bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 rounded-2xl p-4 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>通行权限已激活</span>
              </div>

              {/* Dynamic Simulated QR code */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-800 shadow-md relative flex items-center justify-center mb-3">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer corner anchors */}
                  <rect x="5" y="5" width="26" height="26" fill="#1e293b" rx="4" />
                  <rect x="9" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="13" y="13" width="10" height="10" fill="#1e293b" rx="2" />

                  <rect x="69" y="5" width="26" height="26" fill="#1e293b" rx="4" />
                  <rect x="73" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="77" y="13" width="10" height="10" fill="#1e293b" rx="2" />

                  <rect x="5" y="69" width="26" height="26" fill="#1e293b" rx="4" />
                  <rect x="9" y="73" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="13" y="77" width="10" height="10" fill="#1e293b" rx="2" />

                  {/* QR pattern matrix */}
                  <rect x="36" y="8" width="8" height="8" fill="#0f172a" />
                  <rect x="48" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="40" y="24" width="8" height="8" fill="#0f172a" />
                  <rect x="54" y="22" width="8" height="8" fill="#0f172a" />
                  <rect x="10" y="38" width="6" height="8" fill="#0f172a" />
                  <rect x="22" y="42" width="8" height="6" fill="#0f172a" />
                  <rect x="36" y="38" width="10" height="10" fill="#059669" rx="2" />
                  <rect x="52" y="40" width="8" height="8" fill="#0f172a" />
                  <rect x="66" y="38" width="6" height="8" fill="#0f172a" />
                  <rect x="78" y="44" width="12" height="6" fill="#0f172a" />
                  <rect x="38" y="56" width="8" height="8" fill="#0f172a" />
                  <rect x="52" y="54" width="8" height="8" fill="#0f172a" />
                  <rect x="68" y="56" width="10" height="8" fill="#0f172a" />
                  <rect x="38" y="72" width="6" height="8" fill="#0f172a" />
                  <rect x="48" y="74" width="12" height="6" fill="#0f172a" />
                  <rect x="68" y="72" width="8" height="8" fill="#0f172a" />
                  <rect x="80" y="78" width="10" height="10" fill="#0f172a" />
                </svg>
                {/* Center Badge */}
                <div className="absolute inset-0 m-auto w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-md">
                  门禁
                </div>
              </div>

              <div className="text-sm font-extrabold text-slate-900 tracking-wider font-mono">
                通行码: {generatedPass.passCode}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                到访房号：{generatedPass.createdByProperty} · 访客：{generatedPass.visitorName}
              </p>
              {generatedPass.carPlate && (
                <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                  车牌预约：{generatedPass.carPlate} (已同步自动道闸)
                </p>
              )}
            </div>

            {/* Countdown / Validity info */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  有效期截止
                </span>
                <span className="font-semibold text-slate-900 font-mono">{generatedPass.validUntil}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                支持通行：小区人行大门、3栋单元门及地下车库道闸
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '已复制邀请口令' : '一键复制口令发给访客'}</span>
              </button>
              <button
                type="button"
                onClick={() => setGeneratedPass(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
              >
                重新生成
              </button>
            </div>
          </div>
        ) : (
          /* Input Form to generate */
          <form onSubmit={handleGenerate} className="py-3 overflow-y-auto flex-1 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>访客姓名/称谓</span>
              </label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="如：陈先生、顺丰小哥、装修工人"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-slate-500" />
                <span>自驾车牌号 (选填)</span>
              </label>
              <input
                type="text"
                value={carPlate}
                onChange={(e) => setCarPlate(e.target.value)}
                placeholder="如：粤B·6V888（录入后道闸自动识别抬杆）"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>通行码有效时长</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '2小时 (临时短访)', hours: 2 },
                  { label: '12小时 (半天)', hours: 12 },
                  { label: '24小时 (全天)', hours: 24 },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.hours}
                    onClick={() => setDurationHours(item.hours)}
                    className={`p-2 rounded-xl border text-center font-medium transition-all ${
                      durationHours === item.hours
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">安全温馨提示:</div>
              <div>· 临时码支持在指定有效时间内多次进出小区大门与单元楼。</div>
              <div>· 通行记录将实时留存物业安防中心备查。</div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-sm"
              >
                生成二维码通行证
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
