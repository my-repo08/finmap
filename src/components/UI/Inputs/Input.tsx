import styled from "styled-components";

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  margin-bottom: 15px;
  padding: 0 10px;
  font-size: 16px;
  border: none;
  background-color: #eff3f5;
  border-radius: 12px;
  :focus {
    outline: none;
    box-shadow: 0 0 0 1px var(--color-green);
    transition: 0.3s;
  }
  ::placeholder {
    color: #989a9c;
    opacity: 0.8;
  }
`;

export default Input;
