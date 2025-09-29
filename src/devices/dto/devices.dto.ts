export class DeviceDto {
  id?: number;
  webProductId: number;
  webProductName: string;
  image?: string[];
  points?: { title: string; desc: string; file: string }[];
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
  network4gAmt?: number;
  network2gAmt?: number;
  isNetwork?: boolean;
  discount?: number;
  description?: string;
  amount: number;
  mediaFiles?: string[];
  pointFiles?: { title: string; desc: string; file: string }[];

}