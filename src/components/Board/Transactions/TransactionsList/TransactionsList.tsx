import styled from "styled-components";
import { motion } from "framer-motion";
import { CONTAINER_VARIANTS } from "../../../../const";
import { Transaction } from "../../../../atom/transactionsAtom";
import TransactionItem from "../TransactionItem/TransactionItem";

const List = styled(motion.ul)`
  margin: 0;
  margin-bottom: 170px;
  padding: 0;
  overflow: auto;
  list-style-type: none;
  @media (max-width: 768px) {
    margin-bottom: 280px;
  }
`;

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  return (
    <List variants={CONTAINER_VARIANTS} initial="hidden" animate="visible">
      {transactions.map((transaction) => (
        <TransactionItem transaction={transaction} />
      ))}
    </List>
  );
};

export default TransactionsList;
