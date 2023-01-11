import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import styled from "styled-components";
import toast from "react-hot-toast";
import { BiShow, BiHide } from "react-icons/bi";
import { auth } from "../firebase/firebase";
import { FIREBASE_REGISTER_ERROR } from "../firebase/errors";
import { Button, Input } from "../components/UI";
import AuthLayout from "../layouts/AuthLayout";

const Wrapper = styled.div`
  width: 480px;
  background-color: white;
  padding: 50px 30px;
  border-radius: 12px;
  @media (max-width: 1200px) {
    width: 450px;
    margin-bottom: 50px;
  }
  @media (max-width: 550px) {
    width: 300px;
    margin-bottom: 115px;
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

const ErrorMsg = styled.div`
  position: absolute;
  margin-top: -5px;
  margin-left: 5px;
  color: red;
  font-size: 14px;
`;

const SubmitButton = styled(Button)`
  height: 60px;
  margin-top: 20px;
  color: black;
  background: var(--color-green-gradient);
`;

const Signup: React.FC = () => {
  const [, isUserLoading] = useAuthState(auth);

  const [createUserWithEmailAndPassword, , isLoading, credentialsError] =
    useCreateUserWithEmailAndPassword(auth);

  const [error, setError] = useState("");

  const [isPasswordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [evt.target.name]: evt.target.value,
    }));
  };

  const handleSetPasswordVisible = () => {
    setPasswordVisible((prev) => ({
      ...prev,
      password: !isPasswordVisible.password,
    }));
  };

  const handleSetConfirmPasswordVisible = () => {
    setPasswordVisible((prev) => ({
      ...prev,
      confirmPassword: !isPasswordVisible.confirmPassword,
    }));
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    if (error) setError("");

    evt.preventDefault();

    const toastId = toast.loading("Loading...");
    try {
      if (signUpForm.password !== signUpForm.confirmPassword) {
        throw new Error("Passwords do NOT match");
      }
      await createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
    } catch (error: any) {
      setError(error.message);
    }
    toast.dismiss(toastId);
  };

  const isDisabled = !signUpForm.email || signUpForm.password.length < 6 || isLoading;

  if (isUserLoading) {
    return <></>;
  }

  return (
    <AuthLayout>
      <Wrapper>
        <TitleWrapper>
          <Title>Registration</Title>
          <CustomLink to="/login">Already have an account? Log in</CustomLink>
        </TitleWrapper>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Your correct email"
            onChange={onInputChange}
          />
          <InputWrapper>
            <Input
              name="password"
              placeholder="Come up with a password"
              type={isPasswordVisible.password ? "text" : "password"}
              onChange={onInputChange}
            />
            <ShowPswd onClick={handleSetPasswordVisible}>
              {isPasswordVisible.password ? <BiHide /> : <BiShow />}
            </ShowPswd>
          </InputWrapper>
          <InputWrapper>
            <Input
              name="confirmPassword"
              placeholder="Confirm password"
              type={isPasswordVisible.confirmPassword ? "text" : "password"}
              onChange={onInputChange}
            />
            <ShowPswd onClick={handleSetConfirmPasswordVisible}>
              {isPasswordVisible.confirmPassword ? <BiHide /> : <BiShow />}
            </ShowPswd>
          </InputWrapper>
          <ErrorMsg>
            {error ||
              FIREBASE_REGISTER_ERROR[
                credentialsError?.message as keyof typeof FIREBASE_REGISTER_ERROR
              ]}
          </ErrorMsg>
          <SubmitButton type="submit" disabled={isDisabled}>
            Sign Up
          </SubmitButton>
        </form>
      </Wrapper>
    </AuthLayout>
  );
};

export default Signup;
