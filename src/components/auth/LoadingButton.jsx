import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function LoadingButton({
  loading = false,
  children,
  type = "submit",
  onClick,
}) {
  return (
    <motion.button
      whileHover={!loading ? { scale: 1.02 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      type={type}
      onClick={onClick}
      disabled={loading}
      className="
        mt-4
        w-full
        h-14

        rounded-2xl

        bg-[#485E73]
        text-white

        font-semibold
        text-base

        flex
        items-center
        justify-center
        gap-3

        transition-all
        duration-300

        hover:bg-[#3b4d60]

        disabled:cursor-not-allowed
        disabled:opacity-80
      "
    >
      {loading && (
        <Loader2
          size={20}
          className="animate-spin"
        />
      )}

      {loading ? "Please wait..." : children}
    </motion.button>
  );
}

export default LoadingButton;