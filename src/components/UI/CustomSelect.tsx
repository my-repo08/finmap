import styled from "styled-components";
import Select from "react-select";

const CustomSelect = styled(Select).attrs({
  styles: {
    control: (provided) => ({
      ...provided,
      height: "55px",
      color: "var(--color-full-dark)",
      backgroundColor: "var(--color-blue-input)",
      borderRadius: "12px",
      border: "none",
      boxShadow: "none",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "15px 25px",
      color: "var(--color-full-dark)",
      borderRadius: "10px",
      backgroundColor: "white",
      opacity: state.isDisabled ? "0.6" : "1",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      fontWeight: state.isSelected ? "bold" : "normal",
      "&:hover": {
        backgroundColor: "var(--color-blue-input)",
      },
      ":first-of-type": {
        marginTop: "-5px",
      },
      ":last-of-type": {
        marginBottom: "-5px",
      },
    }),
  },
})`
  margin-bottom: 15px;
  font-size: 14px;
  border: none;
  border-radius: 10px;
  :focus-within {
    outline: none;
    box-shadow: 0 0 0 1px var(--color-green);
    transition: 0.3s;
  }
  & > div[id] {
    padding: 10px;
    border-radius: 18px;
    border: none;
  }
`;

export default CustomSelect;
