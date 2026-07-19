import MonthCard from "./MonthCard";

function Calendar() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <MonthCard month="June" />
      <MonthCard month="July" />
      <MonthCard month="August" />
    </div>
  );
}

export default Calendar;