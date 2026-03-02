// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  OtpVerification: undefined;
  Main: undefined;
  BookingDetail: {bookingId: string};
  VerifyCode: undefined;
  ServiceForm: {shopId: string; serviceId?: string};
  ShopSettings: {shopId: string};
  WorkingHours: {shopId: string};
  StaffManagement: {shopId: string};
};

export type MainTabParamList = {
  Dashboard: undefined;
  Bookings: undefined;
  Services: undefined;
  Settings: undefined;
};

// Data Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SHOP_OWNER' | 'SHOP_STAFF';
  shops?: Shop[];
}

export interface Shop {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  photos?: ShopPhoto[];
  services?: Service[];
  workingHours?: WorkingHours;
}

export interface ShopPhoto {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  category?: string;
}

export interface WorkingHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  status: BookingStatus;
  verificationCode: string;
  startTime: string;
  endTime: string;
  serviceAmount: number;
  displayAmount: number;
  freeCashUsed: number;
  freeCashEarned: number;
  paymentType: 'PAY_LATER' | 'ONLINE';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
  shop?: {
    id: string;
    name: string;
  };
  services?: BookingService[];
}

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface BookingService {
  id: string;
  serviceName: string;
  price: number;
  durationMinutes: number;
}

export interface DashboardStats {
  todayBookings: number;
  todayRevenue: number;
  pendingBookings: number;
  completedToday: number;
  totalCustomers: number;
  averageRating: number;
  weeklyComparison: {
    bookingsChange: number;
    revenueChange: number;
  };
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'SHOP_OWNER' | 'SHOP_STAFF';
  isActive: boolean;
  createdAt: string;
}

// Form Types
export interface ServiceFormData {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  category?: string;
  isActive: boolean;
}

export interface ShopFormData {
  name: string;
  description?: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
}
