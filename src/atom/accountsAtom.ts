import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Account {
  id: string;
  value: string;
  label: string;
  balance: number;
  createdAt: Timestamp | Date;
}

interface AccountsState {
  myAccounts: Account[];
  isFetching: boolean;
}

const defaultAccountsState: AccountsState = {
  myAccounts: [],
  isFetching: true,
};

export const accountsState = atom<AccountsState>({
  key: "accountsState",
  default: defaultAccountsState,
});
