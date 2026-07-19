import { motion } from "framer-motion";

function Divider({
  text = "OR",
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: 0.2,
      }}
      className="
        flex
        items-center
        my-6
      "
    >
      <div className="flex-1 h-px bg-slate-200" />

      <span
        className="
          px-4
          text-sm
          font-medium
          tracking-wide
          uppercase
          text-slate-400
        "
      >
        {text}
      </span>

      <div className="flex-1 h-px bg-slate-200" />
    </motion.div>
  );
}

export default Divider;