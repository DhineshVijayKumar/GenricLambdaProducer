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