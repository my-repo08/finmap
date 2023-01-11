import styled from "styled-components";
import { MENU_ITEMS } from "../../../const";

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  } ;
`;

const TabItem = styled.button<{ active: boolean }>`
  margin-right: 10px;
  padding: 7px 20px;
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: bold;
  line-height: 24px;
  color: ${(props) => (props.active ? "#FFFFFF" : "#131313")};
  opacity: ${(props) => (props.active ? "1" : "0.4")};
  border: none;
  border-radius: 20px;
  background-color: ${(props) => (props.active ? "#181D1F" : "transparent")};
  cursor: pointer;
  :disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  :not(:disabled) {
    :hover {
      background-color: ${(props) => (props.active ? "" : "lightgray")};
    }
  }
  @media (max-width: 768px) {
    padding: 7px 18px;
  }
`;

interface TabMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDisabled: boolean;
}

const TabMenu: React.FC<TabMenuProps> = ({ activeTab, setActiveTab, isDisabled }) => {
  return (
    <TabWrapper>
      {MENU_ITEMS.map((item, index) => (
        <TabItem
          key={index}
          disabled={isDisabled}
          active={item === activeTab}
          onClick={() => setActiveTab(item)}
        >
          {item}
        </TabItem>
      ))}
    </TabWrapper>
  );
};

export default TabMenu;
