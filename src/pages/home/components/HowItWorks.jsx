import React from 'react';
import { motion } from "framer-motion";
import { Link2, BarChart3, Brain, ArrowRight } from "lucide-react";

import activity from "../../../assets/track.png";
import aitext from "../../../assets/insight.png";
import linked from "../../../assets/imgPlat.png";

function HowItWorks() {
  const steps = [
    {
      icon: <Link2 size={22} />,
      title: "Connect Profiles",
      description: "Link your LeetCode, Codeforces, GeeksforGeeks, CodeChef and GitHub accounts in seconds.",
      image: linked,
    },
    {
      icon: <BarChart3 size={22} />,
      title: "Track Performance",
      description: "Monitor ratings, solved problems, contests, streaks and growth metrics from one dashboard.",
      image: activity,
    },
    {
      icon: <Brain size={22} />,
      title: "Get AI Insights",
      description: "Receive personalized recommendations and discover exactly what to practice next.",
      image: aitext,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="how-it-works" className="bg-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-0.5 bg-[#485E73]" />
              <span className="text-[#485E73] font-bold uppercase tracking-widest text-sm">Workflow</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1]">
              Three Steps.<br />
              <span className="text-slate-400">One Better Coder.</span>
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-slate-600 max-w-sm border-l-2 border-slate-100 pl-6 py-2"
          >
            AlgoNest transforms scattered coding profiles into actionable
            insights that help you improve faster.
          </motion.p>
        </div>

        {/* The Grid Structure */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="group relative flex flex-col bg-slate-50 rounded-[2.5rem] border border-slate-200/60 overflow-hidden hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              {/* Text Content Area */}
              <div className="p-10 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#485E73] flex items-center justify-center text-white mb-8 shadow-lg shadow-[#485E73]/20 group-hover:scale-110 transition-transform duration-500">
                  {step.icon}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="text-[#485E73]/30 text-xl font-black">0{index + 1}</span>
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed min-h-20">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Image / "App Window" Area */}
              <div className="mt-auto px-6 pb-6">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                  {/* Decorative Tool Bar */}
                  <div className="bg-white border-b border-slate-200 px-4 py-2 flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                  </div>
                  
                  {/* The actual image */}
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full object-cover aspect-4/3 group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient Overlay for depth */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/10 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Subtle Step Indicator Line at Bottom */}
              <div className="absolute bottom-0 left-0 h-1.5 bg-[#485E73] transition-all duration-700 w-0 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>

        
      </div>
    </section>
  );
}

export default HowItWorks;