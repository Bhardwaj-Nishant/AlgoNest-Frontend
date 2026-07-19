import { motion } from "framer-motion";

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  icon,
  required = false,
  error,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="mb-5"
    >
      {/* Label */}

      <label
        htmlFor={name}
        className="
          block
          mb-2
          text-sm
          font-medium
          text-slate-700
        "
      >
        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      {/* Input */}

      <div
        className="
          flex
          items-center
          gap-3

          h-14

          rounded-2xl

          border
          border-slate-300

          px-4

          transition-all

          focus-within:border-[#485E73]
          focus-within:ring-4
          focus-within:ring-[#485E73]/10
        "
      >
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            w-full
            bg-transparent
            outline-none

            text-slate-900
            placeholder:text-slate-400
          "
        />
      </div>

      {/* Error */}

      {error && (
        <p
          className="
            mt-2
            text-sm
            text-red-500
          "
        >
          {error}
        </p>
      )}
    </motion.div>
  );
}

export default InputField;