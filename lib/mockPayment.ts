export type PaymentMethod = 'card' | 'account' | 'pay';

export interface PaymentRequest {
  amount: number;
  method: PaymentMethod;
  contributorName: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Simulate payment processing with delay
export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate occasional failures (5% failure rate)
  const shouldFail = Math.random() < 0.05;
  
  if (shouldFail) {
    return {
      success: false,
      error: 'Payment processing failed. Please try again.',
    };
  }
  
  // Generate mock transaction ID
  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    success: true,
    transactionId,
  };
}








