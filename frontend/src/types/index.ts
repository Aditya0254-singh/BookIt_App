export interface Experience {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: string;
  category: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  createdAt: string;
}

export interface Slot {
  id: number;
  experienceId: number;
  date: string;
  time: string;
  availableSpots: number;
  totalSpots: number;
}

export interface BookingRequest {
  experienceId: number;
  slotId: number;
  name: string;
  email: string;
  phone?: string;
  guests: number;
  promoCode?: string;
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  message: string;
  total?: number;
}

export interface PromoValidationResponse {
  valid: boolean;
  discount: number;
  message?: string;
}