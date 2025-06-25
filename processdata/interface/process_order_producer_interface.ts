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

export interface TargetOrderModel { 
  order: { 
    id: string;                 // Order ID
    createdAt: string;          // ISO format date (YYYY-MM-DD) 
    customer: { 
      id: string;               // Customer ID 
    }; 
    location: { 
      storeId: string;          // Store ID as string 
    }; 
    status: string;             // Normalized status 
    payment: { 
      method: string;           // Payment method 
      total: number;            // Total amount 
    }; 
    shipping: {                 // Always included, may have empty fields 
      address: { 
        line1: string; 
        city: string; 
        state: string; 
        postalCode: string; 
        country: string; 
      } 
    }; 
  }; 
  items: { 
    productId: string;          // Product SKU 
    quantity: number;           // Quantity 
    price: { 
      base: number;             // Unit price 
      discount: number;         // Discount (0 if none) 
      final: number;            // Final price after discount 
    }; 
  }[]; 
  metadata: { 
    source: string;             // Source system identifier 
    notes: string;              // Notes (empty string if none) 
    processedAt: string;        // ISO timestamp of processing 
  }; 
} 