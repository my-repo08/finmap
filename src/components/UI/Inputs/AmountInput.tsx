import styled from "styled-components";
import { NumericFormat } from "react-number-format";

const AmountInput = styled(NumericFormat)`
  flex-grow: 3;
  height: 100%;
  margin-right: 10px;
  padding: 0 10px;
  font-size: 14px;
  border: none;
  background-color: var(--color-blue-input);
  border-radius: 12px;
  :focus {
    outline: none;
    box-shadow: 0 0 0 1px var(--color-green);
    transition: 0.3s;
  }
`;

export default AmountInput;
