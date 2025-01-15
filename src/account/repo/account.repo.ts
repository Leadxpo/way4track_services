import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AccountEntity } from "../entity/account.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { VoucherTypeEnum } from "src/voucher/enum/voucher-type-enum";
import { AccountIdDto } from "../dto/account.id.dto";
import { PaymentType } from "src/asserts/enum/payment-type.enum";



@Injectable()

export class AccountRepository extends Repository<AccountEntity> {

    constructor(private dataSource: DataSource) {
        super(AccountEntity, dataSource.createEntityManager());
    }

    async addVoucher(req: AccountIdDto) {
        const accountRepository = this.dataSource.getRepository(AccountEntity);
        const voucherRepository = this.dataSource.getRepository(VoucherEntity);

        const account = new AccountEntity()
        account.accountNumber = req.fromAccountNumber
        const voucher = await voucherRepository.findOne({
            where: {
                companyCode: req.companyCode,
                unitCode: req.unitCode,
                fromAccount: account,
            },
        });

        if (!voucher) {
            throw new Error('Voucher not found.');
        }

        // Fetch account details (From Account)
        const fromAccount = await accountRepository.findOne({
            where: { companyCode: req.companyCode, unitCode: req.unitCode, accountNumber: req.fromAccountNumber },
        });

        if (!fromAccount) {
            throw new Error('From account not found.');
        }

        // Handle Bank-to-Bank Contra Transactions
        if (voucher.voucherType === VoucherTypeEnum.CONTRA && voucher.paymentType === PaymentType.BANK) {
            if (!req.toAccountNumber) {
                throw new Error('To account number is required for Bank-to-Bank contra transactions.');
            }

            const toAccount = await accountRepository.findOne({
                where: { companyCode: req.companyCode, unitCode: req.unitCode, accountNumber: req.toAccountNumber },
            });

            if (!toAccount) {
                throw new Error('To account not found for contra transaction.');
            }

            const voucherAmount = voucher.amount;
            fromAccount.totalAmount -= voucherAmount; // Debit from source account
            toAccount.totalAmount += voucherAmount; // Credit to destination account

            await accountRepository.save([fromAccount, toAccount]);

            return {
                type: 'Bank-to-Bank',
                fromAccountNumber: fromAccount.accountNumber,
                toAccountNumber: toAccount.accountNumber,
                updatedFromAccountTotal: fromAccount.totalAmount,
                updatedToAccountTotal: toAccount.totalAmount,
            };
        }

        // Handle all other voucher types
        const voucherAmount = voucher.amount;
        let updatedTotal = fromAccount.totalAmount;

        switch (voucher.voucherType) {
            case VoucherTypeEnum.RECEIPT:
                updatedTotal += voucherAmount;
                break;
            case VoucherTypeEnum.PAYMENT:
            case VoucherTypeEnum.JOURNAL:
            case VoucherTypeEnum.PURCHASE:
            // case VoucherTypeEnum.INVOICE:
                updatedTotal -= voucherAmount;
                break;
            case VoucherTypeEnum.CONTRA:
                if (voucher.paymentType === PaymentType.CASH) {
                    updatedTotal += voucherAmount;
                }
                break;
            default:
                throw new Error(`Unhandled voucher type: ${voucher.voucherType}`);
        }

        fromAccount.totalAmount = updatedTotal;

        await accountRepository.save(fromAccount);

        return {
            accountNumber: fromAccount.accountNumber,
            accountName: fromAccount.name,
            accountType: fromAccount.accountType,
            generationDate: voucher.generationDate,
            updatedTotalAmount: updatedTotal,
            voucherType: voucher.voucherType,
            paymentType: voucher.paymentType,
            amount: voucher.amount,
        };
    }

    async getAccountBySearch(req: {
        accountName?: string; accountNumber?: string; companyCode?: string;
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('ac')
            .where(`ac.company_code = "${req.companyCode}"`)
            .andWhere(`ac.unit_code = "${req.unitCode}"`)
        if (req.accountName) {
            query.andWhere('ac.account_name = :accountName', { accountName: req.accountName });
        }

        if (req.accountNumber) {
            query.andWhere('ac.account_number = :accountNumber', { accountNumber: req.accountNumber });
        }
        const result = await query.getRawMany();
        return result;
    }

}