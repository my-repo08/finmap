import { useState } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { BeatLoader } from "react-spinners";
import notFound from "../../../../assets/not-found.jpg";
import useFilteredAndSortedTransactions from "../../../../hooks/useFilteredAndSortedTransactions";
import { transactionsState } from "../../../../atom/transactionsAtom";
import SortMenu from "../SortMenu/SortMenu";
import TransactionsList from "../TransactionsList/TransactionsList";
import DateRangePicker from "../../../UI/Inputs/DateRangePicker";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SpinnerWrapper = styled.div`
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NotFound = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${notFound});
  background-repeat: no-repeat;
  background-size: 800px;
  background-position: center top;
  @media (max-width: 1150px) {
    background-position: center 30%;
    background-size: 600px;
  }
  @media (max-width: 900px) {
    background-size: 500px;
  }
  @media (max-width: 768px) {
    background-size: 350px;
  }
`;

const ErrorWrapper = styled.div`
  padding: 20px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.5);
`;

const Blank = styled.div`
  align-self: center;
  margin-top: 150px;
  font-size: 26px;
  font-weight: 700;
  color: rgba(19, 19, 19, 0.5);
  opacity: 0.7;
  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

interface JournalProps {
  selectedAccount: string;
  error: string;
}

const Journal: React.FC<JournalProps> = ({ selectedAccount, error }) => {
  const [sortType, setSortType] = useState("byDateDown");

  const [selectedRangeOption, setSelectedRangeOption] = useState({
    value: "allTime",
    label: "All time",
  });

  const transactionsStateValue = useRecoilValue(transactionsState);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filteredAndSortedTransactions = useFilteredAndSortedTransactions(
    transactionsStateValue.myTransactions,
    selectedAccount,
    sortType,
    selectedRangeOption.value,
    startDate,
    endDate
  );

  let content;

  if (transactionsStateValue.isFetching) {
    content = (
      <SpinnerWrapper>
        <BeatLoader color="gray" />
      </SpinnerWrapper>
    );
  } else if (error) {
    content = <ErrorWrapper>{error}</ErrorWrapper>;
  } else if (!transactionsStateValue.myTransactions.length) {
    content = <NotFound />;
  } else if (transactionsStateValue.myTransactions.length) {
    content = (
      <>
        <DateRangePicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedRangeOption={selectedRangeOption}
          setSelectedRangeOption={setSelectedRangeOption}
        />
        <SortMenu sortType={sortType} setSortType={setSortType} />
        {filteredAndSortedTransactions.length ? (
          <TransactionsList transactions={filteredAndSortedTransactions} />
        ) : (
          <Blank>No trasnsactions found</Blank>
        )}
      </>
    );
  }

  return <Wrapper>{content}</Wrapper>;
};

export default Journal;
