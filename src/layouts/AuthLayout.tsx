import React from "react";
import styled from "styled-components";
import promoImg from "../assets/promo-image.png";
import logoImg from "../assets/logo-finmap.svg";

const MainContainer = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const Promo = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--color-blue-bg);
  @media (max-width: 1200px) {
    display: none;
  }
`;

const Blur = styled.div`
  position: absolute;
  top: 35%;
  right: 20%;
  width: 210px;
  height: 210px;
  border-radius: 50%;
  background: var(--color-green-gradient);
  filter: blur(50px);
`;

const PromoImg = styled.img`
  z-index: 2;
  margin-top: 70px;
`;

const Logo = styled.img`
  margin-top: -5px;
`;

const Title = styled.h2`
  margin-top: 20px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
`;

const AuthSection = styled.section`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 1200px) {
    width: 100%;
    background-color: var(--color-blue-bg);
  }
`;

const AuthSectionLogo = styled.img`
  display: none;
  @media (max-width: 1200px) {
    display: unset;
    margin-bottom: 30px;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <MainContainer>
      <Promo>
        <Blur />
        <Logo src={logoImg} height={55} />
        <Title>
          You actually can manage all your account <br />
          transactions easily
        </Title>
        <PromoImg src={promoImg} height={350} />
      </Promo>
      <AuthSection>
        <AuthSectionLogo src={logoImg} height={55} />
        {children}
      </AuthSection>
    </MainContainer>
  );
};

export default AuthLayout;
