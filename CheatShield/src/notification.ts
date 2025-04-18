interface Transaction {
  userId: string;
  amount: number;
  merchantId: string;
  time: string;
  ipAddress: string;
  deviceInfo: any;
  geolocation: any;
}

export function sendFraudAlert(transaction: Transaction): void {
  // In a real application, this would send an email, SMS, or other notification
  console.log('FRAUD ALERT:', {
    userId: transaction.userId,
    amount: transaction.amount,
    location: transaction.geolocation,
    device: transaction.deviceInfo,
    timestamp: new Date().toISOString()
  });
}
