import { motion } from "framer-motion";
import googleLogo from "../../assets/google.png";

function GoogleButton({
  onClick,
  text = "Continue with Google",
  disabled = false,
}) {
  return (
    <motion.button
      whileHover={{
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        w-full
        h-14

        mt-4

        flex
        items-center
        justify-center
        gap-4

        rounded-2xl

        border
        border-slate-300

        bg-white

        text-slate-700
        font-medium

        transition-all

        hover:bg-slate-50
        hover:border-[#485E73]/40

        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      <img
        src={googleLogo}
        alt="Google"
        className="h-6 w-6 object-contain"
      />

      <span>{text}</span>
    </motion.button>
  );
}

export default GoogleButton;