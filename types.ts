
export enum UserRole {
  GUEST = 'GUEST',
  DONOR = 'DONOR',
  RECEIVER = 'RECEIVER',
  NGO = 'NGO',
  GOVERNMENT = 'GOVERNMENT',
  DELIVERY = 'DELIVERY'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: { lat: number; lng: number };
}

export interface Medicine {
  id: string;
  name: string;
  expiryDate: string;
  quantity: number;
  status: 'PENDING_COLLECTION' | 'VERIFIED' | 'IN_TRANSIT' | 'DELIVERED';
  donorId: string;
  receiverId?: string;
  ngoId?: string;
  trackingId?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'SUCCESS' | 'INFO' | 'ALERT';
  timestamp: Date;
}
