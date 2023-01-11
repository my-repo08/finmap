import styled from "styled-components";

const Container = styled.main`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-dark-md);
`;

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return <Container>{children}</Container>;
};

export default Layout;
