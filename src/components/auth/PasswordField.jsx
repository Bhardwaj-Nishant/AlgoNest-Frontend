import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";

function PasswordField({
  label,
  name,
  placeholder = "Enter your password",
  value,
  onChange,
  onFocus,
  onBlur,
  required = false,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

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
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {/* Input */}

      <div
        className="
          flex
          items-center
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
        {/* Lock Icon */}

        <Lock
          size={20}
          className="text-slate-400 mr-3"
        />

        {/* Input */}

        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="
            flex-1
            bg-transparent
            outline-none
            text-slate-900
            placeholder:text-slate-400
          "
        />

        {/* Toggle */}

        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="
            text-slate-400
            hover:text-[#485E73]
            transition-colors
          "
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
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

export default PasswordField;