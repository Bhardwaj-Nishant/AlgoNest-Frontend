function Day({ date, active, contest }) {
  return (
    <div
  className={`
    w-7
    h-7
    rounded-md
    flex
    items-center
    justify-center
    text-[10px]
    ${
          contest
            ? "bg-amber-400 text-white"
            : active
            ? "bg-yellow-100 text-black"
            : "bg-slate-100 text-slate-500"
        }
  `}
>

      {date}
    </div>
  );
}

export default Day;