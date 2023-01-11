export const MENU_ITEMS = ["Journal", "Analytics", "Calendar"];

export const EXPENSE_OPTIONS = [
  { value: "groceries", label: "Groceries" },
  { value: "eating", label: "Eating" },
  { value: "transport", label: "Transport" },
  { value: "shopping", label: "Shopping" },
  { value: "house", label: "House" },
  { value: "entertainment", label: "Entertainment" },
  { value: "services", label: "Services" },
  { value: "medicine", label: "Medicine" },
  { value: "other", label: "Other" },
];

export const INCOME_OPTIONS = [
  { value: "salary", label: "Salary" },
  { value: "debtReturn", label: "Debt return" },
  { value: "deposit", label: "Deposit" },
  { value: "sideJob", label: "Side job" },
  { value: "financialReward", label: "Financial reward" },
  { value: "gift", label: "Gift" },
  { value: "other", label: "Other" },
];

export const DATE_RANGE_OPTIONS = [
  { value: "allTime", label: "All time" },
  { value: "currentWeek", label: "Current week" },
  { value: "previousWeek", label: "Previous week" },
  { value: "currentMonth", label: "Current month" },
  { value: "previousMonth", label: "Previous month" },
  { value: "selectDates", label: "Select dates" },
];

export const MODAL_VARIANTS = {
  hidden: {
    opacity: 0,
    scale: 0.75,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0,
  },
};

export const DATERANGE_VARIANTS = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0,
  },
};

export const CONTAINER_VARIANTS = {
  hidden: {
    opacity: 1,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

export const ITEM_VARIANTS = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};
