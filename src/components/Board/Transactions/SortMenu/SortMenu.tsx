import styled from "styled-components";
import { AiOutlineArrowDown } from "react-icons/ai";

const FilterMenu = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  margin-top: 60px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    margin-top: 55px;
    margin-right: 15px;
    margin-left: 5px;
  } ;
`;

const MenuItem = styled.div`
  padding: 10px;
  opacity: 0.5;
  font-size: 16px;
  line-height: 18px;
  color: var(--color-full-dark);
  font-weight: 400;
  text-align: start;
  @media (max-width: 768px) {
    display: none;
  } ;
`;

const MenuItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  opacity: 0.5;
  @media (max-width: 768px) {
    gap: 0;
    margin-right: 15px;
  } ;
`;

const Button = styled.button<{ active: boolean }>`
  padding: 0;
  padding-top: 5px;
  padding-left: 3px;
  font-size: 16px;
  line-height: 18px;
  color: var(--color-full-dark);
  font-weight: 400;
  text-align: start;
  opacity: ${(props) => (props.active ? "1" : "0.5")};
  border: none;
  background: transparent;
  cursor: pointer;
`;

interface SortMenuProps {
  sortType: string;
  setSortType: (type: string) => void;
}

const SortMenu: React.FC<SortMenuProps> = ({ sortType, setSortType }) => {
  return (
    <FilterMenu>
      <MenuItemWrapper>
        Date
        <Button
          active={sortType === "byDateDown"}
          onClick={() => setSortType("byDateDown")}
        >
          <AiOutlineArrowDown size="17px" />
        </Button>
        <Button active={sortType === "byDateUp"} onClick={() => setSortType("byDateUp")}>
          <AiOutlineArrowDown style={{ transform: "rotate(180deg)" }} size="17px" />
        </Button>
      </MenuItemWrapper>
      <MenuItemWrapper>
        Amount
        <Button
          active={sortType === "byAmountDown"}
          onClick={() => setSortType("byAmountDown")}
        >
          <AiOutlineArrowDown size="17px" />
        </Button>
        <Button
          active={sortType === "byAmountUp"}
          onClick={() => setSortType("byAmountUp")}
        >
          <AiOutlineArrowDown style={{ transform: "rotate(180deg)" }} size="17px" />
        </Button>
      </MenuItemWrapper>
      <MenuItem>Account balance</MenuItem>
      <MenuItem>Category</MenuItem>
      <MenuItem>Comment</MenuItem>
    </FilterMenu>
  );
};

export default SortMenu;
