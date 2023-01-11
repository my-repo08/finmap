import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = styled(DatePicker)`
  box-sizing: border-box;
  width: 100%;
  height: 55px;
  margin-bottom: 15px;
  padding: 0 10px;
  background-color: var(--color-blue-input);
  border-radius: 12px;
  border: none;
  :focus {
    outline: none;
    box-shadow: 0 0 0 1px var(--color-green);
    transition: 0.3s;
  }
`;

export default DateInput;
