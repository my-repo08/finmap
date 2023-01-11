import styled from "styled-components";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import useMediaQuery from "../../../../hooks/useMediaQuery";
import { convertCurrency, setIcon } from "../../../../utils/utils";
import { ITEM_VARIANTS } from "../../../../const";
import { Transaction } from "../../../../atom/transactionsAtom";

const ListItem = styled(motion.li)`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  margin-right: 15px;
  padding: 20px 0;
  :not(:last-child) {
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
  }
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 15px 0;
  }
`;

const ItemFormat = styled.span<{ margin?: string }>`
  display: flex;
  justify-self: flex-start;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: ${(props) => props.margin};
  line-height: 22px;
  @media (max-width: 768px) {
    margin-left: 0;
    padding-left: 5px;
  }
`;

const AmountItem = styled(ItemFormat)<{ type: string }>`
  color: ${(props) =>
    props.type === "transfer"
      ? "inherit"
      : props.type === "income"
      ? "#00B28E"
      : "#FF6333"};
  @media (max-width: 768px) {
    position: absolute;
    top: 15px;
    right: 5px;
  }
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: -8px;
  margin-left: 20px;
  @media (max-width: 768px) {
    position: absolute;
    top: 40px;
    right: 5px;
    align-items: flex-end;
    margin-top: 0;
    margin-left: 0;
    opacity: 0.5;
    font-size: 14px;
  }
`;

const IconWrapper = styled.div`
  font-size: 25px;
  color: gray;
  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: -5px;
  }
`;

const CommentItem = styled.span`
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 25px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const AccountItem = styled.div`
  font-size: 14px;
  opacity: 0.5;
`;

const DateItem = styled.div`
  :last-child {
    font-size: 14px;
    opacity: 0.5;
  }
`;

const TransferCurrency = styled.div`
  font-size: 14px;
  opacity: 0.5;
`;

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const {
    id,
    createdAt,
    type,
    amount,
    transfer,
    accountLabel,
    accountAmount,
    category,
    comment,
  } = transaction;

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <ListItem key={id} variants={ITEM_VARIANTS}>
      <ItemFormat>
        <DateItem>{dayjs(createdAt).format("D MMM YYYY")}</DateItem>
        {!isMobile && <DateItem>{dayjs(createdAt).format("HH:MM")}</DateItem>}
      </ItemFormat>
      <AmountItem type={type}>
        {type === "transfer" ? "" : type === "income" ? "+ " : "- "}
        {convertCurrency.format(amount)}
      </AmountItem>
      <ItemFormat margin="17px">
        {type === "transfer" ? (
          <>
            <div>
              <span>{transfer?.fromAccount}</span>
              <TransferCurrency>
                {convertCurrency.format(transfer?.fromAccountAmount!)}
              </TransferCurrency>
            </div>
            <div>
              <span>{transfer?.toAccount}</span>
              <TransferCurrency>
                {convertCurrency.format(transfer?.toAccountAmount!)}
              </TransferCurrency>
            </div>
          </>
        ) : (
          <>
            {accountLabel}
            <AccountItem>{convertCurrency.format(accountAmount!)}</AccountItem>
          </>
        )}
      </ItemFormat>
      <CategoryItem>
        <IconWrapper>{setIcon(category)}</IconWrapper>
        {type === "transfer" ? "Transfer" : category}
      </CategoryItem>
      <CommentItem>{comment}</CommentItem>
    </ListItem>
  );
};

export default TransactionItem;
