import { motion } from "framer-motion";
import {
  Trophy,
  Brain,
  Flame,
  ArrowUpRight,
} from "lucide-react";

import img from "../../assets/analyticsonsignup.png";

function AuthIllustration() {
  return (
    <div className="relative">
      
      {/* Heading */}

      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: .1 }}
        className="
          text-5xl
          xl:text-6xl
          font-bold
          leading-[1.05]
          text-slate-900
        "
      >
        Every Profile.
        <br />

        <span className="text-[#485E73]">
          One Dashboard.
        </span>
      </motion.h1>

      {/* Description */}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .2 }}
        className="
          mt-6
          max-w-xl
          text-lg
          leading-relaxed
          text-slate-600
        "
      >
        <p
          className="
          mt-5
          max-w-xl
          text-lg
          leading-8
          text-slate-600
          "
          >
          Track ratings, contests,
          solved problems,
          coding streaks and receive
          AI-powered recommendations
          to become a better programmer.
        </p>
      </motion.p>

      {/* Dashboard */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .3 }}
        className="
          relative
          mt-10
        "
      >

        <div
          className="
            rounded-4xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            p-7
          "
        >

          {/* Top */}

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-500 text-sm">
                Current Rating
              </p>

              <h2 className="text-4xl font-bold text-slate-900">
                1824
              </h2>

            </div>

            <ArrowUpRight
              className="text-green-500"
              size={32}
            />

          </div>

          {/* Chart */}

          <div
            className="
              mt-8
              h-44
              rounded-2xl
              bg-linear-to-br
              from-[#485E73]/5
              to-slate-100
              flex
              items-center
              justify-center
              text-slate-400
            "
          >
            <img src={img} alt="Analytics Preview" 
             className="rounded-2xl"/>
          </div>

          {/* Stats */}

          <div className="grid grid-cols-3 gap-4 mt-7">

            <div
              className="
                rounded-2xl
                bg-slate-50
                p-4
                text-center
              "
            >
              <p className="text-sm text-slate-500">
                Problems
              </p>

              <h3 className="font-bold text-xl">
                1248
              </h3>
            </div>

            <div
              className="
                rounded-2xl
                bg-slate-50
                p-4
                text-center
                "
              >
              <p className="text-sm text-slate-500">
                Streak
              </p>

              <h3 className="font-bold text-xl">
                24
              </h3>
            </div>

            <div
              className="
                rounded-2xl
                bg-slate-50
                p-4
                text-center
              "
            >
              <p className="text-sm text-slate-500">
                Contests
              </p>

              <h3 className="font-bold text-xl">
                54
              </h3>
            </div>

          </div>

        </div>

        {/* Floating Rating */}

        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
          }}
          className="
            absolute
            -left-12
            top-10
            rounded-2xl
            bg-white
            shadow-xl
            border
            border-slate-200
            p-4
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                h-11
                w-11
                rounded-xl
                bg-yellow-100
                flex
                items-center
                justify-center
              "
            >
              <Trophy
                size={22}
                className="text-yellow-600"
              />
            </div>

            <div>

              <p className="text-xs text-slate-500">
                Best Rating
              </p>

              <h4 className="font-bold">
                Expert
              </h4>

            </div>

          </div>

        </motion.div>

        {/* Floating AI */}

        <motion.div
          animate={{
            y: [0, 12, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
          }}
          className="
            absolute
            -right-10
            top-20
            rounded-2xl
            bg-white
            shadow-xl
            border
            border-slate-200
            p-5
            w-64
          "
        >
          <div className="flex gap-3">

            <Brain
              className="text-[#485E73]"
              size={22}
            />

            <div>

              <p className="font-semibold">
                AI Coach
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Practice Graph Theory.
                Your accuracy improved
                by 16%.
              </p>

            </div>

          </div>

        </motion.div>

        {/* Floating Streak */}

        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
          }}
          className="
            absolute
            bottom-8
            -left-8
            rounded-2xl
            bg-white
            shadow-xl
            border
            border-slate-200
            p-4
          "
        >
          <div className="flex items-center gap-3">

            <Flame
              className="text-orange-500"
              size={22}
            />

            <div>

              <p className="text-xs text-slate-500">
                Current Streak
              </p>

              <h4 className="font-bold">
                24 Days
              </h4>

            </div>

          </div>

        </motion.div>

      </motion.div>

    </div>
  );
}

export default AuthIllustration;