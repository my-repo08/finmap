import dayjs from "dayjs";
import _ from "lodash";
import { CgArrowsExchange } from "react-icons/cg";
import { GiMoneyStack, GiReceiveMoney, GiPayMoney, GiBanknote } from "react-icons/gi";
import { BsPiggyBank, BsHouseDoor } from "react-icons/bs";
import { AiOutlineGift, AiOutlineShopping } from "react-icons/ai";
import { IoFastFoodOutline, IoGameControllerOutline } from "react-icons/io5";
import { TbMeat } from "react-icons/tb";
import {
  MdEmojiTransportation,
  MdOutlineMiscellaneousServices,
  MdOutlineLocalHospital,
} from "react-icons/md";
import { Transaction } from "../atom/transactionsAtom";

var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

var weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);

export const convertCurrency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "USD",
});

export const sortTransactionUp = (
  transactionA: Transaction,
  transactionB: Transaction
) => {
  return dayjs(transactionA.createdAt).diff(dayjs(transactionB.createdAt));
};

export const sortTransactionDown = (
  transactionA: Transaction,
  transactionB: Transaction
) => {
  return dayjs(transactionB.createdAt).diff(dayjs(transactionA.createdAt));
};

export const filterByDate = (transaction: Transaction, dateA: Date, dateB: Date) => {
  //@ts-ignore
  return dayjs(transaction.createdAt).isBetween(dateA, dateB, "day", "[]");
};

export const filterByWeek = (transaction: Transaction, offset = 0) => {
  //@ts-ignore
  return dayjs(dayjs(transaction.createdAt).week()).isSame(dayjs().week() - offset);
};

export const filterByMonth = (transaction: Transaction, offset = 0) => {
  return dayjs(dayjs(transaction.createdAt).month()).isSame(dayjs().month() - offset);
};

export const setExpenseColor = (category: string) => {
  switch (category) {
    case "Groceries":
      return "#2a9d8f";
    case "Eating":
      return "#4a88f7";
    case "Transport":
      return "#8f8f8f";
    case "Shopping":
      return "#f4a261";
    case "House":
      return "#e76f51";
    case "Entertainment":
      return "#f3db00";
    case "Services":
      return "#cee497";
    case "Medicine":
      return "#ed1b24";
    case "Other":
      return "#4c4c4c";
    default:
      return "";
  }
};
export const setIncomeColor = (category: string) => {
  switch (category) {
    case "Salary":
      return "#2a9d8f";
    case "Debt return":
      return "#f4a261";
    case "Deposit":
      return "#e76f51";
    case "Side job":
      return "#4a88f7";
    case "Financial reward":
      return "#cee497";
    case "Gift":
      return "#f3db00";
    case "Other":
      return "#4c4c4c";
    default:
      return "";
  }
};

export const getSum = (transactions: Transaction[], type?: string, category?: string) => {
  let sum = _(transactions)
    .groupBy("category")
    .map((obj, key) => {
      if (!category) return _.sumBy(obj, "amount");
      return {
        category: key,
        color:
          type === "income"
            ? setIncomeColor(obj[0].category!)
            : setExpenseColor(obj[0].category!!),
        total: _.sumBy(obj, "amount"),
      };
    })
    .value();
  return sum;
};

export const getLabels = (transactions: Transaction[], type: string) => {
  let amountSum = getSum(transactions, type, "category");

  let totalAmount = _.sum(getSum(transactions));

  let percent = _(amountSum)
    .map((obj: any) => _.assign(obj, { percent: (100 * obj.total) / totalAmount }))
    .value();

  return percent;
};

export const chartData = (
  transactions: Transaction[],
  type: string,
  isMobile: boolean
) => {
  let bgColors = _.map(transactions, (t) =>
    type === "income" ? setIncomeColor(t.category!) : setExpenseColor(t.category!)
  );
  bgColors = _.uniq(bgColors);

  let labelsData = _.map(transactions, (t) => t.category);
  labelsData = _.uniq(labelsData);

  let dataValues = getSum(transactions);

  const config = {
    data: {
      labels: labelsData,
      datasets: [
        {
          data: dataValues,
          backgroundColor: bgColors,
          hoverOffset: 4,
          borderRadius: 30,
          spacing: 10,
        },
      ],
    },
    options: {
      cutout: isMobile ? 130 : 115,
    },
  };
  return config;
};

export const getTotal = (transactions: Transaction[]) => _.sum(getSum(transactions));

export const setIcon = (category?: string) => {
  switch (category) {
    case "Salary":
      return <GiMoneyStack />;
    case "Debt return":
      return <GiReceiveMoney />;
    case "Deposit":
      return <BsPiggyBank />;
    case "Side job":
      return <GiPayMoney />;
    case "Financial reward":
      return <GiBanknote />;
    case "Gift":
      return <AiOutlineGift />;
    case "Groceries":
      return <TbMeat />;
    case "Eating":
      return <IoFastFoodOutline />;
    case "Transport":
      return <MdEmojiTransportation />;
    case "Shopping":
      return <AiOutlineShopping />;
    case "House":
      return <BsHouseDoor />;
    case "Entertainment":
      return <IoGameControllerOutline />;
    case "Services":
      return <MdOutlineMiscellaneousServices />;
    case "Medicine":
      return <MdOutlineLocalHospital />;
    default:
      return <CgArrowsExchange />;
  }
};
