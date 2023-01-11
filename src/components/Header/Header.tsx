import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { IoLogOutOutline } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { CgArrowsExchange } from "react-icons/cg";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { auth } from "../../firebase/firebase";
import { accountsState } from "../../atom/accountsAtom";
import useMediaQuery from "../../hooks/useMediaQuery";
import IncomeModal from "../Modals/IncomeModal";
import ExpenseModal from "../Modals/ExpenseModal";
import TransferModal from "../Modals/TransferModal";
import defaultAvatar from "../../assets/default-avatar.jpg";

const HeaderEl = styled.header`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

const BtnGroup = styled.div`
  display: flex;
`;

const Button = styled(motion.button)<{ color: string; bgColor: string }>`
  width: 135px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-family: "Inter", sans-serif;
  font-size: 15px;
  line-height: 20px;
  font-weight: 400;
  border-radius: 12px;
  border: none;
  color: ${(props) => props.color};
  background-color: ${(props) => props.bgColor};
  cursor: pointer;
  :not(:last-child) {
    margin-right: 24px;
  }
  @media (max-width: 768px) {
    width: 80px;
  }
`;

const BtnText = styled.span`
  margin-left: 5px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuButton = styled.button`
  position: absolute;
  top: 20px;
  left: 5px;
  display: none;
  color: #e1e1e1;
  border: none;
  background-color: transparent;
  @media (max-width: 768px) {
    display: inline-block;
    padding-top: 15px;
  }
`;

const UserData = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  color: white;
  padding: 15px;
  padding-left: 30px;
`;

const UserName = styled.div`
  margin-bottom: 5px;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: white;
  opacity: 0.8;
  @media (max-width: 768px) {
    font-size: 14px;
    padding-bottom: 10px;
  }
`;

const UserAvatar = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 50%;
  background-color: white;
`;

const BtnWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 30px;
  @media (max-width: 768px) {
    right: -25px;
    top: 5px;
  }
`;

const LogoutButton = styled.button`
  border: none;
  background: transparent;
  color: white;
  opacity: 0.8;
  cursor: pointer;
  :hover {
    opacity: 1;
  }
`;

interface HeaderProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { myAccounts } = useRecoilValue(accountsState);

  const [user] = useAuthState(auth);

  const [isIncomeModalOpen, setIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);

  const hanldeLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message as string);
    }
  };

  return (
    <HeaderEl>
      {!isSidebarOpen && (
        <MenuButton onClick={() => setSidebarOpen(true)}>
          <HiOutlineMenuAlt2 size="25px" />
          <span className="visually-hidden">open/close sidebar</span>
        </MenuButton>
      )}
      {isMobile ? (
        <UserEmail>{user?.email}</UserEmail>
      ) : (
        <UserData>
          <UserAvatar src={(user?.photoURL as string) || defaultAvatar} />
          <div>
            <UserName>{user?.displayName || user?.email?.split("@")[0]}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </div>
        </UserData>
      )}
      <BtnGroup>
        <Button
          onClick={() => setIncomeModalOpen(true)}
          color="#8affb9"
          bgColor="rgba(138, 255, 185, 0.16)"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AiOutlinePlus size={isMobile ? "20px" : "15px"} />
          <BtnText>Income</BtnText>
        </Button>
        <Button
          onClick={() => setExpenseModalOpen(true)}
          color="#FF8D70"
          bgColor="rgba(255, 141, 112, 0.16)"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AiOutlineMinus size={isMobile ? "20px" : "15px"} />
          <BtnText>Expense</BtnText>
        </Button>
        <Button
          onClick={() => setTransferModalOpen(true)}
          color="#fff"
          bgColor="rgba(255, 255, 255, 0.16)"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <CgArrowsExchange size={isMobile ? "25px" : "20px"} />
          <BtnText>Transfer</BtnText>
        </Button>
      </BtnGroup>
      {user && (
        <BtnWrapper>
          <LogoutButton onClick={hanldeLogout}>
            <IoLogOutOutline size="25px" />
            <span className="visually-hidden">logout</span>
          </LogoutButton>
        </BtnWrapper>
      )}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isIncomeModalOpen && myAccounts && (
          <IncomeModal accounts={myAccounts} setOpen={setIncomeModalOpen} />
        )}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isExpenseModalOpen && myAccounts && (
          <ExpenseModal accounts={myAccounts} setOpen={setExpenseModalOpen} />
        )}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isTransferModalOpen && myAccounts && (
          <TransferModal accounts={myAccounts} setOpen={setTransferModalOpen} />
        )}
      </AnimatePresence>
    </HeaderEl>
  );
};

export default Header;
