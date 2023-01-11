import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { Account } from "../../../atom/accountsAtom";
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from "../../../const";
import AccountItem from "../AccountItem/AccountItem";

const List = styled(motion.ul)`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

const ListItem = styled(motion.li)`
  margin: 0;
  padding: 0;
`;

interface AccountsListProps {
  accounts: Account[];
  selectedAccount: string;
  setSelectedAccount: (account: string) => void;
}

const AccountsList: React.FC<AccountsListProps> = ({
  accounts,
  selectedAccount,
  setSelectedAccount,
}) => {
  return (
    <List variants={CONTAINER_VARIANTS} initial="hidden" animate="visible">
      <AnimatePresence>
        {accounts.map((account) => (
          <ListItem key={account.id} variants={ITEM_VARIANTS}>
            <AccountItem
              account={account}
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
            />
          </ListItem>
        ))}
      </AnimatePresence>
    </List>
  );
};

export default AccountsList;
