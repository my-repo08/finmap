import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import { Transaction } from "../../../atom/transactionsAtom";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  getLabels,
  chartData,
  getTotal,
  setIncomeColor,
  setExpenseColor,
} from "../../../utils/utils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const DoughnutWrapper = styled.div`
  position: relative;
  top: 5%;
`;

const TotalSum = styled.div<{ color: string }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 45%;
  display: block;
  font-size: 30px;
  line-height: 36px;
  font-weight: 700;
  text-align: center;
  color: ${(props) => (props.color === "income" ? "#00B28E" : "#FF6333")};
`;

const CategoryList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  margin-top: 50px;
  padding-top: 40px;
  padding-bottom: 40px;
  gap: 16px;
  list-style-type: none;
`;

const CategoryItem = styled.li`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
`;

const CategoryWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const Category = styled.div<{ bgcolor: string }>`
  font-weight: 16px;
  ::before {
    content: "";
    padding: 3px 5px;
    margin-right: 10px;
    border-radius: 4px;
    background-color: ${(props) => props.bgcolor};
  }
`;

const PercentValue = styled.span`
  display: inline-block;
  font-weight: 700;
`;

ChartJS.register(ArcElement, Tooltip);

interface CustomChartProps {
  transactions: Transaction[];
  type: string;
}

const CustomChart: React.FC<CustomChartProps> = ({ transactions, type }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Container>
      <DoughnutWrapper>
        <Doughnut {...chartData(transactions, type, isMobile)} />
        <TotalSum color={type}>
          {`${type === "income" ? "+" : "-"} ${getTotal(transactions)} $`}
        </TotalSum>
      </DoughnutWrapper>
      <CategoryList>
        {getLabels(transactions, type).map((value, i) => (
          <CategoryItem key={i}>
            <CategoryWrapper>
              <Category
                bgcolor={
                  type === "income"
                    ? setIncomeColor(value.category)
                    : setExpenseColor(value.category)
                }
              >
                {value.category}
              </Category>
            </CategoryWrapper>
            <PercentValue>{`${Math.round(value.percent)} %`}</PercentValue>
          </CategoryItem>
        ))}
      </CategoryList>
    </Container>
  );
};

export default CustomChart;
