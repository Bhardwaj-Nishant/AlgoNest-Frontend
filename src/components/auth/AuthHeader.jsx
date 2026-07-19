import { motion } from "framer-motion";

function AuthHeader({
  badge,
  title,
  description,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="mb-7"
    >
      {badge && (
        <span
          className="
            inline-flex
            items-center
            rounded-full
            bg-[#485E73]/10
            px-4
            py-1.5
            text-sm
            font-medium
            text-[#485E73]
          "
        >
          {badge}
        </span>
      )}

      <h1
        className="
          mt-3
          text-4xl
          font-bold
          text-slate-900
          leading-tight
        "
      >
        {title}
      </h1>

      <p
        className="
          mt-3
          text-slate-600
          leading-relaxed
        "
      >
        {description}
      </p>
    </motion.div>
  );
}

export default AuthHeader;