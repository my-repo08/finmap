import { forwardRef } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GoDash } from "react-icons/go";
import { DATE_RANGE_OPTIONS, DATERANGE_VARIANTS } from "../../../const";
import { AnimatePresence, motion } from "framer-motion";

const Wrapper = styled.div`
  z-index: 1;
  position: fixed;
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    margin-bottom: 5px;
    margin-left: 3px;
  } ;
`;

const ButtonWrapper = styled(motion.div)`
  position: relative;
  width: 250px;
  height: 45px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 12px;
  background-color: var(--color-blue-date);
  @media (max-width: 768px) {
    width: 170px;
  }
`;

const DateButton = styled.button`
  width: 105px;
  height: 35px;
  display: inline-block;
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  border: none;
  background: transparent;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 75px;
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
`;

const DateRangeSelect = styled(Select).attrs({
  styles: {
    control: (provided) => ({
      ...provided,
      height: "45px",
      fontWeight: 700,
      color: "var(--color-full-dark)",
      backgroundColor: "var(--color-blue-date)",
      borderRadius: "12px",
      border: "none",
      boxShadow: "none",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "15px 25px",
      cursor: "pointer",
      color: "var(--color-full-dark)",
      borderRadius: "10px",
      backgroundColor: "white",
      fontWeight: state.isSelected ? "bold" : "normal",
      "&:hover": {
        backgroundColor: "var(--color-blue-date)",
      },
      ":first-of-type": {
        marginTop: "-5px",
      },
      ":last-of-type": {
        marginBottom: "-5px",
      },
      "@media (max-width: 768px)": {
        padding: "10px 15px",
      },
    }),
  },
})`
  width: 250px;
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
    @media (max-width: 768px) {
      padding: 5px;
    }
  }
  @media (max-width: 768px) {
    width: 170px;
  }
`;

//@ts-ignore
const DateInput = forwardRef(({ value, onClick, rangeType }, ref) => (
  //@ts-ignore
  <DateButton onClick={onClick} ref={ref}>
    {value ? dayjs(value).format("D MMM YYYY") : rangeType}
  </DateButton>
));

interface DateRangePickerProps {
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  selectedRangeOption: {
    value: string;
    label: string;
  };
  setSelectedRangeOption: (filterType: { value: string; label: string }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedRangeOption,
  setSelectedRangeOption,
}) => {
  return (
    <Wrapper>
      <DateRangeSelect
        options={DATE_RANGE_OPTIONS}
        defaultValue={selectedRangeOption}
        //@ts-ignore
        onChange={setSelectedRangeOption}
      />
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {selectedRangeOption.value === "selectDates" && (
          <ButtonWrapper
            variants={DATERANGE_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <DatePickerWrapper>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                //@ts-ignore
                customInput={<DateInput rangeType="From" />}
              />
            </DatePickerWrapper>
            <GoDash size={20} />
            <DatePickerWrapper>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                //@ts-ignore
                customInput={<DateInput rangeType="To" />}
              />
            </DatePickerWrapper>
          </ButtonWrapper>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default DateRangePicker;
