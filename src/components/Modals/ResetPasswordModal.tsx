import React, { useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { AiOutlineMail } from "react-icons/ai";
import { auth } from "../../firebase/firebase";
import { Button, Input, Modal } from "../UI";

const Title = styled.h3`
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const Text = styled.p`
  margin-bottom: 30px;
  font-size: 16px;
  text-align: center;
`;

const AuthInput = styled(Input)`
  height: 60px;
  margin-bottom: 15px;
  font-size: 16px;
  background-color: #eff3f5;
  ::placeholder {
    color: #989a9c;
    opacity: 0.7;
  }
`;

const SubmitButton = styled(Button)`
  height: 60px;
  margin-top: 5px;
  color: black;
  background: var(--color-green-gradient);
`;

const ErrorMsg = styled.div`
  position: absolute;
  margin-top: -15px;
  color: red;
  font-size: 14px;
`;

const SuccessMsg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin: 22px 0;
  font-size: 16px;
  text-align: center;
`;

interface ResetPasswordModalProps {
  setOpen: (arg: boolean) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ setOpen }) => {
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(evt.target.value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendPasswordResetEmail(email);
    setSuccess(true);
  };

  const isDisabled = !email || sending;

  return (
    <Modal onClick={() => setOpen(false)}>
      <Title>Recover password</Title>
      <Text>
        Enter the email associated with your account to receive a link for password
        recovery
      </Text>
      <form onSubmit={onSubmit}>
        <AuthInput type="email" placeholder="Your email" onChange={handleEmailChange} />
        <ErrorMsg>{error?.message}</ErrorMsg>
        {success ? (
          <SuccessMsg>
            Check your email
            <AiOutlineMail size={18} />
          </SuccessMsg>
        ) : (
          <SubmitButton type="submit" disabled={isDisabled}>
            Recover
          </SubmitButton>
        )}
      </form>
    </Modal>
  );
};

export default ResetPasswordModal;
