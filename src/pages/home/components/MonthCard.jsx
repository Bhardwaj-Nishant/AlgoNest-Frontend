import { useMemo } from "react";
import Day from "./Day";

function dayState(month, date) {
  let h1 = 0;
  let h2 = 0;
  const key = `${month}-${date}`;

  for (let i = 0; i < key.length; i++) {
    h1 = (h1 * 31 + key.charCodeAt(i)) >>> 0;
    h2 = (h2 * 37 + key.charCodeAt(i)) >>> 0;
  }

  return {
    active: (h1 % 1000) / 1000 > 0.25,
    contest: (h2 % 1000) / 1000 > 0.92,
  };
}

const monthData = {
  June: {
    days: 30,
    startDay: 2, 
  },
  July: {
    days: 31,
    startDay: 4, 
  },
  August: {
    days: 31,
    startDay: 7, 
  },
};

function MonthCard({ month }) {
  const { days, startDay } = monthData[month];

  const cells = useMemo(() => {
    const result = [];

    for (let i = 0; i < startDay; i++) {
      result.push(
        <div
          key={`empty-${i}`}
          className="w-0 h-0"
        />
      );
    }

    for (let i = 1; i <= days; i++) {
      const { active, contest } = dayState(month, i);

      result.push(
        <Day
          key={i}
          date={i}
          active={active}
          contest={contest}
        />
      );
    }

    return result;
  }, [month, days, startDay]);

  return (
    <div className="bg-white border border-slate-400 rounded-3xl p-6">
      <h3 className="text-xl font-semibold mb-4">
        {month}
      </h3>

      <div className="w-full h-px bg-black mb-4"></div>

      {/* Week Days */}
      <div className="grid grid-cols-7 mb-4 text-center text-sm text-slate-500">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-1 justify-items-center">
        {cells}
      </div>
    </div>
  );
}

export default MonthCard;