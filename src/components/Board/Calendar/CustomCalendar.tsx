import { useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRecoilValue } from "recoil";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { convertCurrency } from "../../../utils/utils";
import { transactionsState } from "../../../atom/transactionsAtom";

const localizer = momentLocalizer(moment);

const getStyles = (isMobile: boolean) => {
  if (isMobile) {
    return {
      width: "100%",
      height: 550,
      marginTop: "20px",
      padding: "0px 15px",
    };
  } else {
    return {
      height: 500,
      marginTop: "30px",
    };
  }
};

const CustomCalendar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const transactionsStateValue = useRecoilValue(transactionsState);

  const transactionEvents = transactionsStateValue.myTransactions.map((transaction) => {
    return {
      start: new Date(transaction.createdAt),
      end: new Date(transaction.createdAt),
      title: `${
        transaction.type === "transfer" ? "" : transaction.type === "income" ? "+ " : "- "
      } ${String(convertCurrency.format(transaction.amount))} ${
        transaction.type === "transfer" ? "Transfer" : transaction.category
      }`,
    };
  });

  const styles = useMemo(() => {
    return getStyles(isMobile);
  }, [isMobile]);

  return (
    <Calendar
      localizer={localizer}
      events={transactionEvents}
      startAccessor="start"
      endAccessor="end"
      style={styles}
    />
  );
};

export default CustomCalendar;
