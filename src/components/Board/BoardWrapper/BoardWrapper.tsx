import { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { auth, db } from "../../../firebase/firebase";
import { Transaction, transactionsState } from "../../../atom/transactionsAtom";
import CustomCalendar from "../Calendar/CustomCalendar";
import Journal from "../Transactions/Journal/Journal";
import TabMenu from "../TabMenu/TabMenu";
import Chart from "../Chart/Chart";

const Container = styled.section`
  width: 75%;
  height: 100%;
  margin: 30px;
  border-top-right-radius: 20px;
  @media (max-width: 768px) {
    width: 100%;
    margin: 10px;
  }
`;

interface BoardProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  selectedAccount: string;
}

const Board: React.FC<BoardProps> = ({
  isSidebarOpen,
  setSidebarOpen,
  selectedAccount,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [user] = useAuthState(auth);

  const [transactionsStateValue, setTransactionsStateValue] =
    useRecoilState(transactionsState);

  const [activeTab, setActiveTab] = useState("Journal");
  const [error, setError] = useState("");

  const handleSidebarClose = () => {
    if (isSidebarOpen && isMobile) {
      setSidebarOpen(false);
    }
  };

  const getTransactions = async () => {
    if (error) setError("");

    try {
      const transactionsQuery = query(
        collection(db, `users/${user?.uid}/transactions`),
        orderBy("createdAt", "desc")
      );

      const transactionsDocs = await getDocs(transactionsQuery);

      const transactionsData = transactionsDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactionsStateValue((prev) => ({
        ...prev,
        isFetching: false,
        myTransactions: transactionsData as Transaction[],
      }));
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (transactionsStateValue.isFetching || user) {
      getTransactions();
    }
  }, [transactionsStateValue.isFetching, user]);

  return (
    <Container onClick={handleSidebarClose}>
      <TabMenu
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDisabled={!transactionsStateValue.myTransactions.length}
      />
      {transactionsStateValue.myTransactions && (
        <>
          {activeTab === "Journal" && (
            <Journal selectedAccount={selectedAccount} error={error} />
          )}
          {activeTab === "Analytics" && <Chart />}
          {activeTab === "Calendar" && <CustomCalendar />}
        </>
      )}
    </Container>
  );
};

export default Board;
