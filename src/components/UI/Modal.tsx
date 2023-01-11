import styled from "styled-components";
import { motion } from "framer-motion";
import { MODAL_VARIANTS } from "../../const";

const ModalBackdrop = styled(motion.div)`
  z-index: 7;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
`;

const ModalContent = styled(motion.div)`
  width: 400px;
  font-size: 20px;
  padding: 30px;
  border-radius: 24px;
  background-color: white;
  @media (max-width: 768px) {
    width: 300px;
    margin-bottom: 80px;
    padding: 25px;
  }
`;

type ModalProps = {
  children: React.ReactNode;
  onClick: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClick }) => {
  return (
    <ModalBackdrop
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <ModalContent
        onClick={(evt) => evt.stopPropagation()}
        variants={MODAL_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </ModalContent>
    </ModalBackdrop>
  );
};

export default Modal;
