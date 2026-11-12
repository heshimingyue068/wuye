import React, { useState } from 'react';
import { useProperty } from '../../../context/PropertyContext';
import { X, Check, ShieldCheck, ArrowRight, Receipt, CheckCircle2 } from 'lucide-react';
import { BillItem } from '../../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const { bills, payBills, currentProperty } = useProperty();

  // Filter bills for current property
  const currentRoomName = `${currentProperty.building}${currentProperty.unit}${currentProperty.room}`;
  const propertyBills = bills.filter((b) => b.roomNumber === currentRoomName);
  const unpaidBills = propertyBills.filter((b) => b.status === 'unpaid');
  const paidBills = propertyBills.filter((b) => b.status === 'paid');

  const [selectedBillIds, setSelectedBillIds] = useState<string[]>(
    unpaidBills.map((b) => b.id)
  );
  const [payMethod, setPayMethod] = useState<'微信支付' | '支付宝'>('微信支付');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState<BillItem | null>(null);

  if (!isOpen) return null;

  const totalAmount = unpaidBills
    .filter((b) => selectedBillIds.includes(b.id))
    .reduce((sum, b) => sum + b.amount, 0);

  const toggleSelect = (id: string) => {
    if (selectedBillIds.includes(id)) {
      setSelectedBillIds(selectedBillIds.filter((item) => item !== id));
    } else {
      setSelectedBillIds([...selectedBillIds, id]);
    }
  };

  const handlePay = () => {
    if (selectedBillIds.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      payBills(selectedBillIds, payMethod);
      setIsProcessing(false);
      // Show receipt for first paid item
      const paidItem = propertyBills.find((b) => b.id === selectedBillIds[0]);
      if (paidItem) {
        setShowReceipt({
          ...paidItem,
          status: 'paid',
          paymentMethod: payMethod,
          paidAt: new Date().toLocaleString(),
        });
      }
    }, 900);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">物业在线缴费中心</h3>
            <p className="text-xs text-slate-500 mt-0.5">{currentProperty.name} {currentRoomName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt View Mode */}
        {showReceipt ? (
          <div className="py-4 overflow-y-auto space-y-4">
            <div className="text-center py-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">支付成功 · 电子收据</h4>
              <p className="text-xs text-slate-500 mt-1">资金已实时进入物业专项监管结算账户</p>
            </div>

            {/* Simulated Tax/Property Receipt */}
            <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5 font-mono overflow-hidden">
              {/* Receipt Watermark Stamp */}
              <div className="absolute right-4 bottom-3 border-2 border-emerald-600/30 text-emerald-700/40 rounded-full w-24 h-24 flex items-center justify-center rotate-[-15deg] pointer-events-none text-center font-bold text-[11px] leading-tight">
                幸福里花园<br />财务专用章<br />(已入账)
              </div>

              <div className="flex justify-between text-slate-600 border-b border-dashed border-slate-300 pb-2">
                <span>收据流水号</span>
                <span className="font-semibold text-slate-900">{showReceipt.billNo}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>缴费房产</span>
                <span className="text-slate-900">{showReceipt.roomNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>收费类目</span>
                <span className="text-slate-900">{showReceipt.title}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>计费周期</span>
                <span className="text-slate-900">{showReceipt.period}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>支付方式</span>
                <span className="text-slate-900">{showReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600 border-t border-dashed border-slate-300 pt-2 text-sm font-bold">
                <span className="text-slate-900">实付总额</span>
                <span className="text-blue-600 tabular-nums">¥{showReceipt.amount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowReceipt(null);
                onClose();
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
            >
              完成并返回
            </button>
          </div>
        ) : (
          /* Normal Billing Selection */
          <div className="py-3 overflow-y-auto flex-1 space-y-4">
            {/* Unpaid section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-800">待缴费账单 ({unpaidBills.length})</span>
                <span className="text-[11px] text-slate-500">支持微信/支付宝快捷支付</span>
              </div>

              {unpaidBills.length === 0 ? (
                <div className="p-5 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-xs">
                  <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                  当前房产无待缴费账单，所有费用均已结清！
                </div>
              ) : (
                <div className="space-y-2">
                  {unpaidBills.map((bill) => {
                    const isSelected = selectedBillIds.includes(bill.id);
                    return (
                      <div
                        key={bill.id}
                        onClick={() => toggleSelect(bill.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900">{bill.title}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              账期: {bill.period} · 应缴截止: {bill.dueDate}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900 tabular-nums">
                            ¥{bill.amount.toFixed(2)}
                          </div>
                          <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            待支付
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            {unpaidBills.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-800 mb-2">选择支付方式</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('微信支付')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      payMethod === '微信支付'
                        ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800 font-semibold ring-1 ring-emerald-500'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    微信支付
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('支付宝')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      payMethod === '支付宝'
                        ? 'border-blue-500 bg-blue-50/60 text-blue-800 font-semibold ring-1 ring-blue-500'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    支付宝
                  </button>
                </div>
              </div>
            )}

            {/* Historical Paid section */}
            {paidBills.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-600 mb-1.5">最近已结清记录</div>
                <div className="space-y-1.5 max-h-28 overflow-y-auto">
                  {paidBills.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setShowReceipt(b)}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-100/70"
                    >
                      <div>
                        <div className="text-slate-800 font-medium truncate max-w-[210px]">{b.title}</div>
                        <div className="text-[10px] text-slate-500">{b.paidAt || '已缴费'} · {b.paymentMethod || '在线支付'}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 tabular-nums">¥{b.amount.toFixed(2)}</span>
                        <Receipt className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        {!showReceipt && unpaidBills.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] text-slate-500">已选 {selectedBillIds.length} 项合计:</div>
              <div className="text-lg font-extrabold text-blue-600 tabular-nums">
                ¥{totalAmount.toFixed(2)}
              </div>
            </div>
            <button
              onClick={handlePay}
              disabled={selectedBillIds.length === 0 || isProcessing}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                selectedBillIds.length === 0 || isProcessing
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>处理中...</span>
                </>
              ) : (
                <>
                  <span>立即支付 (¥{totalAmount.toFixed(2)})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
