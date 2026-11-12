import React, { useState } from 'react';
import { useProperty } from '../../../context/PropertyContext';
import { X, Building2, UploadCloud, CheckCircle2 } from 'lucide-react';

interface BindHouseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BindHouseModal: React.FC<BindHouseModalProps> = ({ isOpen, onClose }) => {
  const { submitBindingApplication } = useProperty();

  const [applicantName, setApplicantName] = useState('张三');
  const [applicantPhone, setApplicantPhone] = useState('13800138000');
  const [building, setBuilding] = useState('5栋');
  const [unit, setUnit] = useState('1单元');
  const [room, setRoom] = useState('802室');
  const [idCardLast4, setIdCardLast4] = useState('4321');
  const [proofType, setProofType] = useState<'房产证' | '购房合同' | '租赁合同'>('房产证');
  const [hasFile, setHasFile] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBindingApplication({
      applicantName,
      applicantPhone,
      propertyAddress: `幸福里花园 ${building}${unit}${room}`,
      idCardLast4,
      proofType,
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">申请绑定新房屋</h3>
              <p className="text-xs text-slate-500">提交资料后物业管家核验开通门禁权限</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-3 overflow-y-auto flex-1 space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">目标小区与房号</label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="1栋">1栋</option>
                <option value="2栋">2栋</option>
                <option value="3栋">3栋</option>
                <option value="5栋">5栋</option>
              </select>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="1单元">1单元</option>
                <option value="2单元">2单元</option>
                <option value="3单元">3单元</option>
              </select>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="房号如802"
                className="p-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">申请人姓名</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">联系手机</label>
              <input
                type="text"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">身份证后四位</label>
            <input
              type="text"
              value={idCardLast4}
              maxLength={4}
              onChange={(e) => setIdCardLast4(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 font-mono tracking-widest"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">产权证明类型</label>
            <div className="grid grid-cols-3 gap-2">
              {(['房产证', '购房合同', '租赁合同'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProofType(type)}
                  className={`p-2 rounded-xl border text-center transition-colors ${
                    proofType === type
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Mock Box */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">产权凭证照片</label>
            <div
              onClick={() => setHasFile(!hasFile)}
              className="border border-dashed border-slate-300 rounded-xl p-3 text-center cursor-pointer hover:bg-slate-50 transition-colors"
            >
              {hasFile ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>已上传权属凭证: 不动产权属证书_张三.jpg</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-slate-400">
                  <UploadCloud className="w-4 h-4" />
                  <span>点击上传产权证清晰首页</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              提交绑定审核申请
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
