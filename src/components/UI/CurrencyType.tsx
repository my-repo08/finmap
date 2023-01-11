import styled from "styled-components";

const Currency = styled.div`
  flex-grow: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  background-color: var(--color-blue-input);
  border-radius: 12px;
  @media (max-width: 768px) {
    padding: 0 5px;
  }
`;

const CurrencyType = () => {
  return <Currency>USD ($)</Currency>;
};

export default CurrencyType;
