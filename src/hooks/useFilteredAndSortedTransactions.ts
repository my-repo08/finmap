import { useMemo } from "react";
import { Transaction } from "../atom/transactionsAtom";
import {
  sortTransactionUp,
  sortTransactionDown,
  filterByDate,
  filterByWeek,
  filterByMonth,
} from "../utils/utils";

const sortedTransactions = (transactions: Transaction[], sortType: string) => {
  if (sortType) {
    switch (sortType) {
      case "byDateDown":
        return [...transactions].sort(sortTransactionDown);
      case "byDateUp":
        return [...transactions].sort(sortTransactionUp);
      case "byAmountDown":
        return [...transactions].sort((a, b) => b.amount - a.amount);
      case "byAmountUp":
        return [...transactions].sort((a, b) => a.amount - b.amount);
      default:
        return transactions;
    }
  }
  return transactions;
};

const filteredTransactions = (
  transactions: Transaction[],
  filterType: string,
  dateA: Date | null,
  dateB: Date | null
): Transaction[] => {
  if (filterType === "selectDates" && dateA && dateB) {
    return [...transactions].filter((tr) => {
      return filterByDate(tr, dateA, dateB);
    });
  }

  switch (filterType) {
    case "currentWeek":
      return [...transactions].filter((tr) => filterByWeek(tr));
    case "previousWeek":
      return [...transactions].filter((tr) => filterByWeek(tr, 1));
    case "currentMonth":
      return [...transactions].filter((tr) => filterByMonth(tr));
    case "previousMonth":
      return [...transactions].filter((tr) => filterByMonth(tr, 1));
    default:
      return transactions;
  }
};

const selectedTransactions = (transactions: Transaction[], selectedAccount: string) => {
  if (selectedAccount === "all") {
    return transactions;
  }
  return transactions?.filter(
    (transaction) => transaction.accountValue === selectedAccount
  );
};

const useFilteredAndSortedTransactions = (
  transactions: Transaction[],
  selectedAccount: string,
  sortType: string,
  filterType: string,
  dateA: Date | null,
  dateB: Date | null
) => {
  const filteredTransactionsValue = useMemo(() => {
    return filteredTransactions(transactions, filterType, dateA, dateB);
  }, [transactions, filterType, dateA, dateB]);

  const sortedTransactionsValue = useMemo(() => {
    return sortedTransactions(filteredTransactionsValue, sortType);
  }, [filteredTransactionsValue, sortType]);

  const filteredAndSortedTransactions = useMemo(() => {
    return selectedTransactions(sortedTransactionsValue, selectedAccount);
  }, [sortedTransactionsValue, selectedAccount]);

  return filteredAndSortedTransactions;
};

export default useFilteredAndSortedTransactions;
