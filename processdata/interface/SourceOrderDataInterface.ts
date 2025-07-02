export interface SourceOrderData { 
  orderId: string;              // Required: Order identifier 
  orderDate: string;            // Required: Date in MM/DD/YYYY format 
  customerId: string;           // Required: Customer identifier 
  storeId: number;              // Required: Store where order was placed 

  items: {                      // Required: At least one item 
    sku: string;                // Required: Product SKU 
    quantity: number;           // Required: Quantity ordered 
    unitPrice: number;          // Required: Price per unit 
    discountAmount?: number;    // Optional: Discount applied 
  }[]; 

  paymentMethod: string;        // Required: Payment method used 
  totalAmount: number;          // Required: Total order amount 
  status: string;               // Required: Order status (NEW, PROCESSING, SHIPPED, DELIVERED, CANCELLED) 

  shippingAddress?: {           // Optional: Shipping address 
    street: string; 
    city: string; 
    state: string; 
    zipCode: string; 
    country: string; 
  }; 

  notes?: string;               // Optional: Additional notes 
} 