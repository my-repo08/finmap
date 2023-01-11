import React, { useState } from "react";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import toast from "react-hot-toast";
import { NumberFormatValues } from "react-number-format";
import { auth, db } from "../../firebase/firebase";
import { accountsState } from "../../atom/accountsAtom";
import { Modal, AmountInput, Button, CurrencyType } from "../UI";

const Title = styled.h2`
  margin-top: 0;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 55px;
  margin-bottom: 15px;
  padding: 0 10px;
  font-size: 14px;
  border: none;
  background-color: var(--color-blue-input);
  border-radius: 12px;
  :focus {
    outline: none;
    box-shadow: 0 0 0 1px var(--color-green);
    transition: 0.3s;
  }
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
  setOpen: (arg: boolean) => void;
}

const AccountModal: React.FC<ModalProps> = ({ setOpen }) => {
  const [user] = useAuthState(auth);

  const setAccountState = useSetRecoilState(accountsState);

  const [isLoading, setLoading] = useState(false);

  const [accountName, setAccountName] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const handleNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(evt.target.value);
  };

  const handleAmountChange = (values: NumberFormatValues) => {
    setAccountBalance(values.value);
  };

  const handleAddAccount = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const formattedAccountValue = accountName.split(" ").join("");
    const newAccount = {
      value: formattedAccountValue,
      label: accountName,
      balance: parseInt(accountBalance),
      createdAt: serverTimestamp(),
    };
    setLoading(true);

    try {
      const accountDocRef = doc(db, `users/${user?.uid}/accounts`, formattedAccountValue);
      await runTransaction(db, async (transaction) => {
        const accountDoc = await transaction.get(accountDocRef);
        if (accountDoc.exists()) {
          throw new Error(`Sorry, ${accountName} is taken. Try another.`);
        }
        transaction.set(accountDocRef, newAccount);
      });
      setAccountState((prev) => ({
        ...prev,
        myAccounts: [
          ...prev.myAccounts,
          {
            ...newAccount,
            id: formattedAccountValue,
            createdAt: new Date(),
          },
        ],
      }));
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const isDisabled = isLoading || !accountName || !(parseInt(accountBalance) > 0);

  return (
    <Modal onClick={() => setOpen(false)}>
      <Title>Add new account</Title>
      <form onSubmit={handleAddAccount}>
        <Input
          name="name"
          placeholder="Account name"
          value={accountName}
          onChange={handleNameChange}
        />
        <AmountInputWrapper>
          <AmountInput
            thousandSeparator=" "
            maxLength={13}
            allowNegative={false}
            name="balance"
            placeholder="Initial balance"
            value={parseInt(accountBalance)}
            onValueChange={handleAmountChange}
          />
          <CurrencyType />
        </AmountInputWrapper>
        <SubmitButton type="submit" disabled={isDisabled}>
          Add account
        </SubmitButton>
      </form>
    </Modal>
  );
};

export default AccountModal;
