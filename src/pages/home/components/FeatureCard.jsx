function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div
      className="
        group
        bg-white
        border
        border-slate-200
        rounded-3xl
        p-8
        hover:border-[#485E73]/30
        hover:shadow-xl
        transition-all
        duration-300
      "
    >
      <div
        className="
          w-14
          h-14
          rounded-2xl
          bg-[#485E73]/10
          flex
          items-center
          justify-center
          text-[#485E73]
        "
      >
        {icon}
      </div>

      <h3
        className="
          mt-6
          text-2xl
          font-semibold
          text-slate-900
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-3
          text-slate-600
          leading-relaxed
        "
      >
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;