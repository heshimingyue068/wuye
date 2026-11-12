export type ViewMode = 'mobile' | 'desktop';

export type UserRoleMode = 'owner' | 'staff';

export interface PropertyItem {
  id: string;
  name: string;
  building: string;
  unit: string;
  room: string;
  residentName: string;
  residentPhone: string;
  isDefault: boolean;
  area: number; // 平米
}

export interface ResidentAuditItem {
  id: string;
  applicantName: string;
  applicantPhone: string;
  propertyAddress: string;
  idCardLast4: string;
  proofType: '房产证' | '购房合同' | '租赁合同';
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface AccessLogItem {
  id: string;
  doorName: string;
  user: string;
  userType: '业主' | '访客' | '员工';
  method: '一键开门' | '访客二维码' | '人脸识别' | '刷卡';
  time: string;
  status: '成功' | '已拒绝';
}

export interface VisitorPassItem {
  id: string;
  visitorName: string;
  carPlate?: string;
  validDurationHours: number;
  validUntil: string;
  passCode: string;
  createdAt: string;
  createdByProperty: string;
  status: '有效' | '已核销' | '已过期';
}

export type TicketType = 'repair' | 'complaint' | 'suggestion';
export type TicketStatus = 'pending' | 'processing' | 'resolved' | 'closed' | 'reopened';

export interface TicketItem {
  id: string;
  type: TicketType;
  category: string;
  roomNumber: string;
  submitterName: string;
  submitterPhone: string;
  isAnonymous: boolean;
  isEmergency: boolean;
  content: string;
  images: string[];
  createdAt: string;
  expectedTime?: string;
  status: TicketStatus;
  assignedStaff?: {
    name: string;
    phone: string;
    role: string;
  };
  adminReply?: string;
  repliedAt?: string;
  resolutionNote?: string;
  resolutionImage?: string;
  resolvedAt?: string;
  evaluation?: {
    rating: 'satisfied' | 'unsatisfied';
    comment?: string;
    evaluatedAt: string;
  };
  source: 'H5业主端' | '客服代客录单';
}

export interface BillItem {
  id: string;
  billNo: string;
  roomNumber: string;
  residentName: string;
  title: string;
  category: '物业服务费' | '公摊水电' | '车位管理费';
  period: string; // e.g. "2026-03"
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'paid';
  paidAt?: string;
  paymentMethod?: '微信支付' | '支付宝' | '现金收款' | 'POS机刷卡';
  operator?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: '紧急通知' | '工程维修' | '便民活动' | '温馨提示';
  isPinned: boolean;
  publisher: string;
  publishedAt: string;
  readCount: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  content: string;
}
