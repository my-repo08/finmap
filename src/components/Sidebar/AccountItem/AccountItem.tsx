import styled from "styled-components";
import { motion } from "framer-motion";
import { convertCurrency } from "../../../utils/utils";
import { Account } from "../../../atom/accountsAtom";

const Item = styled(motion.button)<{ active: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 5px;
  padding-left: ${(props) => (props.active ? "5px" : "0")};
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  line-height: 16px;
  color: rgba(19, 19, 19, 0.5);
  background-color: transparent;
  border: none;
  border-left: ${(props) => (props.active ? "5px solid #00B28E" : "")};
  cursor: pointer;
  @media (max-width: 768px) {
    margin-bottom: 15px;
    font-size: 14px;
  }
`;

interface AccountItemProps {
  account: Account;
  selectedAccount: string;
  setSelectedAccount: (account: string) => void;
}

const AccountItem: React.FC<AccountItemProps> = ({
  account,
  selectedAccount,
  setSelectedAccount,
}) => {
  return (
    <Item
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -150 }}
      transition={{ duration: 0.2 }}
      active={selectedAccount === account.value}
      onClick={() => setSelectedAccount(account.value)}
    >
      <div>{account.label}</div>
      <div>{convertCurrency.format(account.balance)}</div>
    </Item>
  );
};

export default AccountItem;
