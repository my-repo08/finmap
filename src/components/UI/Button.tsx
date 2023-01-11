import styled from "styled-components";

const Button = styled.button`
  width: 100%;
  height: 60px;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  :not(:disabled) {
    :hover {
      opacity: 0.9;
    }
    :active {
      opacity: 1;
    }
  }
  :disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default Button;
