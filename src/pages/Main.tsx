import { useEffect, useState } from "react";
import styled from "styled-components";
import useMediaQuery from "../hooks/useMediaQuery";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar/Sidebar";
import BoardWrapper from "../components/Board/BoardWrapper/BoardWrapper";
import MainLayout from "../layouts/MainLayout";

const Wrapper = styled.section`
  display: flex;
  height: 100%;
  margin: 0 25px;
  background-color: var(--color-light);
  border: 1px solid rgb(150, 150, 150);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  @media (max-width: 768px) {
    margin: 0 15px;
  }
`;

const Main: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("all");

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <MainLayout>
      <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Wrapper>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
        />
        <BoardWrapper
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedAccount={selectedAccount}
        />
      </Wrapper>
    </MainLayout>
  );
};

export default Main;
