import { useMemo } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { transactionsState } from "../../../atom/transactionsAtom";
import CustomChart from "./CustomChart";

const Wrapper = styled.div`
  height: 560px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 0 30px;
  overflow: auto;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 25px;
    padding-left: 10px;
  }
`;

const Chart: React.FC = () => {
  const transactionsStateValue = useRecoilValue(transactionsState);

  const incomeTransactions = useMemo(() => {
    return transactionsStateValue.myTransactions.filter(
      (transaction: any) =>
        transaction.type === "income" && transaction.type !== "transfer"
    );
  }, [transactionsStateValue.myTransactions]);

  const expenseTransactions = useMemo(() => {
    return transactionsStateValue.myTransactions.filter(
      (transaction: any) =>
        transaction.type === "expense" && transaction.type !== "transfer"
    );
  }, [transactionsStateValue.myTransactions]);

  return (
    <Wrapper>
      {!!incomeTransactions.length && (
        <CustomChart transactions={incomeTransactions} type="income" />
      )}
      {!!expenseTransactions.length && (
        <CustomChart transactions={expenseTransactions} type="expense" />
      )}
    </Wrapper>
  );
};

export default Chart;
