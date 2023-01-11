import React, { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import toast from "react-hot-toast";
import { Option } from "../../types/types";
import { auth, db } from "../../firebase/firebase";
import { accountsState } from "../../atom/accountsAtom";
import { Modal, CustomSelect, Button } from "../UI";

const Title = styled.h2`
  margin-top: 0;
`;

const SubmitButton = styled(Button)`
  height: 60px;
  color: black;
  background: var(--color-orange-gradient);
`;

interface ModalProps {
  setOpen: (arg: boolean) => void;
}

const DeleteAccountModal: React.FC<ModalProps> = ({ setOpen }) => {
  const [user] = useAuthState(auth);

  const [accountsStateValue, setAccountsStateValue] = useRecoilState(accountsState);

  const [isLoading, setLoading] = useState(false);

  const [selectedAccountOption, setSelectedAccountOption] = useState<Option>();

  const handleDeleteAccount = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setLoading(true);
    if (!selectedAccountOption?.id) return;

    try {
      const accountDocRef = doc(
        db,
        `users/${user?.uid}/accounts`,
        selectedAccountOption?.id
      );
      await deleteDoc(accountDocRef);

      setAccountsStateValue((prev) => ({
        ...prev,
        myAccounts: [
          ...prev.myAccounts.filter(
            (account) => account.id !== selectedAccountOption?.id
          ),
        ],
      }));
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const isDisabled = isLoading || !selectedAccountOption;

  return (
    <Modal onClick={() => setOpen(false)}>
      <Title>Delete account</Title>
      <form onSubmit={handleDeleteAccount}>
        <CustomSelect
          placeholder="Select an account"
          options={accountsStateValue.myAccounts}
          defaultValue={selectedAccountOption}
          //@ts-ignore
          onChange={setSelectedAccountOption}
        />
        <SubmitButton type="submit" disabled={isDisabled}>
          Delete account
        </SubmitButton>
      </form>
    </Modal>
  );
};

export default DeleteAccountModal;
