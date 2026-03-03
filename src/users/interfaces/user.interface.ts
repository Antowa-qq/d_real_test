export interface IUser {
  readonly id: string;
  readonly balance: number;
}

export interface IDebitParams {
  readonly userId: string;
  readonly amount: number;
}

export interface IDebitResult {
  readonly userId: string;
  readonly balance: number;
}
