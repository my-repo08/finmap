import { useMemo, useState } from "react";
import { collection, doc, increment, writeBatch } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { AiOutlineCalendar } from "react-icons/ai";
import toast from "react-hot-toast";
import { NumberFormatValues } from "react-number-format";
import { auth, db } from "../../firebase/firebase";
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
  color: white;
  background: linear-gradient(88.88deg, #000000 0%, #3d3d3d 100%);
`;

interface ModalProps {
  accounts: Account[];
  setOpen: (arg: boolean) => void;
}

const TransferModal: React.FC<ModalProps> = ({ accounts, setOpen }) => {
  const [user] = useAuthState(auth);

  const setTransactionsStateValue = useSetRecoilState(transactionsState);
  const setAccountState = useSetRecoilState(accountsState);

  const [isLoading, setLoading] = useState(false);

  const [transferDate, setTransferDate] = useState(new Date());
  const [selectedFromAccountOption, setSelectedFromAccountOption] = useState<Option>();
  const [selectedToAccountOption, setSelectedToAccountOption] = useState<Option>();
  const [transferAmount, setTransferAmount] = useState("");
  const [transferComment, setTransferComment] = useState("");

  const handleDateChange = (date: Date) => {
    setTransferDate(date);
  };

  const handleAmountChange = (values: NumberFormatValues) => {
    setTransferAmount(values.value);
  };

  const handleCommentChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTransferComment(evt.target.value);
  };

  const fromAccountOptions = useMemo(() => {
    return accounts.map((account) => ({
      ...account,
      isDisabled: account.value === selectedToAccountOption?.value,
    }));
  }, [accounts, selectedToAccountOption]);

  const toAccountOptions = useMemo(() => {
    return accounts.map((account) => ({
      ...account,
      isDisabled: account.value === selectedFromAccountOption?.value,
    }));
  }, [accounts, selectedFromAccountOption]);

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    const fromAccount = accounts.find(
      (account) => account.id === selectedFromAccountOption?.id
    );
    const toAccount = accounts.find(
      (account) => account.id === selectedToAccountOption?.id
    );
    const numAmount = parseInt(transferAmount);

    if (!fromAccount || !toAccount) return;

    setLoading(true);

    try {
      const batch = writeBatch(db);

      const transactionDocRef = doc(collection(db, `users/${user?.uid}/transactions`));

      const newTransaction = {
        type: "transfer",
        createdAt: new Date(transferDate).toString(),
        amount: numAmount,
        comment: transferComment,
        transfer: {
          fromAccount: fromAccount.label,
          fromAccountAmount: fromAccount.balance - numAmount,
          toAccount: toAccount.label,
          toAccountAmount: toAccount.balance + numAmount,
        },
      };

      batch.set(transactionDocRef, newTransaction);

      const fromAccountDocRef = doc(db, `users/${user?.uid}/accounts`, fromAccount.id);
      batch.update(fromAccountDocRef, {
        balance: increment(-numAmount),
      });

      const toAccountDocRef = doc(db, `users/${user?.uid}/accounts`, toAccount.id);
      batch.update(toAccountDocRef, {
        balance: increment(numAmount),
      });

      await batch.commit();

      setTransactionsStateValue((prev) => ({
        ...prev,
        myTransactions: [
          ...prev.myTransactions,
          {
            ...newTransaction,
            id: crypto.randomUUID(),
          },
        ],
      }));

      setAccountState((prev) => {
        const myAccounts = [...prev.myAccounts];
        const fromUpdatingAccountIndex = myAccounts.findIndex(
          (account) => account.id === fromAccount.id
        );
        const fromUpdatingAccount = myAccounts[fromUpdatingAccountIndex];
        const toUpdatingAccountIndex = myAccounts.findIndex(
          (account) => account.id === toAccount.id
        );
        const toUpdaingAccount = myAccounts[toUpdatingAccountIndex];

        myAccounts[fromUpdatingAccountIndex] = {
          ...fromUpdatingAccount,
          balance: fromUpdatingAccount.balance - numAmount,
        };

        myAccounts[toUpdatingAccountIndex] = {
          ...toUpdaingAccount,
          balance: toUpdaingAccount.balance + numAmount,
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
    !selectedFromAccountOption ||
    !selectedToAccountOption ||
    !(parseInt(transferAmount) > 0);

  return (
    <Modal onClick={() => setOpen(false)}>
      <Title>New transfer</Title>
      <form onSubmit={handleSubmit}>
        <div style={{ position: "relative" }}>
          <DateInput
            selected={transferDate}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="dd.MM.yyyy HH:mm"
          />
          <CalendarIcon />
        </div>
        <CustomSelect
          isClearable
          placeholder="From account"
          options={fromAccountOptions}
          defaultValue={selectedFromAccountOption}
          //@ts-ignore
          onChange={setSelectedFromAccountOption}
        />
        <CustomSelect
          isClearable
          placeholder="To account"
          options={toAccountOptions}
          defaultValue={selectedToAccountOption}
          //@ts-ignore
          onChange={setSelectedToAccountOption}
        />
        <AmountInputWrapper>
          <AmountInput
            thousandSeparator=" "
            maxLength={13}
            allowNegative={false}
            placeholder="Amount"
            value={parseInt(transferAmount)}
            onValueChange={handleAmountChange}
          />
          <CurrencyType />
        </AmountInputWrapper>
        <CommentInput
          placeholder="Leave a comment"
          value={transferComment}
          onChange={handleCommentChange}
        />
        <SubmitButton type="submit" disabled={isDisabled}>
          Add transfer
        </SubmitButton>
      </form>
    </Modal>
  );
};

export default TransferModal;
