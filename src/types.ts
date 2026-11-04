export interface ClientCoupon {
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed' | 'addon';
  discountValue: number;
  expires: string;
  description: string;
}

export interface PastAppointment {
  id: string;
  date: string;
  time: string;
  technician: string;
  set: string;
  shape: string;
  colors: string[];
  addOns: string[];
  amountPaid: number;
  tip: number;
  total: number;
  pointsEarned: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  tier: string;
  sparkleCash: number;
  coupons: ClientCoupon[];
  lastAppointment: PastAppointment;
  history: Array<{
    date: string;
    set: string;
    artist: string;
    paid: string;
  }>;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  durationMinutes: number;
  description: string;
  popularShapes: string[];
}

export interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  artist: string;
  serviceAvailable: string;
}

export interface LimitedEditionItem {
  id: string;
  title: string;
  price: number;
  remainingSlots: number;
  badge: string;
  palette: string[];
  description: string;
  trendingScore: string;
}

export interface NailInspiration {
  trendingShapes: Array<{ name: string; vibe: string; length: string }>;
  trendingFinishes: string[];
  colorPalettes: Array<{ name: string; colors: string[]; desc: string }>;
}

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'soa';
  text: string;
  spokenText?: string;
  timestamp: string;
  intent?: string;
  actionData?: any;
  durationSeconds?: number;
}

export interface BookingRecord {
  id: string;
  clientName: string;
  serviceName: string;
  artist: string;
  date: string;
  time: string;
  price: number;
  couponApplied: string;
  status: string;
  bookedAt?: string;
}
