import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Trophy, Brain, Flame, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import leetcode from "../../../assets/leetcode.png";
import geeksforgeeks from "../../../assets/geeksforgeeks.png";
import codechef from "../../../assets/codechef.png";
import codeforces from "../../../assets/codeforces.png";
import github from "../../../assets/github.png";

import MonthCard from "../components/MonthCard";

function Hero() {
  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="relative overflow-hidden bg-white min-h-screen">

      {/* ================= Background ================= */}

      <div
        className="
          absolute
          top-40
          left-1/2
          -translate-x-1/2
          w-3xl
          h-192
          rounded-full
          bg-[#485E73]/10
          blur-[150px]
          pointer-events-none
        "
      />

      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
        }}
        className="
          absolute
          -top-20
          -left-20
          w-72
          h-72
          rounded-full
          bg-sky-100/60
          blur-3xl
        "
      />

      <motion.div
        animate={{
          x: [0, -70, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
        }}
        className="
          absolute
          bottom-0
          right-0
          w-96
          h-96
          rounded-full
          bg-indigo-100/70
          blur-3xl
        "
      />

      {/* ================= Floating Platform Icons ================= */}

      <motion.img
        src={leetcode}
        alt=""
        animate={{
          y: [-15, 15, -15],
          rotate: [-8, 8, -8],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
        }}
        className="
          hidden
          lg:block
          absolute
          left-10
          top-52
          h-14
          opacity-15
          pointer-events-none
        "
      />
      <motion.img
        src={codechef}
        alt=""
        animate={{
          y: [-15, 15, -15],
          rotate: [-8, 8, -8],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
        }}
        className="
          hidden
          lg:block
          absolute
          left-150
          top-35
          h-14
          opacity-15
          pointer-events-none
        "
      />
      

      <motion.img
        src={github}
        alt=""
        animate={{
          y: [15, -15, 15],
          rotate: [8, -8, 8],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
        }}
        className="
          hidden
          lg:block
          absolute
          right-10
          top-28
          h-16
          opacity-15
          pointer-events-none
        "
      />

      <motion.img
        src={codeforces}
        alt=""
        animate={{
          y: [-18, 18, -18],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="
          hidden
          lg:block
          absolute
          top-110
          left-20
          h-14
          opacity-10
          pointer-events-none
        "
      />

      <motion.img
        src={geeksforgeeks}
        alt=""
        animate={{
          y: [18, -18, 18],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="
          hidden
          lg:block
          absolute
          top-105
          right-100
          h-14
          opacity-10
          pointer-events-none
        "
      />

      {/* ================= Floating Labels ================= */}

      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="
          hidden
          lg:flex
          absolute
          left-135
          top-60
          bg-white/90
          backdrop-blur
          shadow-lg
          rounded-full
          px-5
          py-3
          border
          border-slate-200
          items-center
          gap-2
        "
      >
        <Flame className="text-orange-500" size={18} />
        <span className="text-sm font-medium">
          42 Day Streak
        </span>
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="
          hidden
          lg:flex
          absolute
          right-10
          top-80
          bg-white/90
          backdrop-blur
          shadow-lg
          rounded-full
          px-5
          py-3
          border
          border-slate-200
          items-center
          gap-2
        "
      >
        <TrendingUp
          className="text-green-500"
          size={18}
        />

        <span className="text-sm font-medium">
          +120 Rating
        </span>
      </motion.div>

      <motion.div
        animate={{ y: [-12, 12, -12] }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="
          hidden
          xl:flex
          absolute
          right-72
          top-10
          bg-white
          shadow-lg
          rounded-full
          px-5
          py-3
          border
          border-slate-200
          items-center
          gap-2
        "
      >
        <Brain
          size={18}
          className="text-[#485E73]"
        />

        <span className="text-sm">
          AI Coach Ready
        </span>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6">

        {/* ================= Main Hero ================= */}

        <div
          className="
            mt-16
            grid
            lg:grid-cols-2
            gap-16
            items-center
          "
        >

          {/* ================= Left ================= */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
          >

            <h1
              className="
                text-6xl
                md:text-7xl
                lg:text-8xl
                font-bold
                leading-none
                tracking-tight
                text-slate-900
              "
            >
              See Your Growth.
            </h1>

            <h2
              className="
                mt-3
                text-5xl
                md:text-6xl
                lg:text-7xl
                font-bold
                leading-none
                tracking-tight
                text-[#485E73]
              "
            >
              Across Every
              <br />
              Coding Platform.
            </h2>

          </motion.div>

          {/* ================= Right ================= */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.7,
              delay: 0.5,
            }}
            className="flex flex-col justify-center"
          >            <p
              className="
                text-xl
                text-slate-600
                leading-relaxed
                max-w-xl
              "
            >
              Connect LeetCode, GeeksforGeeks,
              Codeforces, CodeChef and GitHub.
              Track ratings, contests,
              streaks and receive
              AI-powered recommendations
              to improve faster.
            </p>

            {/* CTA */}

            <div
              className="
                mt-10
                flex
                flex-wrap
                gap-4
              "
            >

              <Link
                to="/signup"
                className="
                  group
                  bg-[#485E73]
                  hover:bg-[#3B4D5F]
                  text-white
                  px-7
                  py-4
                  rounded-xl
                  font-medium
                  flex
                  items-center
                  gap-2
                  transition-all
                  duration-300
                  shadow-lg
                  hover:shadow-xl
                "
              >
                Start Tracking

                <ArrowRight
                  size={18}
                  className="
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </Link>

              <a
                href="#features"
                className="
                  border
                  border-slate-300
                  hover:border-[#485E73]
                  hover:bg-slate-50
                  px-7
                  py-4
                  rounded-xl
                  font-medium
                  transition-all
                "
              >
                Explore Features
              </a>

            </div>

            {/* Platforms */}

            <div
              className="
                mt-6
                flex
                items-center
                gap-8
                flex-wrap
              "
            >

              {[
                leetcode,
                geeksforgeeks,
                codeforces,
                codechef,
                github,
              ].map((logo, i) => (

                <motion.img
                  key={i}
                  whileHover={{
                    scale: 1.12,
                    y: -4,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  src={logo}
                  alt=""
                  className="h-12 object-contain"
                />

              ))}

            </div>

          </motion.div>

        </div>

        {/* ================================================= */}
        {/* Dashboard */}
        {/* ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.8,
          }}
          className="
            relative
            mt-28
            mb-12
            max-w-6xl
            mx-auto
          "
        >

          {/* Floating Card */}

          <motion.div
            animate={{
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
            className="
              hidden
              xl:block
              absolute
              -left-10
              top-12
              bg-white
              rounded-2xl
              shadow-xl
              border
              border-slate-200
              px-5
              py-4
              z-20
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-orange-100
                  flex
                  items-center
                  justify-center
                "
              >
                <Flame
                  className="text-orange-500"
                  size={22}
                />
              </div>

              <div>

                <p className="text-xs text-slate-500">
                  Current Streak
                </p>

                <h4 className="font-bold text-lg">
                  42 Days
                </h4>

              </div>

            </div>

          </motion.div>

          {/* Floating Card */}

          <motion.div
            animate={{
              y: [12, -12, 12],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
            }}
            className="
              hidden
              xl:block
              absolute
              -right-10
              top-24
              bg-white
              rounded-2xl
              shadow-xl
              border
              border-slate-200
              px-5
              py-4
              z-20
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-green-100
                  flex
                  items-center
                  justify-center
                "
              >
                <TrendingUp
                  className="text-green-600"
                  size={22}
                />
              </div>

              <div>

                <p className="text-xs text-slate-500">
                  Weekly Growth
                </p>

                <h4 className="font-bold text-lg">
                  +128 Rating
                </h4>

              </div>

            </div>

          </motion.div>

          {/* Floating Card */}

          <motion.div
            animate={{
              y: [-8, 8, -8],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="
              hidden
              2xl:block
              absolute
              left-32
              -bottom-8
              bg-white
              rounded-2xl
              shadow-xl
              border
              border-slate-200
              px-5
              py-4
              z-20
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-violet-100
                  flex
                  items-center
                  justify-center
                "
              >
                <Brain
                  size={20}
                  className="text-violet-600"
                />
              </div>

              <div>

                <p className="text-xs text-slate-500">
                  AI Suggestion
                </p>

                <h4 className="font-semibold">
                  Practice Graphs
                </h4>

              </div>

            </div>

          </motion.div>

          {/* Floating Card */}

          <motion.div
            animate={{
              y: [8, -8, 8],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
            className="
              hidden
              2xl:block
              absolute
              right-36
              -bottom-10
              bg-white
              rounded-2xl
              shadow-xl
              border
              border-slate-200
              px-5
              py-4
              z-20
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-yellow-100
                  flex
                  items-center
                  justify-center
                "
              >
                <Trophy
                  className="text-yellow-600"
                  size={20}
                />
              </div>

              <div>

                <p className="text-xs text-slate-500">
                  Contest Rank
                </p>

                <h4 className="font-bold">
                  #487
                </h4>

              </div>

            </div>

          </motion.div>

          {/* Dashboard Container */}

          <div
            className="
              bg-white
              rounded-[34px]
              border
              border-slate-200
              shadow-2xl
              p-8
              relative
              overflow-hidden
            "
          >

            {/* Decorative Grid */}

            <div
              className="
                absolute
                inset-0
                opacity-[0.03]
                bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
                bg-size-[38px_38px]
                pointer-events-none
              "
            />

            {/* Analytics Header */}

            <div className="flex items-center justify-between mb-7">

              <div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Coding Analytics
                </h3>

                <p className="text-slate-500 mt-1">
                  Unified performance across all platforms
                </p>

              </div>

              <div
                className="
                  px-4
                  py-2
                  rounded-full
                  bg-green-100
                  text-green-700
                  font-medium
                  text-sm
                "
              >
                Live Sync
              </div>

            </div>

            {/* Continue with stats grid in Part 3 */}            {/* Stats */}

            <div className="grid md:grid-cols-4 gap-5">

              <motion.div
                whileHover={{ y: -6 }}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <p className="text-slate-500">
                  Overall Score
                </p>

                <h2 className="text-5xl font-bold mt-3">
                  82
                </h2>

                <p className="mt-2 text-emerald-600 font-medium">
                  ▲ +8% this month
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -6 }}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <p className="text-slate-500">
                  LeetCode Rating
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  1850
                </h2>

                <p className="mt-2 text-[#485E73]">
                  Top 12%
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -6 }}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <p className="text-slate-500">
                  Codeforces
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  1650
                </h2>

                <p className="mt-2 text-[#485E73]">
                  Specialist
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -6 }}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <p className="text-slate-500">
                  Problems Solved
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  1248
                </h2>

                <p className="mt-2 text-emerald-600">
                  +94 this week
                </p>
              </motion.div>

            </div>

            {/* Monthly Heatmaps */}

            <div
              className="
                grid
                md:grid-cols-3
                gap-5
                mt-8
              "
            >
              <MonthCard month="June" />
              <MonthCard month="July" />
              <MonthCard month="August" />
            </div>


          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default Hero;