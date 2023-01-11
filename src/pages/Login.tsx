import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import styled from "styled-components";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { BiShow, BiHide } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase/firebase";
import { FIREBASE_LOGIN_ERRORS } from "../firebase/errors";
import Input from "../components/UI/Inputs/Input";
import Button from "../components/UI/Button";
import ResetPasswordModal from "../components/Modals/ResetPasswordModal";
import AuthLayout from "../layouts/AuthLayout";

const Wrapper = styled.div`
  width: 480px;
  margin-bottom: -20px;
  background-color: white;
  padding: 50px 30px;
  border-radius: 12px;
  @media (max-width: 1200px) {
    width: 450px;
    margin-bottom: 20px;
  }
  @media (max-width: 550px) {
    width: 300px;
    margin-bottom: 90px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 5px;
  @media (max-width: 550px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  @media (max-width: 550px) {
    margin-bottom: 5px;
  }
`;

const CustomLink = styled(Link)`
  font-size: 13px;
  color: var(--color-green);
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const ShowPswd = styled.span`
  position: absolute;
  top: 20%;
  right: 3%;
  font-size: 30px;
  color: #989a9c;
  opacity: 0.7;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const ErrorMsg = styled.span`
  margin-left: 5px;
  color: red;
  font-size: 14px;
`;

const ResetButton = styled.button`
  margin: 0;
  padding: 0;
  margin-bottom: 25px;
  font-family: inherit;
  font-size: 13px;
  color: var(--color-green);
  border: none;
  background: transparent;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(Button)`
  height: 60px;
  margin-bottom: 15px;
  color: black;
  background: var(--color-green-gradient);
`;

const GoogleButton = styled(Button)`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: black;
  background-color: #efefef;
`;

const Login: React.FC = () => {
  const [, userLoading] = useAuthState(auth);

  const [signInWithEmailAndPassword, , loading, credentialsError] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const [error, setError] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [evt.target.name]: evt.target.value,
    }));
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    if (error) setError("");

    const toastId = toast.loading("Loading...");

    try {
      await signInWithEmailAndPassword(loginForm.email, loginForm.password);
    } catch (error: any) {
      setError(error.message);
    }
    toast.dismiss(toastId);
  };

  const isDisabled = !loginForm.email || !loginForm.password || loading;

  if (userLoading) {
    return <></>;
  }

  return (
    <AuthLayout>
      <Wrapper>
        <TitleWrapper>
          <Title>Login</Title>
          <CustomLink to="/register">No account yet? Register</CustomLink>
        </TitleWrapper>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Your email"
            type="email"
            name="email"
            onChange={onInputChange}
          />
          <InputWrapper>
            <Input
              name="password"
              placeholder="Password"
              type={isPasswordVisible ? "text" : "password"}
              onChange={onInputChange}
            />
            <ShowPswd onClick={() => setPasswordVisible((prev) => !prev)}>
              {isPasswordVisible ? <BiHide /> : <BiShow />}
            </ShowPswd>
          </InputWrapper>
          <ResetButton type="button" onClick={() => setModalOpen(true)}>
            Forgot your password?
          </ResetButton>
          <ErrorMsg>
            {error ||
              FIREBASE_LOGIN_ERRORS[
                credentialsError?.message as keyof typeof FIREBASE_LOGIN_ERRORS
              ]}
          </ErrorMsg>
          <SubmitButton type="submit" disabled={isDisabled}>
            Enter
          </SubmitButton>
          <GoogleButton type="button" onClick={() => signInWithGoogle()}>
            <FcGoogle size="20px" />
            Continue with Google
          </GoogleButton>
        </form>
        <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
          {isModalOpen && <ResetPasswordModal setOpen={setModalOpen} />}
        </AnimatePresence>
      </Wrapper>
    </AuthLayout>
  );
};

export default Login;
