import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PropertyItem,
  ResidentAuditItem,
  AccessLogItem,
  VisitorPassItem,
  TicketItem,
  BillItem,
  AnnouncementItem,
  ToastMessage,
  ViewMode,
  UserRoleMode,
} from '../types';

interface PropertyContextType {
  // Navigation & Role
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  roleMode: UserRoleMode;
  setRoleMode: (role: UserRoleMode) => void;

  // Property Selection
  properties: PropertyItem[];
  currentProperty: PropertyItem;
  currentPropertyId: string;
  setCurrentPropertyId: (id: string) => void;

  // Tickets
  tickets: TicketItem[];
  createTicket: (data: Omit<TicketItem, 'id' | 'createdAt' | 'status' | 'source'>) => void;
  createManualTicket: (data: Omit<TicketItem, 'id' | 'createdAt' | 'status' | 'source'>) => void;
  dispatchTicket: (ticketId: string, staff: { name: string; phone: string; role: string }) => void;
  staffAcceptTicket: (ticketId: string) => void;
  quickReplyTicket: (ticketId: string, replyText: string) => void;
  resolveTicket: (ticketId: string, note: string, image?: string) => void;
  evaluateTicket: (ticketId: string, rating: 'satisfied' | 'unsatisfied', comment?: string) => void;

  // Finance & Bills
  bills: BillItem[];
  payBills: (billIds: string[], method: '微信支付' | '支付宝') => void;
  recordOfflinePayment: (billId: string, method: '现金收款' | 'POS机刷卡', operator: string) => void;
  generateMonthlyBills: (period: string, unitPrice: number) => void;

  // Access Control & Visitors
  doors: string[];
  accessLogs: AccessLogItem[];
  visitorPasses: VisitorPassItem[];
  triggerDoorOpen: (doorName: string, user?: string, method?: '一键开门' | '访客二维码' | '人脸识别') => void;
  createVisitorPass: (data: { visitorName: string; carPlate?: string; validDurationHours: number }) => VisitorPassItem;

  // Resident Approvals
  residentAudits: ResidentAuditItem[];
  submitBindingApplication: (data: {
    applicantName: string;
    applicantPhone: string;
    propertyAddress: string;
    idCardLast4: string;
    proofType: '房产证' | '购房合同' | '租赁合同';
  }) => void;
  reviewBindingApplication: (auditId: string, status: 'approved' | 'rejected', notes?: string) => void;

  // Announcements
  announcements: AnnouncementItem[];
  publishAnnouncement: (data: Omit<AnnouncementItem, 'id' | 'publishedAt' | 'readCount'>) => void;

  // Toast System
  toasts: ToastMessage[];
  showToast: (content: string, type?: 'success' | 'info' | 'warning' | 'error', title?: string) => void;
  removeToast: (id: string) => void;

  // Demo Helpers
  resetToMockData: () => void;
  quickDemoTrigger: (scenario: 'repair' | 'complaint' | 'pay') => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_PROPERTIES: PropertyItem[] = [
  {
    id: 'prop-1',
    name: '幸福里花园',
    building: '3栋',
    unit: '2单元',
    room: '501室',
    residentName: '张三',
    residentPhone: '13800138000',
    isDefault: true,
    area: 118.5,
  },
  {
    id: 'prop-2',
    name: '阳光海岸',
    building: '1栋',
    unit: '1单元',
    room: '1202室',
    residentName: '张三',
    residentPhone: '13800138000',
    isDefault: false,
    area: 89.0,
  },
];

const INITIAL_DOORS = [
  '小区东大门 (人行通道)',
  '3栋单元门禁机',
  '地下地库负一层连廊门',
  '南侧机动车出入道闸',
];

const INITIAL_BILLS: BillItem[] = [
  {
    id: 'bill-101',
    billNo: 'CW2026030101',
    roomNumber: '3栋2单元501室',
    residentName: '张三',
    title: '2026年3月物业综合服务费',
    category: '物业服务费',
    period: '2026-03',
    amount: 260.0,
    dueDate: '2026-03-31',
    status: 'unpaid',
  },
  {
    id: 'bill-102',
    billNo: 'CW2026030102',
    roomNumber: '3栋2单元501室',
    residentName: '张三',
    title: '2026年2月公摊能耗与加压水电费',
    category: '公摊水电',
    period: '2026-02',
    amount: 45.8,
    dueDate: '2026-03-25',
    status: 'unpaid',
  },
  {
    id: 'bill-103',
    billNo: 'CW2026020108',
    roomNumber: '3栋2单元501室',
    residentName: '张三',
    title: '2026年2月专属地下车位管理费',
    category: '车位管理费',
    period: '2026-02',
    amount: 150.0,
    dueDate: '2026-02-28',
    status: 'paid',
    paidAt: '2026-02-26 15:32',
    paymentMethod: '微信支付',
  },
  {
    id: 'bill-201',
    billNo: 'CW2026030201',
    roomNumber: '1栋1单元1202室',
    residentName: '张三',
    title: '2026年3月物业服务费',
    category: '物业服务费',
    period: '2026-03',
    amount: 195.0,
    dueDate: '2026-03-31',
    status: 'unpaid',
  },
  {
    id: 'bill-301',
    billNo: 'CW2026030301',
    roomNumber: '2栋3单元402室',
    residentName: '王大伯',
    title: '2026年3月物业综合服务费',
    category: '物业服务费',
    period: '2026-03',
    amount: 210.0,
    dueDate: '2026-03-31',
    status: 'paid',
    paidAt: '2026-03-02 09:14',
    paymentMethod: '现金收款',
    operator: '王管家',
  },
  {
    id: 'bill-302',
    billNo: 'CW2026030302',
    roomNumber: '5栋1单元801室',
    residentName: '赵先生',
    title: '2026年3月物业服务费及公摊水电',
    category: '物业服务费',
    period: '2026-03',
    amount: 320.5,
    dueDate: '2026-03-31',
    status: 'unpaid',
  },
];

const INITIAL_TICKETS: TicketItem[] = [
  {
    id: 'GD20260312001',
    type: 'repair',
    category: '居家水暖维修',
    roomNumber: '3栋2单元501室',
    submitterName: '张三',
    submitterPhone: '13800138000',
    isAnonymous: false,
    isEmergency: false,
    content: '主卧卫生间洗手台下方角阀持续渗水，且水流有加大趋势，已先关闭入户角阀，希望师傅上门检查更换密封圈。',
    images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=60'],
    createdAt: '2026-03-12 09:20',
    expectedTime: '今天下午 14:00-16:00',
    status: 'processing',
    assignedStaff: {
      name: '张师傅',
      phone: '13911223344',
      role: '高级水电维修工',
    },
    adminReply: '已指派张师傅跟进，师傅已在准备配件，预计下午14:30准时上门检修。',
    repliedAt: '2026-03-12 09:35',
    source: 'H5业主端',
  },
  {
    id: 'GD20260312002',
    type: 'complaint',
    category: '安保与通道秩序',
    roomNumber: '3栋2单元501室',
    submitterName: '张三',
    submitterPhone: '13800138000',
    isAnonymous: true,
    isEmergency: true,
    content: '3栋单元门前消防登高面与疏散通道，经常有业主停放共享电瓶车与大型快递包裹，存在严重消防隐患！请物业安保严格巡查清理！',
    images: [],
    createdAt: '2026-03-12 08:45',
    status: 'pending',
    source: 'H5业主端',
  },
  {
    id: 'GD20260310003',
    type: 'suggestion',
    category: '社区设施优化',
    roomNumber: '1栋2单元301室',
    submitterName: '刘女士',
    submitterPhone: '13600001122',
    isAnonymous: false,
    isEmergency: false,
    content: '建议在小区中心小广场的儿童游乐区增设两张带遮阳棚的长椅，方便带娃的老人和家长休息。',
    images: [],
    createdAt: '2026-03-10 11:10',
    status: 'resolved',
    adminReply: '感谢刘女士的热心建议！工程部已完成实地勘测，目前已采纳方案，计划于本月20日前在儿童滑梯东侧完成2组防腐木休闲长椅的安装。',
    repliedAt: '2026-03-10 16:30',
    resolutionNote: '已列入3月份社区微改造项目立项清单并公示。',
    resolvedAt: '2026-03-10 16:30',
    evaluation: {
      rating: 'satisfied',
      comment: '物业响应很快，回复很详细，非常满意！',
      evaluatedAt: '2026-03-11 08:30',
    },
    source: 'H5业主端',
  },
];

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: '【紧急停水】明日9:00-17:00供水主管网加压泵房例行清洗消毒',
    content: '尊敬的幸福里花园全体业主/住户：为保障园区饮用水水质安全，自来水公司与我司定于明日（3月13日）9:00至17:00对中心加压泵房及高位水箱进行深度清洗消毒，届时全区将暂停自来水供应。请广大业主提前做好储水准备，外出前请务必确认关闭户内水龙头。给您带来的不便敬请谅解！',
    category: '紧急通知',
    isPinned: true,
    publisher: '幸福里花园物业服务中心',
    publishedAt: '2026-03-12 08:00',
    readCount: 428,
  },
  {
    id: 'ann-2',
    title: '【工程维护】本周四全区电梯安全梯控系统升级作业提示',
    content: '为提升电梯平层舒适度及智能物联网救援报警速度，维保单位将于3月15日对园区1-5栋各单元客梯进行分批错峰停运调试，单部电梯调试时长约40分钟，作业期间同单元另一部电梯正常运行，请配合现场安全员指引。',
    category: '工程维修',
    isPinned: false,
    publisher: '工程维保部',
    publishedAt: '2026-03-11 14:20',
    readCount: 295,
  },
  {
    id: 'ann-3',
    title: '【便民活动】“邻里有爱·便民服务周”免费磨刀理发与健康体检',
    content: '本周六上午9:00-11:30在社区中庭花园举办便民服务日活动，现场提供：传统手工磨刀、老人爱心剪发、血压血糖测量及家用小电器基础检测维修，欢迎各位邻里下楼参加！',
    category: '便民活动',
    isPinned: false,
    publisher: '客服部小管家',
    publishedAt: '2026-03-09 10:00',
    readCount: 512,
  },
];

const INITIAL_ACCESS_LOGS: AccessLogItem[] = [
  {
    id: 'log-1',
    doorName: '3栋单元门禁机',
    user: '张三 (3-2-501)',
    userType: '业主',
    method: '一键开门',
    time: '2026-03-12 09:12:05',
    status: '成功',
  },
  {
    id: 'log-2',
    doorName: '小区东大门 (人行通道)',
    user: '李师傅 (工程维修工)',
    userType: '员工',
    method: '刷卡',
    time: '2026-03-12 09:05:40',
    status: '成功',
  },
  {
    id: 'log-3',
    doorName: '小区东大门 (人行通道)',
    user: '陈先生 (访客通行码)',
    userType: '访客',
    method: '访客二维码',
    time: '2026-03-12 08:50:18',
    status: '成功',
  },
  {
    id: 'log-4',
    doorName: '南侧机动车出入道闸',
    user: '粤B·88888 (张三)',
    userType: '业主',
    method: '一键开门',
    time: '2026-03-12 08:30:22',
    status: '成功',
  },
];

const INITIAL_VISITOR_PASSES: VisitorPassItem[] = [
  {
    id: 'vp-1',
    visitorName: '陈先生 (亲友来访)',
    carPlate: '粤B·6V888',
    validDurationHours: 24,
    validUntil: '2026-03-13 08:30',
    passCode: 'VK-8842',
    createdAt: '2026-03-12 08:30',
    createdByProperty: '3栋2单元501室',
    status: '有效',
  },
];

const INITIAL_AUDITS: ResidentAuditItem[] = [
  {
    id: 'audit-1',
    applicantName: '李女士',
    applicantPhone: '13922334455',
    propertyAddress: '幸福里花园 5栋1单元802室',
    idCardLast4: '4321',
    proofType: '房产证',
    status: 'pending',
    appliedAt: '2026-03-12 09:10',
    notes: '申请人上传了不动产权证照片第一页与业主页，待管家核验。',
  },
  {
    id: 'audit-2',
    applicantName: '周小鹏',
    applicantPhone: '18677889900',
    propertyAddress: '幸福里花园 2栋2单元1003室',
    idCardLast4: '8890',
    proofType: '租赁合同',
    status: 'approved',
    appliedAt: '2026-03-11 15:30',
    reviewedAt: '2026-03-11 16:10',
    notes: '已核对租房合同原件及房东授权书，通过审核并已同步门禁白名单。',
  },
];

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role State
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');
  const [roleMode, setRoleMode] = useState<UserRoleMode>('owner');

  // Properties
  const [properties] = useState<PropertyItem[]>(INITIAL_PROPERTIES);
  const [currentPropertyId, setCurrentPropertyId] = useState<string>('prop-1');
  const currentProperty = properties.find((p) => p.id === currentPropertyId) || properties[0];

  // Core Data
  const [tickets, setTickets] = useState<TicketItem[]>(INITIAL_TICKETS);
  const [bills, setBills] = useState<BillItem[]>(INITIAL_BILLS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [accessLogs, setAccessLogs] = useState<AccessLogItem[]>(INITIAL_ACCESS_LOGS);
  const [visitorPasses, setVisitorPasses] = useState<VisitorPassItem[]>(INITIAL_VISITOR_PASSES);
  const [residentAudits, setResidentAudits] = useState<ResidentAuditItem[]>(INITIAL_AUDITS);
  const [doors] = useState<string[]>(INITIAL_DOORS);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (content: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', title?: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, content, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper date formatter
  const getNowFormatted = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // Door Access Action
  const triggerDoorOpen = (
    doorName: string,
    user: string = `${currentProperty.residentName} (${currentProperty.building}${currentProperty.room})`,
    method: '一键开门' | '访客二维码' | '人脸识别' = '一键开门'
  ) => {
    const newLog: AccessLogItem = {
      id: 'log-' + Date.now(),
      doorName,
      user,
      userType: roleMode === 'staff' ? '员工' : '业主',
      method,
      time: getNowFormatted() + ':' + new Date().getSeconds().toString().padStart(2, '0'),
      status: '成功',
    };
    setAccessLogs((prev) => [newLog, ...prev]);
    showToast(`【${doorName}】开门指令已下发，门锁已开启`, 'success');
  };

  // Create Visitor Pass
  const createVisitorPass = (data: { visitorName: string; carPlate?: string; validDurationHours: number }) => {
    const code = 'VK-' + Math.floor(1000 + Math.random() * 9000);
    const validUntilDate = new Date();
    validUntilDate.setHours(validUntilDate.getHours() + data.validDurationHours);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const validUntilStr = `${validUntilDate.getFullYear()}-${pad(validUntilDate.getMonth() + 1)}-${pad(validUntilDate.getDate())} ${pad(validUntilDate.getHours())}:${pad(validUntilDate.getMinutes())}`;

    const newPass: VisitorPassItem = {
      id: 'vp-' + Date.now(),
      visitorName: data.visitorName || '临时来访访客',
      carPlate: data.carPlate,
      validDurationHours: data.validDurationHours,
      validUntil: validUntilStr,
      passCode: code,
      createdAt: getNowFormatted(),
      createdByProperty: `${currentProperty.building}${currentProperty.unit}${currentProperty.room}`,
      status: '有效',
    };

    setVisitorPasses((prev) => [newPass, ...prev]);
    // Also log generated pass
    const newLog: AccessLogItem = {
      id: 'log-vp-' + Date.now(),
      doorName: '智能访客系统生成临时码',
      user: `${data.visitorName} (由${currentProperty.room}授权)`,
      userType: '访客',
      method: '访客二维码',
      time: getNowFormatted() + ':00',
      status: '成功',
    };
    setAccessLogs((prev) => [newLog, ...prev]);
    showToast('访客临时通行凭证已成功生成！', 'success');
    return newPass;
  };

  // Ticket Operations
  const createTicket = (data: Omit<TicketItem, 'id' | 'createdAt' | 'status' | 'source'>) => {
    const newId = `GD${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(tickets.length + 1).padStart(4, '0')}`;
    const newTicket: TicketItem = {
      ...data,
      id: newId,
      createdAt: getNowFormatted(),
      status: 'pending',
      source: 'H5业主端',
    };
    setTickets((prev) => [newTicket, ...prev]);
    const label = data.type === 'complaint' ? '投诉工单' : data.type === 'repair' ? '报修单' : '优化建议';
    showToast(
      data.isAnonymous ? `匿名${label}已成功提交，后台已自动隐去您的身份信息！` : `${label}已提交，物业客服已收到提醒！`,
      'success'
    );
  };

  const createManualTicket = (data: Omit<TicketItem, 'id' | 'createdAt' | 'status' | 'source'>) => {
    const newId = `GD${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(tickets.length + 1).padStart(4, '0')}`;
    const newTicket: TicketItem = {
      ...data,
      id: newId,
      createdAt: getNowFormatted(),
      status: 'pending',
      source: '客服代客录单',
    };
    setTickets((prev) => [newTicket, ...prev]);
    showToast(`客服已成功为业主【${data.roomNumber}】代录工单 (${newId})`, 'success');
  };

  const dispatchTicket = (ticketId: string, staff: { name: string; phone: string; role: string }) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'processing',
            assignedStaff: staff,
            adminReply: t.adminReply || `已将该事项指派给【${staff.name}（${staff.role}）】跟进处理。`,
            repliedAt: getNowFormatted(),
          };
        }
        return t;
      })
    );
    showToast(`工单已成功派发给【${staff.name}】！业主端进度已同步更新`, 'success');
  };

  const staffAcceptTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'processing',
            adminReply: `维修工已接单，正在前往现场勘验处理中。`,
            repliedAt: getNowFormatted(),
          };
        }
        return t;
      })
    );
    showToast('接单成功！已通知业主您正在前往处理', 'success');
  };

  const quickReplyTicket = (ticketId: string, replyText: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            adminReply: replyText,
            repliedAt: getNowFormatted(),
          };
        }
        return t;
      })
    );
    showToast('官方回复已发布，业主端即刻收到推送', 'success');
  };

  const resolveTicket = (ticketId: string, note: string, image?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'resolved',
            resolutionNote: note,
            resolutionImage: image,
            resolvedAt: getNowFormatted(),
            adminReply: t.adminReply || '该事项已处理完毕，请您验收评价。',
          };
        }
        return t;
      })
    );
    showToast('工单已完成整改结案，已邀请业主验收评价！', 'success');
  };

  const evaluateTicket = (ticketId: string, rating: 'satisfied' | 'unsatisfied', comment?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const isSatisfied = rating === 'satisfied';
          return {
            ...t,
            status: isSatisfied ? 'closed' : 'reopened',
            isEmergency: !isSatisfied, // trigger red alert if unsatisfied
            evaluation: {
              rating,
              comment,
              evaluatedAt: getNowFormatted(),
            },
            adminReply: isSatisfied
              ? t.adminReply + ' (业主已确认满意结案)'
              : (t.adminReply ? t.adminReply + '\n' : '') + `【系统提示】业主评价为不满意：“${comment || '需要进一步跟进'}”，工单已自动升级重新流转！`,
          };
        }
        return t;
      })
    );
    if (rating === 'satisfied') {
      showToast('感谢您的五星好评！服务闭环已完成', 'success');
    } else {
      showToast('已收到您的不满意反馈，工单已自动标记为高优先级预警重新流转处理！', 'warning');
    }
  };

  // Bills & Payment
  const payBills = (billIds: string[], method: '微信支付' | '支付宝') => {
    setBills((prev) =>
      prev.map((b) => {
        if (billIds.includes(b.id)) {
          return {
            ...b,
            status: 'paid',
            paidAt: getNowFormatted(),
            paymentMethod: method,
          };
        }
        return b;
      })
    );
    showToast(`支付成功！已结清 ${billIds.length} 笔账单，电子收据已生成`, 'success');
  };

  const recordOfflinePayment = (billId: string, method: '现金收款' | 'POS机刷卡', operator: string) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          return {
            ...b,
            status: 'paid',
            paidAt: getNowFormatted(),
            paymentMethod: method,
            operator: operator || '前台接待管家',
          };
        }
        return b;
      })
    );
    showToast('线下收款已成功补录入库，业主账单状态已实时变更！', 'success');
  };

  const generateMonthlyBills = (period: string, unitPrice: number) => {
    // Generate new bills for all properties
    const newBills: BillItem[] = properties.map((p, idx) => {
      const amount = Math.round(p.area * unitPrice * 10) / 10;
      return {
        id: `bill-gen-${Date.now()}-${idx}`,
        billNo: `CW${period.replace('-', '')}0${idx + 1}`,
        roomNumber: `${p.building}${p.unit}${p.room}`,
        residentName: p.residentName,
        title: `${period.replace('-', '年')}月物业综合服务费`,
        category: '物业服务费',
        period,
        amount,
        dueDate: `${period}-28`,
        status: 'unpaid',
      };
    });
    setBills((prev) => [...newBills, ...prev]);
    showToast(`已成功为园区生成 ${newBills.length} 户【${period}】月度账单！`, 'success');
  };

  // Resident Audits
  const submitBindingApplication = (data: {
    applicantName: string;
    applicantPhone: string;
    propertyAddress: string;
    idCardLast4: string;
    proofType: '房产证' | '购房合同' | '租赁合同';
  }) => {
    const newAudit: ResidentAuditItem = {
      id: 'audit-' + Date.now(),
      ...data,
      status: 'pending',
      appliedAt: getNowFormatted(),
      notes: '由业主端 H5 提交认证申请，请管家核实房屋产权人信息。',
    };
    setResidentAudits((prev) => [newAudit, ...prev]);
    showToast('房屋绑定申请已提交，物业管家将在1个工作日内完成审核！', 'success');
  };

  const reviewBindingApplication = (auditId: string, status: 'approved' | 'rejected', notes?: string) => {
    setResidentAudits((prev) =>
      prev.map((a) => {
        if (a.id === auditId) {
          return {
            ...a,
            status,
            reviewedAt: getNowFormatted(),
            notes: notes || a.notes,
          };
        }
        return a;
      })
    );
    if (status === 'approved') {
      showToast('审核通过！该业主身份已确认，门禁通行白名单已自动开通', 'success');
    } else {
      showToast('已驳回该申请，请核实补充材料后重试', 'warning');
    }
  };

  // Announcements
  const publishAnnouncement = (data: Omit<AnnouncementItem, 'id' | 'publishedAt' | 'readCount'>) => {
    const newAnn: AnnouncementItem = {
      ...data,
      id: 'ann-' + Date.now(),
      publishedAt: getNowFormatted(),
      readCount: 1,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast(data.isPinned ? '【置顶紧急公告】已向全区业主端实时广播！' : '新社区公告已发布！', 'success');
  };

  // Demo Helpers
  const resetToMockData = () => {
    setTickets(INITIAL_TICKETS);
    setBills(INITIAL_BILLS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAccessLogs(INITIAL_ACCESS_LOGS);
    setVisitorPasses(INITIAL_VISITOR_PASSES);
    setResidentAudits(INITIAL_AUDITS);
    setCurrentPropertyId('prop-1');
    setRoleMode('owner');
    showToast('演示数据已重置为初始标准状态', 'info');
  };

  const quickDemoTrigger = (scenario: 'repair' | 'complaint' | 'pay') => {
    if (scenario === 'repair') {
      createTicket({
        type: 'repair',
        category: '居家水暖维修',
        roomNumber: `${currentProperty.building}${currentProperty.unit}${currentProperty.room}`,
        submitterName: currentProperty.residentName,
        submitterPhone: currentProperty.residentPhone,
        isAnonymous: false,
        isEmergency: false,
        content: '厨房洗菜池下水软管脱落漏水，急需师傅上门协助固定并更换密封卡箍。',
        images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60'],
        expectedTime: '今天上午 10:00-11:00',
      });
    } else if (scenario === 'complaint') {
      createTicket({
        type: 'complaint',
        category: '设施噪音',
        roomNumber: `${currentProperty.building}${currentProperty.unit}${currentProperty.room}`,
        submitterName: currentProperty.residentName,
        submitterPhone: currentProperty.residentPhone,
        isAnonymous: true,
        isEmergency: true,
        content: '楼顶生活二次加压水泵疑似轴承磨损，夜间发出持续嗡嗡低频共振噪音，严重影响高层业主休息，请即刻派人排查维修！',
        images: [],
      });
    } else if (scenario === 'pay') {
      const unpaid = bills.filter((b) => b.status === 'unpaid');
      if (unpaid.length > 0) {
        payBills([unpaid[0].id], '微信支付');
      } else {
        showToast('暂无待缴账单，可点击物业后台“生成月度账单”', 'info');
      }
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        viewMode,
        setViewMode,
        roleMode,
        setRoleMode,
        properties,
        currentProperty,
        currentPropertyId,
        setCurrentPropertyId,
        tickets,
        createTicket,
        createManualTicket,
        dispatchTicket,
        staffAcceptTicket,
        quickReplyTicket,
        resolveTicket,
        evaluateTicket,
        bills,
        payBills,
        recordOfflinePayment,
        generateMonthlyBills,
        doors,
        accessLogs,
        visitorPasses,
        triggerDoorOpen,
        createVisitorPass,
        residentAudits,
        submitBindingApplication,
        reviewBindingApplication,
        announcements,
        publishAnnouncement,
        toasts,
        showToast,
        removeToast,
        resetToMockData,
        quickDemoTrigger,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};
