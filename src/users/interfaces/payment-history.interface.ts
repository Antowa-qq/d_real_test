import { PaymentAction } from '../enums/payment-history.enum';

export interface IPaymentHistory {
  readonly id: string;
  readonly userId: string;
  readonly action: PaymentAction;
  readonly amount: number;
  readonly ts: Date;
}

export interface IInsertPaymentHistoryParams {
  readonly userId: string;
  readonly action: PaymentAction;
  readonly amount: number;
}
