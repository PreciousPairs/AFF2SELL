export interface Product {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  stockLevel: number;
}

export interface PricingStrategy {
  id: string;
  name: string;
  // Add additional properties as required
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
}

export interface Message {
  type: string;
  data: any;
}