import styled from "styled-components";

const CommentInput = styled.textarea.attrs({
  maxLength: 70,
})`
  box-sizing: border-box;
  width: 100%;
  height: 55px;
  padding: 10px;
  margin-bottom: 15px;
  font-family: "Inter", sans-serif;
  background-color: var(--color-blue-input);
  border-radius: 12px;
  border: none;
  resize: none;
  :focus {
    outline: none;
    box-shadow: 0 0 0 1px var(--color-green);
    transition: 0.3s;
  }
`;

export default CommentInput;
