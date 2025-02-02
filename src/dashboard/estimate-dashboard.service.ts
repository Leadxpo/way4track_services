
import { Injectable } from "@nestjs/common";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { EstimateRepository } from "src/estimate/repo/estimate.repo";
import { CommonResponse } from "src/models/common-response";
import axios from 'axios';

@Injectable()
export class EstimateDashboardService {

    constructor(
        private repo: EstimateRepository,
    ) { }


    async sendReceipt(): Promise<CommonResponse> {
        try {
            // --- Send SMS ---
            const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
            const smsParams = {
                username: "sharontelematics.trans",
                password: "bisrm",
                unicode: false,
                from: "SHARTE",
                to: "9494130830",
                text: "This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the receipt \nfor your selected products:\n $https://storage.googleapis.com/way4track-application/estimates/Invoice%20(1).pdf",
                dltContentId: "170717376366764870"
            };
    
            const smsResponse = await axios.get(smsUrl, { params: smsParams });
    
            // --- Send Email ---
            const emailUrl = "https://app.smtpprovider.com/api/send-mail";
            const emailParams = {
                to: "ark.kumar03@gmail.com",
                from: "info@sharontelematics.org",
                from_name: "sunil",
                subject: "reciept Link",
                body: "This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the receipt \nfor your selected products:\n $https://storage.googleapis.com/way4track-application/estimates/Invoice%20(1).pdf",
                token: "19a04d6ae3e382a86229740a17307c22"
            };
    
            const emailResponse = await axios.get(emailUrl, { params: emailParams });
    
            // --- Response Handling ---
            if (smsResponse.data && emailResponse.data) {
                return new CommonResponse(true, 200, "SMS & Email sent successfully", {
                    sms: smsResponse.data,
                    email: emailResponse.data
                });
            } else {
                return new CommonResponse(false, 56416, "Failed to send SMS or Email", {
                    sms: smsResponse.data || "SMS failed",
                    email: emailResponse.data || "Email failed"
                });
            }
        } catch (error) {
            console.error("Error sending SMS/Email:", error.message);
            return new CommonResponse(false, 5416, "Error occurred while sending SMS/Email", []);
        }
    }
    
    async sendInvoice(): Promise<CommonResponse> {
        try {
            // --- Send SMS ---
            const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
            const smsParams = {
                username: "sharontelematics.trans",
                password: "bisrm",
                unicode: false,
                from: "SHARTE",
                to: "9494130830",
                text: "This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the invoice \nfor your selected products:\n $https://storage.googleapis.com/way4track-application/estimates/Invoice%20(1).pdf",
                dltContentId: "170717376366764870"
            };
    
            const smsResponse = await axios.get(smsUrl, { params: smsParams });
    
            // --- Send Email ---
            const emailUrl = "https://app.smtpprovider.com/api/send-mail";
            const emailParams = {
                to: "ark.kumar03@gmail.com",
                from: "info@sharontelematics.org",
                from_name: "sunil",
                subject: "Invoice Link",
                body: "This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the invoice \nfor your selected products:\n $https://storage.googleapis.com/way4track-application/estimates/Invoice%20(1).pdf",
                token: "19a04d6ae3e382a86229740a17307c22"
            };
    
            const emailResponse = await axios.get(emailUrl, { params: emailParams });
    
            // --- Response Handling ---
            if (smsResponse.data && emailResponse.data) {
                return new CommonResponse(true, 200, "SMS & Email sent successfully", {
                    sms: smsResponse.data,
                    email: emailResponse.data
                });
            } else {
                return new CommonResponse(false, 56416, "Failed to send SMS or Email", {
                    sms: smsResponse.data || "SMS failed",
                    email: emailResponse.data || "Email failed"
                });
            }
        } catch (error) {
            console.error("Error sending SMS/Email:", error.message);
            return new CommonResponse(false, 5416, "Error occurred while sending SMS/Email", []);
        }
    }

    async sendEstimate(): Promise<CommonResponse> {
        try {
            // --- Send SMS ---
            const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
            const smsParams = {
                username: "sharontelematics.trans",
                password: "bisrm",
                unicode: false,
                from: "SHARTE",
                to: "9494130830",
                text: "This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the estimate \nfor your selected products:\n $https://storage.googleapis.com/way4track-application/estimates/Invoice%20(1).pdf",
                dltContentId: "170717376366764870"
            };
    
            const smsResponse = await axios.get(smsUrl, { params: smsParams });
    
            // --- Send Email ---
            const emailUrl = "https://app.smtpprovider.com/api/send-mail";
            const emailParams = {
                to: "ark.kumar03@gmail.com",
                from: "info@sharontelematics.org",
                from_name: "sunil",
                subject: "Estimate Link",
                body: "This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the estimate \nfor your selected products:\n $https://storage.googleapis.com/way4track-application/estimates/Invoice%20(1).pdf",
                token: "19a04d6ae3e382a86229740a17307c22"
            };
    
            const emailResponse = await axios.get(emailUrl, { params: emailParams });
    
            // --- Response Handling ---
            if (smsResponse.data && emailResponse.data) {
                return new CommonResponse(true, 200, "SMS & Email sent successfully", {
                    sms: smsResponse.data,
                    email: emailResponse.data
                });
            } else {
                return new CommonResponse(false, 56416, "Failed to send SMS or Email", {
                    sms: smsResponse.data || "SMS failed",
                    email: emailResponse.data || "Email failed"
                });
            }
        } catch (error) {
            console.error("Error sending SMS/Email:", error.message);
            return new CommonResponse(false, 5416, "Error occurred while sending SMS/Email", []);
        }
    }

    async getEstimates(req: {
        fromDate?: string; toDate?: string; status?: ClientStatusEnum; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        const VendorData = await this.repo.getEstimates(req)
        if (!VendorData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VendorData)
        }
    }

    async getEstimatesForReport(req: {
        estimateId?: string; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        const VendorData = await this.repo.getEstimatesForReport(req)
        if (!VendorData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VendorData)
        }
    }
}