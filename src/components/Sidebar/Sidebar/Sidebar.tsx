import { useEffect, useState } from "react";
import { query, collection, getDocs, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { BeatLoader } from "react-spinners";
import { GrFormClose } from "react-icons/gr";
import { BsPlusLg } from "react-icons/bs";
import { RiDeleteBinFill } from "react-icons/ri";
import AddAccountModal from "../../Modals/AddAccountModal";
import DeleteAccountModal from "../../Modals/DeleteAccountModal";
import { convertCurrency } from "../../../utils/utils";
import AccountsList from "../AccountList/AccountList";
import { auth, db } from "../../../firebase/firebase";
import { Account, accountsState } from "../../../atom/accountsAtom";

const SidebarEl = styled.section`
  z-index: 6;
  height: 100%;
  width: 25%;
  padding: 20px;
  background-color: var(--color-blue-bg);
  border-top-left-radius: 20px;
  border-right: 1px solid rgb(235, 235, 235);
  @media (max-width: 768px) {
    position: absolute;
    width: 60%;
    padding: 15px;
  }
`;

const CloseButton = styled.button`
  padding-left: 0;
  display: none;
  color: var(--color-full-dark);
  border: none;
  background-color: transparent;
  @media (max-width: 768px) {
    display: inline-block;
  }
`;

const Title = styled.h2`
  font-size: 16px;
  line-height: 16px;
  font-weight: 400;
  color: #131313;
  opacity: 0.5;
  @media (max-width: 768px) {
    margin-top: 5px;
  }
`;

const TotalAmount = styled.div`
  padding-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  line-height: 40px;
  color: #131313;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    padding-bottom: 10px;
  }
`;

const MenuTitle = styled.h3`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
  cursor: pointer;
  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const ButtonsWrapper = styled.div`
  @media (max-width: 768px) {
    margin-right: -10px;
  }
`;

const Button = styled(motion.button)`
  vertical-align: middle;
  color: var(--color-green);
  border: none;
  background-color: transparent;
  cursor: pointer;
  :not(:last-child) {
    margin-right: 10px;
  }
  @media (max-width: 768px) {
    :not(:last-child) {
      margin-right: 0;
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  margin-top: 20px;
  color: rgba(19, 19, 19, 0.5);
  font-size: 16px;
  line-height: 26px;
`;

const ErrorWrapper = styled.div`
  padding-top: 5px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.5);
`;

type SidebarProps = {
  isSidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  selectedAccount: string;
  setSelectedAccount: (arg: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setSidebarOpen,
  selectedAccount,
  setSelectedAccount,
}) => {
  const [user] = useAuthState(auth);

  const [accountsStateValue, setAccountsStateValue] = useRecoilState(accountsState);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [error, setError] = useState("");

  const getAccounts = async () => {
    if (error) setError("");

    try {
      const accountsQuery = query(
        collection(db, `users/${user?.uid}/accounts`),
        orderBy("createdAt", "asc")
      );

      const accountsDocs = await getDocs(accountsQuery);
      const accountsData = accountsDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAccountsStateValue((prev) => ({
        ...prev,
        isFetching: false,
        myAccounts: accountsData as Account[],
      }));
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (accountsStateValue.isFetching || user) {
      getAccounts();
    }
  }, [accountsStateValue.isFetching, user]);

  const getTotalSum = (arr: Account[]) =>
    arr.reduce((acc: number, num: Account) => acc + num.balance, 0);

  let content;

  if (accountsStateValue.isFetching) {
    content = (
      <SpinnerWrapper>
        <BeatLoader color="gray" />
      </SpinnerWrapper>
    );
  } else if (error) {
    content = <ErrorWrapper>{error}</ErrorWrapper>;
  } else if (!accountsStateValue.myAccounts.length) {
    content = (
      <Wrapper>
        There isn`t any accounts yet <br />
        Add one of yours and try to make your first transaction
      </Wrapper>
    );
  } else if (accountsStateValue.myAccounts.length) {
    content = (
      <AccountsList
        accounts={accountsStateValue.myAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
      />
    );
  }

  return (
    <>
      <SidebarEl className={isSidebarOpen ? "show" : "hide"}>
        <CloseButton onClick={() => setSidebarOpen(false)}>
          <GrFormClose size="25px" />
          <span className="visually-hidden">close sidebar</span>
        </CloseButton>
        <Title>Total on accounts</Title>
        <TotalAmount>
          {convertCurrency.format(getTotalSum(accountsStateValue.myAccounts))}
        </TotalAmount>
        <MenuTitle onClick={() => setSelectedAccount("all")}>
          My accounts
          <ButtonsWrapper>
            <Button
              onClick={() => setAddModalOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <BsPlusLg size="15px" />
            </Button>
            <Button
              onClick={() => setDeleteModalOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RiDeleteBinFill size="20px" />
            </Button>
          </ButtonsWrapper>
        </MenuTitle>
        {content}
      </SidebarEl>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {addModalOpen && <AddAccountModal setOpen={setAddModalOpen} />}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {deleteModalOpen && <DeleteAccountModal setOpen={setDeleteModalOpen} />}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
