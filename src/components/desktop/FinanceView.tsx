import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  DollarSign,
  Plus,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  CreditCard,
  Building,
  User,
  X,
  Check,
} from 'lucide-react';
import { BillItem } from '../../types';

export const FinanceView: React.FC = () => {
  const { bills, generateMonthlyBills, recordOfflinePayment } = useProperty();

  const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showGenModal, setShowGenModal] = useState(false);
  const [genPeriod, setGenPeriod] = useState('2026-04');
  const [genUnitPrice, setGenUnitPrice] = useState(2.2);

  const [offlineTargetBill, setOfflineTargetBill] = useState<BillItem | null>(null);
  const [offlineMethod, setOfflineMethod] = useState<'现金收款' | 'POS机刷卡'>('现金收款');
  const [offlineOperator, setOfflineOperator] = useState('王管家 (前台接待)');

  // Calculations
  const totalReceivable = bills.reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = bills.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const totalUnpaid = totalReceivable - totalPaid;
  const collectionRate = totalReceivable > 0 ? ((totalPaid / totalReceivable) * 100).toFixed(1) : '0';

  // Filtered bills
  const filteredBills = bills.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRoom = b.roomNumber.toLowerCase().includes(q);
      const matchName = b.residentName.toLowerCase().includes(q);
      const matchNo = b.billNo.toLowerCase().includes(q);
      if (!matchRoom && !matchName && !matchNo) return false;
    }
    return true;
  });

  const unpaidBills = bills.filter((b) => b.status === 'unpaid');

  const handleConfirmGen = (e: React.FormEvent) => {
    e.preventDefault();
    generateMonthlyBills(genPeriod, genUnitPrice);
    setShowGenModal(false);
  };

  const handleConfirmOffline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineTargetBill) return;
    recordOfflinePayment(offlineTargetBill.id, offlineMethod, offlineOperator);
    setOfflineTargetBill(null);
  };

  return (
    <div className="space-y-4">
      {/* Top 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">账单总计应收</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums font-mono">
            ¥{totalReceivable.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">全区累计下发账单基数</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700">累计实收归账</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums font-mono">
            ¥{totalPaid.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">资金已核对并生成电子收据</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-amber-700">待收/欠费账款</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums font-mono">
            ¥{totalUnpaid.toFixed(2)}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">包含本期新增及应缴账单</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-blue-700">当前收缴率</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1 tabular-nums font-mono">
            {collectionRate}%
          </div>
          <div className="text-[11px] text-blue-500 mt-1">与业主端支付状态实时联动</div>
        </div>
      </div>

      {/* Action Header & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全部账单 ({bills.length})
            </button>
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'unpaid'
                  ? 'bg-white text-amber-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              待缴费 ({unpaidBills.length})
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'paid'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              已结清入账
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Offline Entry Button */}
            <button
              onClick={() => {
                if (unpaidBills.length > 0) {
                  setOfflineTargetBill(unpaidBills[0]);
                }
              }}
              disabled={unpaidBills.length === 0}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>线下收款补录 (现金/POS)</span>
            </button>

            {/* Generate Monthly Bills */}
            <button
              onClick={() => setShowGenModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>批量生成月度账单</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            双端实时对账模式：任何一端缴费或补录，另一端毫秒级呈现结清与电子凭证
          </div>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索房号、业主姓名或单号..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Bills Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">账单流水号</th>
                <th className="py-3 px-4">房号及业主</th>
                <th className="py-3 px-4">收费类目与计费期</th>
                <th className="py-3 px-4">应缴金额</th>
                <th className="py-3 px-4">到期日</th>
                <th className="py-3 px-4">结算状态</th>
                <th className="py-3 px-4">实收渠道 / 经办人</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">{bill.billNo}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900">{bill.roomNumber}</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">({bill.residentName})</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{bill.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">账期: {bill.period}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono text-sm">
                    ¥{bill.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{bill.dueDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        bill.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {bill.status === 'paid' ? '已结清' : '待缴费'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {bill.status === 'paid' ? (
                      <div className="text-[11px]">
                        <span className="font-semibold text-slate-800">{bill.paymentMethod || '在线支付'}</span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {bill.paidAt} {bill.operator && `· 经办: ${bill.operator}`}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">等待业主付款</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {bill.status === 'unpaid' ? (
                      <button
                        onClick={() => setOfflineTargetBill(bill)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                      >
                        线下收费
                      </button>
                    ) : (
                      <span className="text-emerald-600 text-xs font-semibold">电子收据已出具</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Generate Monthly Bills */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">批量生成全区月度物业费账单</h3>
              <button onClick={() => setShowGenModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmGen} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">计费账期 (月份)</label>
                <input
                  type="month"
                  value={genPeriod}
                  onChange={(e) => setGenPeriod(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  物业服务费单价 (元/平米/月)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={genUnitPrice}
                  onChange={(e) => setGenUnitPrice(parseFloat(e.target.value) || 2.2)}
                  className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-[11px] leading-relaxed">
                系统将根据园区房屋登记档案的建筑面积自动计算并批量推送到业主端 H5 待缴账单中。
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  确认生成账单
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Offline Payment Entry */}
      {offlineTargetBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                线下收款补录入账 ({offlineTargetBill.billNo})
              </h3>
              <button onClick={() => setOfflineTargetBill(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmOffline} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>{offlineTargetBill.roomNumber} ({offlineTargetBill.residentName})</span>
                  <span className="text-blue-600 font-bold font-mono">¥{offlineTargetBill.amount.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-slate-500">{offlineTargetBill.title}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">线下实收收款方式</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['现金收款', 'POS机刷卡'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setOfflineMethod(method)}
                      className={`p-2 rounded-xl border text-center font-medium transition-all ${
                        offlineMethod === method
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">经办收银员 / 管家姓名</label>
                <input
                  type="text"
                  required
                  value={offlineOperator}
                  onChange={(e) => setOfflineOperator(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setOfflineTargetBill(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  确认收款入账
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
