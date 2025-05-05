export class OTPDto {
  // id: number;
  staffId: string;
  password: string;
  otp: string;
  expiresAt: Date;
  phoneNumber: string;
  companyCode: string
  unitCode: string
  isResend?: boolean

}

export class VerifyOtpDto {
  staffId: string;
  phoneNumber: string;
  otp: string;
}

// export class OTPDto {
//   staffId: string;
// }

export class ChangePasswordDto {
  staffId: string;
  otp: string;
  newPassword: string;
}
