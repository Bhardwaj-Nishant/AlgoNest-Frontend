import { motion } from "framer-motion";
import { ShieldCheck, Unlock, ArrowRight } from "lucide-react";
import connectImg from "../../assets/connect.png";

function LoginIllustration() {
  return (
    <div className="relative">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl xl:text-6xl font-bold leading-[1.05] text-slate-900"
      >
        Secure access.
        <br />
        <span className="text-[#485E73]">Fast login.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
      >
        Sign in quickly to your AlgoNest workspace and continue tracking your coding progress, streaks, and performance insights.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Quick entry</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">AlgoNest Vault</h2>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#E8F2F4] text-[#485E73]">
            <ShieldCheck size={28} />
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-50 p-4">
          <img src={connectImg} alt="Connected flow" className="w-full rounded-3xl object-cover" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Unlock size={20} className="text-[#485E73]" />
              <p className="font-semibold text-slate-900">One-click re-entry</p>
            </div>
            <p className="mt-2 text-sm text-slate-500">Pick up where you left off in a secure, connected session.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <ArrowRight size={20} className="text-[#485E73]" />
              <p className="font-semibold text-slate-900">Instant navigation</p>
            </div>
            <p className="mt-2 text-sm text-slate-500">Jump directly into analytics, goals, and code streaks after login.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginIllustration;
