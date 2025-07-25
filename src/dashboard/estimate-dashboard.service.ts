
import { Injectable } from "@nestjs/common";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { EstimateRepository } from "src/estimate/repo/estimate.repo";
import { CommonResponse } from "src/models/common-response";
import axios from 'axios';
import { EstimateSendDto } from "src/estimate/dto/estimate.send.dto";
import { ClientRepository } from "src/client/repo/client.repo";

@Injectable()
export class EstimateDashboardService {

    constructor(
        private repo: EstimateRepository,
        private clientRepo: ClientRepository
    ) { }


    async sendReceipt(dto: EstimateSendDto): Promise<CommonResponse> {
        try {
            const estimate = await this.repo.findOne({ where: { id: dto.id } })
            const client = await this.clientRepo.findOne({ where: { id: dto.clientId } })

            if (!estimate) {
                return new CommonResponse(false, 404, "Estimate not found", null);
            }
            if (!client) {
                return new CommonResponse(false, 404, "Client not found", null);
            }
            // --- Send SMS ---
            const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
            const smsParams = {
                username: "sharontelematics.trans",
                password: "bisrm",
                unicode: false,
                from: "SHARTE",
                to: '+919494130830',
                text: `This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the receipt \nfor your selected products:\n ${estimate.receiptPdfUrl}`,
                dltContentId: "170717376366764870"
            };
            //smsUrl, { params: smsParams }
            const smsResponse = await axios.get(`https://pgapi.smartping.ai/fe/api/v1/send?username=sharontelematics.trans&password=bisrm&unicode=false&from=SHARTE&to=${client.phoneNumber}&text=This%20is%20a%20message%20from%20Sharlon%20%0ATelematrice.%20Please%20click%20the%20%0Alink%20below%20to%20view%20the%20receipt%20%0Afor%20your%20selected%20products%3A%0A%20${estimate.receiptPdfUrl}%0ASHARTE&dltContentId=1707173763667648701`);

            // --- Send Email ---
            // const emailUrl = "https://app.smtpprovider.com/api/send-mail";
            // const emailParams = {
            //     to: "ark.kumar03@gmail.com",
            //     from: "info@sharontelematics.org",
            //     from_name: "sunil",
            //     subject: "reciept Link",
            //     body: "This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the receipt \nfor your selected products:\n $https://storage.googleapis.com/way4track-application/estimates/Invoice%20(1).pdf",
            //     token: "19a04d6ae3e382a86229740a17307c22"
            // };

            // const emailResponse = await axios.get(emailUrl, { params: emailParams });

            // --- Response Handling --- && emailResponse.data
            if (smsResponse.data) {
                return new CommonResponse(true, 200, "SMS & Email sent successfully", {
                    sms: smsResponse.data,
                    // email: emailResponse.data
                });
            } else {
                return new CommonResponse(false, 56416, "Failed to send SMS or Email", {
                    sms: smsResponse.data || "SMS failed",
                    // email: emailResponse.data || "Email failed"
                });
            }
        } catch (error) {
            console.error("Error sending SMS/Email:", error.message);
            return new CommonResponse(false, 5416, "Error occurred while sending SMS/Email", []);
        }
    }

    async sendInvoice(dto: EstimateSendDto): Promise<CommonResponse> {
        try {

            const estimate = await this.repo.findOne({ where: { id: dto.id } })
            const client = await this.clientRepo.findOne({ where: { id: dto.clientId } })

            if (!estimate) {
                return new CommonResponse(false, 404, "Estimate not found", null);
            }
            if (!client) {
                return new CommonResponse(false, 404, "Client not found", null);
            }
            // --- Send SMS ---
            const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
            const smsParams = {
                username: "sharontelematics.trans",
                password: "bisrm",
                unicode: false,
                from: "SHARTE",
                to: client.phoneNumber,
                text: `This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the invoice \nfor your selected products:\n ${estimate.invoicePdfUrl}`,
                dltContentId: "170717376366764870"
            };

            // const smsResponse = await axios.get(smsUrl, { params: smsParams });
            const smsResponse = await axios.get(`https://pgapi.smartping.ai/fe/api/v1/send?username=sharontelematics.trans&password=bisrm&unicode=false&from=SHARTE&to=${client.phoneNumber}&text=This%20is%20a%20message%20from%20Sharlon%20%0ATelematrice.%20Kindly%20click%20the%20%0Alink%20below%20to%20view%20the%20invoice%20%0Afor%20your%20selected%20products%3A%0A${estimate.invoicePdfUrl}%0ASHARTE&dltContentId=1707173763653536118`);

            // --- Send Email ---
            // const emailUrl = "https://app.smtpprovider.com/api/send-mail";
            // const emailParams = {
            //     to: "ark.kumar03@gmail.com",
            //     from: "info@sharontelematics.org",
            //     from_name: "sunil",
            //     subject: "Invoice Link",
            //     body: "This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the invoice \nfor your selected products:\n $https://storage.googleapis.com/way4track-application/estimates/Invoice%20(1).pdf",
            //     token: "19a04d6ae3e382a86229740a17307c22"
            // };

            // const emailResponse = await axios.get(emailUrl, { params: emailParams });
            //&& emailResponse.data
            // --- Response Handling ---
            if (smsResponse.data) {
                return new CommonResponse(true, 200, "SMS & Email sent successfully", {
                    sms: smsResponse.data,
                    // email: emailResponse.data
                });
            } else {
                return new CommonResponse(false, 56416, "Failed to send SMS or Email", {
                    sms: smsResponse.data || "SMS failed",
                    // email: emailResponse.data || "Email failed"
                });
            }
        } catch (error) {
            console.error("Error sending SMS/Email:", error.message);
            return new CommonResponse(false, 5416, "Error occurred while sending SMS/Email", []);
        }
    }

    async sendEstimate(dto: EstimateSendDto): Promise<CommonResponse> {
        try {
            const estimate = await this.repo.findOne({ where: { id: dto.id } })
            const client = await this.clientRepo.findOne({ where: { id: dto.clientId } })

            if (!estimate) {
                return new CommonResponse(false, 404, "Estimate not found", null);
            }
            if (!client) {
                return new CommonResponse(false, 404, "Client not found", null);
            }
            // --- Send SMS ---
            const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
            const smsParams = {
                username: "sharontelematics.trans",
                password: "bisrm",
                unicode: false,
                from: "SHARTE",
                to: client.phoneNumber,
                text: `This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the estimate \nfor your selected products:\n  ${estimate.estimatePdfUrl}`,
                dltContentId: "170717376366764870"
            };

            // const smsResponse = await axios.get(smsUrl, { params: smsParams });
            const smsResponse = await axios.get(`https://pgapi.smartping.ai/fe/api/v1/send?username=sharontelematics.trans&password=bisrm&unicode=false&from=SHARTE&to=${client.phoneNumber}&text=This%20is%20a%20message%20from%20Sharlon%20%0ATelematrice.%20Please%20click%20the%20%0Alink%20below%20to%20view%20the%20%0Aestimation%20for%20your%20selected%20%0Aproducts%3A%0A${estimate.estimatePdfUrl}%0ASHARTE&dltContentId=1707173763638441204`);

            // --- Send Email ---
            // const emailUrl = "https://app.smtpprovider.com/api/send-mail";
            // const emailParams = {
            //     to: "ark.kumar03@gmail.com",
            //     from: "info@sharontelematics.org",
            //     from_name: "sunil",
            //     subject: "Estimate Link",
            //     body: "This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the estimate \nfor your selected products:\n $https://storage.googleapis.com/way4track-application/estimates/Invoice%20(1).pdf",
            //     token: "19a04d6ae3e382a86229740a17307c22"
            // };

            // const emailResponse = await axios.get(emailUrl, { params: emailParams });
            //&& emailResponse.data
            // --- Response Handling ---
            if (smsResponse.data) {
                return new CommonResponse(true, 200, "SMS & Email sent successfully", {
                    sms: smsResponse.data,
                    // email: emailResponse.data
                });
            } else {
                return new CommonResponse(false, 56416, "Failed to send SMS or Email", {
                    sms: smsResponse.data || "SMS failed",
                    // email: emailResponse.data || "Email failed"
                });
            }
        } catch (error) {
            console.error("Error sending SMS/Email:", error.message);
            return new CommonResponse(false, 5416, "Error occurred while sending SMS/Email", []);
        }
    }

    async sendHiring(dto: EstimateSendDto): Promise<CommonResponse> {
        try {
            const estimate = await this.repo.findOne({ where: { id: dto.id } })
            const client = await this.clientRepo.findOne({ where: { id: dto.clientId } })

            if (!estimate) {
                return new CommonResponse(false, 404, "Estimate not found", null);
            }
            if (!client) {
                return new CommonResponse(false, 404, "Client not found", null);
            }
            // --- Send SMS ---
            const smsUrl = "https://pgapi.smartping.ai/fe/api/v1/send";
            const smsParams = {
                username: "sharontelematics.trans",
                password: "bisrm",
                unicode: false,
                from: "SHARTE",
                to: client.phoneNumber,
                text: `This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the estimate \nfor your selected products:\n  ${estimate.estimatePdfUrl}`,
                dltContentId: "170717376366764870"
            };

            // const smsResponse = await axios.get(smsUrl, { params: smsParams });
            const smsResponse = await axios.get(`https://pgapi.smartping.ai/fe/api/v1/send?username=sharontelematics.trans&password=bisrm&unicode=false&from=SHARTE&to=8688214671&text=Welcome%20to%20Sharlon%20%0ATelematrice%20%7B%23var%23%7D%21%20%2C%20%0Aholding%20ID%20%7B%23var%23%7D%2C%20has%20%0Abeen%20appointed%20as%20%7B%23var%23%7D%20%0Aat%20the%20%7B%23var%23%7D%20%0Abranch&dltContentId=1707173519778556582`);

            // --- Send Email ---
            // const emailUrl = "https://app.smtpprovider.com/api/send-mail";
            // const emailParams = {
            //     to: "ark.kumar03@gmail.com",
            //     from: "info@sharontelematics.org",
            //     from_name: "sunil",
            //     subject: "Estimate Link",
            //     body: "This is a message from Sharlon \nTelematrice. Please click the \nlink below to view the estimate \nfor your selected products:\n $https://storage.googleapis.com/way4track-application/estimates/Invoice%20(1).pdf",
            //     token: "19a04d6ae3e382a86229740a17307c22"
            // };

            // const emailResponse = await axios.get(emailUrl, { params: emailParams });
            //&& emailResponse.data
            // --- Response Handling ---
            if (smsResponse.data) {
                return new CommonResponse(true, 200, "SMS & Email sent successfully", {
                    sms: smsResponse.data,
                    // email: emailResponse.data
                });
            } else {
                return new CommonResponse(false, 56416, "Failed to send SMS or Email", {
                    sms: smsResponse.data || "SMS failed",
                    // email: emailResponse.data || "Email failed"
                });
            }
        } catch (error) {
            console.error("Error sending SMS/Email:", error.message);
            return new CommonResponse(false, 5416, "Error occurred while sending SMS/Email", []);
        }
    }

    async getEstimates(req: {
        fromDate?: string; toDate?: string; status?: ClientStatusEnum; companyCode?: string;
        unitCode?: string;branch?:number
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