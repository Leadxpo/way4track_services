import { LedgerEntity } from "src/ledger/entity/ledger.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UnderType {
    PRIMARY = "primary",
    SECONDARY = "secondary"
}

export enum UnderPrimary {
    ASSETS = "assets",
    LIABILITIES = "liabilities",
    EXPENSES = "expenses",
    INCOME = "income"
}

export enum UnderSecondary {
    BANK_ACCOUNTS = "bank_accounts",
    BANK_OD = "bank_od",
    BRANCH_DIVISION = "branch_division",
    CAPITAL_ACCOUNT = "capital_account",
    CASH_IN_HAND = "cash_in_hand",
    CURRENT_ASSETS = "current_assets",
    CURRENT_LIABILITIES = "current_liabilities",
    DEPOSITS = "deposits",
    DIRECT_EXPENSES = "direct_expenses",
    DIRECT_INCOMES = "direct_incomes",
    DUTIES_AND_TAXES = "duties_and_taxes",
    INDIRECT_EXPENSES = "indirect_expenses",
    INDIRECT_INCOME = "indirect_income",
    FIXED_ASSETS = "fixed_assets",
    INVESTMENTS = "investments",
    LOANS_ADVANCES_ASSETS = "loans_advances_assets",
    LOANS_LIABILITY = "loans_liability",
    MISC_EXPENSES_ASSET = "misc_expenses_asset",
    PROVISIONS = "provisions",
    PURCHASE_ACCOUNT = "purchase_account",
    RESERVES_AND_SURPLUS = "reserves_and_surplus",
    RETAINED_EARNINGS = "retained_earnings",
    SALES_ACCOUNT = "sales_account",
    SECURED_LOANS = "secured_loans",
    STOCK_IN_HAND = "stock_in_hand",
    SUNDRY_CREDITORS = "sundry_creditors",
    SUNDRY_DEBTORS = "sundry_debtors",
    SUSPENSE_ACCOUNT = "suspense_account",
    UNSECURED_LOANS = "unsecured_loans"
}

@Entity('groups')
export class GroupsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 20 })
    name: string;

    @Column({ name: 'company_code', type: 'varchar', length: 20, nullable: false })
    companyCode: string;

    @Column({ name: 'unit_code', type: 'varchar', length: 20, nullable: false })
    unitCode: string;

    // @Column({ name: 'tds_deductable', type: 'boolean', nullable: false })
    // tdsDeductable: boolean;

    @Column({ type: 'enum', enum: UnderType, name: 'under_type', default: UnderType.PRIMARY, nullable: false })
    underType: UnderType;

    @Column({
        type: 'enum',
        enum: [...Object.values(UnderPrimary), ...Object.values(UnderSecondary)],
        name: 'under',
        nullable: true
    })
    under: string;

    @OneToMany(() => LedgerEntity, (LedgerEntity) => LedgerEntity.groupId)
    ledger: LedgerEntity[];
}
