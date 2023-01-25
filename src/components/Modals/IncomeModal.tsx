import React, { useState } from "react";
import { collection, doc, increment, writeBatch } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { AiOutlineCalendar } from "react-icons/ai";
import toast from "react-hot-toast";
import { NumberFormatValues } from "react-number-format";
import { auth, db } from "../../firebase/firebase";
import { INCOME_OPTIONS } from "../../const";
import { transactionsState } from "../../atom/transactionsAtom";
import { Account, accountsState } from "../../atom/accountsAtom";
import { Option } from "../../types/types";
import {
  Modal,
  CustomSelect,
  AmountInput,
  CommentInput,
  DateInput,
  CurrencyType,
  Button,
} from "../UI";

const Title = styled.h2`
  margin-top: 0;
`;

const CalendarIcon = styled(AiOutlineCalendar)`
  position: absolute;
  top: 15px;
  right: 15px;
  color: #0000007f;
`;

const AmountInputWrapper = styled.div`
  display: flex;
  height: 55px;
  margin-bottom: 15px;
`;

const SubmitButton = styled(Button)`
  height: 60px;
  color: black;
  background: linear-gradient(88.88deg, #7fdef5 0%, #7ef5ad 100%);
`;

interface ModalProps {
  accounts: Account[];
  setOpen: (arg: boolean) => void;
}

const IncomeModal: React.FC<ModalProps> = ({ accounts, setOpen }) => {
  const [user] = useAuthState(auth);

  const setTransactionsStateValue = useSetRecoilState(transactionsState);
  const setAccountState = useSetRecoilState(accountsState);

  const [isLoading, setLoading] = useState(false);

  const [selectedAccountOption, setSelectedAccountOption] = useState<Option>();
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<Option>();
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [transactionComment, setTransactionComment] = useState("");

  const handleDateChange = (date: Date) => {
    setTransactionDate(date);
  };

  const handleAmountChange = (values: NumberFormatValues) => {
    setTransactionAmount(values.value);
  };

  const handleCommentChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTransactionComment(evt.target.value);
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    const currentAccount = accounts.find(
      (account) => account.id === selectedAccountOption?.id
    );
    const numAmount = parseInt(transactionAmount);

    if (!currentAccount) return;

    setLoading(true);

    try {
      const batch = writeBatch(db);

      const transactionDocRef = doc(collection(db, `users/${user?.uid}/transactions`));

      const newTransaction = {
        type: "income",
        accountValue: selectedAccountOption?.value,
        accountLabel: selectedAccountOption?.label,
        createdAt: new Date(transactionDate).toString(),
        amount: numAmount,
        accountAmount: currentAccount.balance + numAmount,
        category: selectedCategoryOption?.label,
        comment: transactionComment,
      };
      batch.set(transactionDocRef, newTransaction);

      const accountDocRef = doc(db, `users/${user?.uid}/accounts`, currentAccount?.value);
      batch.update(accountDocRef, {
        balance: increment(numAmount),
      });

      await batch.commit();

      setTransactionsStateValue((prev) => ({
        ...prev,
        myTransactions: [
          ...prev.myTransactions,
          {
            ...newTransaction,
            id: nanoid(),
          },
        ],
      }));

      setAccountState((prev) => {
        const myAccounts = [...prev.myAccounts];
        const updatingAccountIndex = myAccounts.findIndex(
          (account) => account.id === currentAccount.id
        );
        const updatingAccount = myAccounts[updatingAccountIndex];

        myAccounts[updatingAccountIndex] = {
          ...updatingAccount,
          balance: updatingAccount.balance + numAmount,
        };
        return {
          ...prev,
          myAccounts: [...myAccounts],
        };
      });
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const isDisabled =
    isLoading ||
    !selectedAccountOption ||
    !selectedCategoryOption ||
    !(parseInt(transactionAmount) > 0);

  return (
    <Modal onClick={() => setOpen(false)}>
      <Title>New income</Title>
      <form onSubmit={handleSubmit}>
        <CustomSelect
          placeholder="On account"
          options={accounts}
          defaultValue={selectedAccountOption}
          //@ts-ignore
          onChange={setSelectedAccountOption}
        />
        <AmountInputWrapper>
          <AmountInput
            thousandSeparator=" "
            maxLength={13}
            allowNegative={false}
            placeholder="Amount"
            value={parseInt(transactionAmount)}
            onValueChange={handleAmountChange}
          />
          <CurrencyType />
        </AmountInputWrapper>
        <CustomSelect
          placeholder="Category"
          options={INCOME_OPTIONS}
          defaultValue={selectedCategoryOption}
          //@ts-ignore
          onChange={setSelectedCategoryOption}
        />
        <div style={{ position: "relative" }}>
          <DateInput
            selected={transactionDate}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="dd.MM.yyyy HH:mm"
          />
          <CalendarIcon />
        </div>
        <CommentInput
          placeholder="Leave a comment"
          value={transactionComment}
          onChange={handleCommentChange}
        />
        <SubmitButton type="submit" disabled={isDisabled}>
          Add income
        </SubmitButton>
      </form>
    </Modal>
  );
};

export default IncomeModal;
