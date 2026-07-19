import React from 'react'
import { motion } from "framer-motion";

import {
  Brain,
  CalendarDays,
  BarChart3,
  User,
  Trophy,
  ArrowUpRight,
} from "lucide-react";

function Features() {
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
    <section
      id="features"
      className="py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >

          <h2
            className="
              mt-0
              text-5xl
              md:text-6xl
              font-bold
              text-slate-900
            "
          >
            Everything You Need To
            <br />
            Improve Consistently
          </h2>

          <p
            className="
              mt-6
              max-w-2xl
              mx-auto
              text-lg
              text-slate-600
            "
          >
            Track your coding journey,
            analyze performance and receive
            personalized recommendations.
          </p>

        </motion.div>

        {/* Bento Grid */}

        <div
          className="
            mt-20
            grid
            grid-cols-1
            lg:grid-cols-4
            gap-6
          "
        >

          {/* AI Coach */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="
              lg:col-span-2
              lg:row-span-2
              rounded-3xl
              border
              border-slate-200
              bg-linear-to-br
              from-[#485E73]/5
              to-white
              p-8
              hover:shadow-xl
              transition-all
              duration-300
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-[#485E73]/10
                flex
                items-center
                justify-center
                text-[#485E73]
              "
            >
              <Brain size={28} />
            </div>

            <h3
              className="
                mt-6
                text-4xl
                font-bold
                text-slate-900
              "
            >
              AI Coach
            </h3>

            <p
              className="
                mt-4
                text-slate-600
                text-lg
              "
            >
              Discover weak topics,
              identify learning gaps and
              receive personalized practice
              recommendations.
            </p>

            {/* Fake AI Terminal */}

            <div
              className="
                mt-10
                rounded-2xl
                bg-slate-900
                p-5
                text-slate-300
                font-mono
              "
            >
              <p className="text-green-400">
                &gt; Analyzing profile...
              </p>

              <div className="mt-4">
                <p>
                  Weak Areas:
                </p>

                <p>
                  • Dynamic Programming
                </p>

                <p>
                  • Graph Theory
                </p>
              </div>

              <div className="mt-4">
                <p>
                  Suggested Practice:
                </p>

                <p className="text-[#8BA6BF]">
                  12 Problems
                </p>
              </div>
            </div>

          </motion.div>

          {/* Contest Calendar */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className="
              rounded-3xl
              border
              border-slate-200
              p-8
              hover:shadow-xl
              transition-all
            "
          >
            <CalendarDays
              size={32}
              className="text-[#485E73]"
            />

            <h3
              className="
                mt-5
                text-2xl
                font-semibold
                text-slate-900
              "
            >
              Contest Calendar
            </h3>

            <p
              className="
                mt-3
                text-slate-600
              "
            >
              Track contests across all
              coding platforms in one place.
            </p>
          </motion.div>

          {/* Analytics */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="
              rounded-3xl
              border
              border-slate-200
              p-8
              hover:shadow-xl
              transition-all
            "
          >
            <BarChart3
              size={32}
              className="text-[#485E73]"
            />

            <h3
              className="
                mt-5
                text-2xl
                font-semibold
                text-slate-900
              "
            >
              Analytics
            </h3>

            <p
              className="
                mt-3
                text-slate-600
              "
            >
              Visualize ratings,
              problem solving trends
              and consistency.
            </p>
          </motion.div>

          {/* Profile Tracking */}

          <motion.div
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{
    duration: 0.5,
    delay: 0.3,
  }}
  className="
    lg:col-span-2
    rounded-3xl
    bg-[#485E73]
    text-white
    p-8
    hover:shadow-xl
    transition-all
    overflow-hidden
    relative
  "
>
  <div className="relative z-10">

    <div className="flex items-center justify-between">

      <User size={32} />

      <ArrowUpRight size={24} />
    </div>

    <h3
      className="
        mt-6
        text-4xl
        font-bold
      "
    >
      Profile Tracking
    </h3>

    <p
      className="
        mt-4
        text-slate-200
        max-w-lg
      "
    >
      Connect all your coding platforms
      and track ratings, solved problems,
      achievements and progress from
      a single place.
    </p>

    {/* Platforms */}

    <div className="mt-10 flex flex-wrap gap-3">

      <span
        className="
          px-4
          py-2
          rounded-full
          bg-white/10
           hover:bg-white/20
          cursor-pointer
          hover:shadow-md
        "
      >
        LeetCode
      </span>

      <span
        className="
          px-4
          py-2
          rounded-full
          bg-white/10
           hover:bg-white/20
          cursor-pointer
          hover:shadow-md
        "
      >
        Codeforces
      </span>

      <span
        className="
          px-4
          py-2
          rounded-full
          bg-white/10
           hover:bg-white/20
          cursor-pointer
          hover:shadow-md
        "
      >
        GFG
      </span>

      <span
        className="
          px-4
          py-2
          rounded-full
          bg-white/10
           hover:bg-white/20
          cursor-pointer
          hover:shadow-md
        "
      >
        CodeChef
      </span>

      <span
        className="
          px-4
          py-2
          rounded-full
          bg-white/10
          hover:bg-white/20
          cursor-pointer
          hover:shadow-md
        "
      >
        GitHub
      </span>

    </div>

  </div>

  {/* Background Glow */}

  <div
    className="
      absolute
      -right-20
      -bottom-20
      w-64
      h-64
      rounded-full
      bg-white/10
      blur-3xl
    "
  />
</motion.div>


        </div>

      </div>
    </section>
  );
}

export default Features;