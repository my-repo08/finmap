import { atom } from "recoil";

export interface Transfer {
  fromAccount: string;
  fromAccountAmount: number;
  toAccount: string;
  toAccountAmount: number;
}

export interface Transaction {
  id: string;
  type: string;
  accountValue?: string;
  accountLabel?: string;
  createdAt: string;
  amount: number;
  accountAmount?: number;
  category?: string;
  comment?: string;
  transfer?: Transfer;
}

interface TransactionsState {
  myTransactions: Transaction[];
  isFetching: boolean;
}

const defaultTransactionsState: TransactionsState = {
  myTransactions: [],
  isFetching: true,
};

export const transactionsState = atom<TransactionsState>({
  key: "transactionsState",
  default: defaultTransactionsState,
});
