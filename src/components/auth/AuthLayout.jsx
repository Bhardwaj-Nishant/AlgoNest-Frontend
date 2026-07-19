import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";

function AuthLayout({ leftContent, children, reverseOnLarge = false }) {
  const hasLeftContent = !!leftContent;
  const hasRightContent = !!children;
  const singleColumn = !hasLeftContent || !hasRightContent;

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">

      {/* Background Blurs */}
      <div className="absolute top-24 left-24 h-80 w-80 rounded-full bg-[#485E73]/5 blur-[120px] -z-10" />
      <div className="absolute bottom-10 right-20 h-96 w-96 rounded-full bg-slate-200/30 blur-[120px] -z-10" />

      {/* Logo */}
      <Link to="/" className="absolute top-8 left-10 flex items-center gap-3 z-20">
        <img src={logo} alt="AlgoNest" className="h-12" />
        <h1 className="text-3xl font-bold text-slate-900">
          Algo<span className="text-[#485E73]">Nest</span>
        </h1>
      </Link>

      {/* Main Grid – single column if no leftContent, else two columns on large screens */}
      <div
        className={`
          ${singleColumn ? 'max-w-3xl' : 'max-w-7xl'} mx-auto min-h-screen px-6 py-12 mt-2
          grid gap-24 items-center justify-center
          ${hasLeftContent && hasRightContent ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}
        `}
      >
        {/* Left Column – only rendered if leftContent exists */}
        {hasLeftContent && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`
              hidden lg:flex flex-col justify-center pt-10
              ${reverseOnLarge ? 'lg:order-2' : ''}
            `}
          >
            {leftContent}
          </motion.div>
        )}

        {/* Right Column – form area */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`
            w-full mx-auto pt-10
            ${reverseOnLarge ? 'lg:order-1' : ''}
            ${hasLeftContent ? 'lg:max-w-lg' : 'max-w-md'}
          `}
        >
          <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-lg">
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AuthLayout;