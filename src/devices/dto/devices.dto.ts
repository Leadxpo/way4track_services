export class DeviceDto {
  id?: number;
  webProductId: number;
  webProductName: string;
  image?: string;
  model?: string;
  companyCode: string;
  unitCode: string
  name?: string;
  state?: string;
  city?: string;
  isRelay?: boolean;
  relayAmt?: number;
  isSubscription?: boolean;
  subscriptionMonthlyAmt?: number;
  subscriptionYearlyAmt?: number;
  isNetwork?: boolean;
  discount?: number;
  description?: string;
  amount: number;
}