import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Users,
  CheckCircle2,
  XCircle,
  FileCheck,
  Building2,
  QrCode,
  ShieldCheck,
  Clock,
  Car,
  Search,
} from 'lucide-react';
import { ResidentAuditItem } from '../../types';

export const ResidentsView: React.FC = () => {
  const {
    residentAudits,
    reviewBindingApplication,
    visitorPasses,
    properties,
  } = useProperty();

  const [activeTab, setActiveTab] = useState<'audits' | 'visitors' | 'directory'>('audits');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingAudits = residentAudits.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-4 text-xs">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-semibold">
          <button
            onClick={() => setActiveTab('audits')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'audits'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>业主认证审核</span>
            {pendingAudits.length > 0 && (
              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                {pendingAudits.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'visitors'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>访客码通行留痕 ({visitorPasses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'directory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>楼栋房产档案 ({properties.length + 3} 户)</span>
          </button>
        </div>

        <div className="text-slate-500 text-[11px]">
          审核通过后，系统将自动把业主手机与人脸白名单同步至单元防盗门与地下车库
        </div>
      </div>

      {/* Tab 1: Audits */}
      {activeTab === 'audits' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">新房屋绑定与住户认证申请队列</h3>
            <span className="text-slate-400">待管家核验产权材料</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">申请人姓名</th>
                  <th className="py-3 px-4">联系电话</th>
                  <th className="py-3 px-4">申请认证房屋</th>
                  <th className="py-3 px-4">身份证后4位</th>
                  <th className="py-3 px-4">凭证类型</th>
                  <th className="py-3 px-4">提交时间</th>
                  <th className="py-3 px-4">审核状态</th>
                  <th className="py-3 px-4 text-right">审核操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {residentAudits.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.applicantName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.applicantPhone}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{item.propertyAddress}</td>
                    <td className="py-3 px-4 font-mono">{item.idCardLast4}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                        {item.proofType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{item.appliedAt}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.status === 'rejected'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {item.status === 'approved'
                          ? '已通过(白名单生效)'
                          : item.status === 'rejected'
                          ? '已驳回'
                          : '待审核'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => reviewBindingApplication(item.id, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                          >
                            审核通过
                          </button>
                          <button
                            onClick={() => reviewBindingApplication(item.id, 'rejected')}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 font-medium text-xs transition-colors"
                          >
                            驳回
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">已归档</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Visitors */}
      {activeTab === 'visitors' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">访客临时通行凭证与出入记录留痕</h3>
              <p className="text-[11px] text-slate-400">实时反映业主端 H5 生成的访客二维码记录</p>
            </div>
            <span className="text-emerald-700 font-mono font-semibold">
              共 {visitorPasses.length} 条记录
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">通行核销码</th>
                  <th className="py-3 px-4">访客姓名</th>
                  <th className="py-3 px-4">邀约授权房号</th>
                  <th className="py-3 px-4">预约车牌</th>
                  <th className="py-3 px-4">有效时长</th>
                  <th className="py-3 px-4">失效截止时间</th>
                  <th className="py-3 px-4">生成时间</th>
                  <th className="py-3 px-4 text-right">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visitorPasses.map((vp) => (
                  <tr key={vp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">{vp.passCode}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{vp.visitorName}</td>
                    <td className="py-3 px-4 text-slate-700">{vp.createdByProperty}</td>
                    <td className="py-3 px-4 font-mono">
                      {vp.carPlate ? (
                        <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-bold">
                          {vp.carPlate}
                        </span>
                      ) : (
                        <span className="text-slate-400">步行未预约车辆</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{vp.validDurationHours} 小时</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{vp.validUntil}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{vp.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        {vp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Directory */}
      {activeTab === 'directory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">幸福里花园基础楼栋网格档案</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { room: '3栋2单元501室', resident: '张三', phone: '138****8000', area: '118.5㎡', status: '业主自住' },
              { room: '1栋1单元1202室', resident: '张三', phone: '138****8000', area: '89.0㎡', status: '已登记出租' },
              { room: '5栋1单元802室', resident: '李女士', phone: '139****4455', area: '135.2㎡', status: '待审核绑定' },
              { room: '2栋2单元1003室', resident: '周小鹏', phone: '186****9900', area: '96.0㎡', status: '租客已认证' },
              { room: '2栋3单元402室', resident: '王大伯', phone: '133****1234', area: '105.0㎡', status: '老年自住' },
            ].map((item) => (
              <div key={item.room} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{item.room}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                    {item.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>登记住户: {item.resident} ({item.phone})</span>
                  <span>{item.area}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
