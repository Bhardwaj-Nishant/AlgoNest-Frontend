import React from 'react'

import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";

function CTA() {
  const [activeIndex, setActiveIndex] =
    useState(null);

  const faqs = [
    {
      question:
        "How do I connect my coding profiles?",
      answer:
        "Simply enter your usernames for LeetCode, GeeksforGeeks, Codeforces, CodeChef and GitHub. AlgoNest automatically fetches and analyzes your public profile data.",
    },

    {
      question:
        "Does AlgoNest track contest participation?",
      answer:
        "Yes. AlgoNest tracks contests, ratings, streaks and participation history across supported platforms.",
    },

    {
      question:
        "How does the AI Coach work?",
      answer:
        "Our AI analyzes your performance patterns, identifies weak topics and suggests personalized practice plans.",
    },

    {
      question:
        "Can I share my profile with recruiters?",
      answer:
        "Yes. You'll be able to generate a public profile showcasing your coding achievements and growth.",
    },
  ];

  const toggleFaq = (index) => {
    setActiveIndex(
      activeIndex === index
        ? null
        : index
    );
  };

  return (
    <section id="cta" className="bg-white py-15">
      <div className="max-w-5xl mx-auto px-6">

        {/* FAQ */}

        <h2
          className="
            text-center
            text-5xl
            font-bold
            text-slate-900
          "
        >
          Frequently Asked Questions
        </h2>
        <div className='w-full h-px bg-black mt-5'></div>

        <div className="mt-16">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="
                border-b
                border-slate-200
              "
            >
              <button
                onClick={() =>
                  toggleFaq(index)
                }
                className="
                  w-full
                  py-7
                  flex
                  items-center
                  justify-between
                  text-left
                "
              >
                <span
                  className="
                    text-xl
                    font-medium
                    text-slate-900
                  "
                >
                  {faq.question}
                </span>

                {activeIndex === index ? (
                  <Minus
                    size={24}
                    className="text-slate-600"
                  />
                ) : (
                  <Plus
                    size={24}
                    className="text-slate-600"
                  />
                )}
              </button>

              <div
                className={`
                  overflow-hidden
                  transition-all
                  duration-300
                  ease-in-out
                  ${
                    activeIndex === index
                      ? "max-h-96 opacity-100 pb-6"
                      : "max-h-0 opacity-0"
                  }
                `}
              >
                <div
                  className="
                    text-slate-600
                    leading-relaxed
                    max-w-3xl
                  "
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* CTA */}

        <div
          className="
            mt-32
            text-center
          "
        >
          <h3
            className="
              text-5xl
              md:text-6xl
              font-bold
              text-slate-900
            "
          >
            Ready To
            <span className="text-[#485E73]">
              {" "}Level Up{" "}
            </span>
            Your Coding Journey?
          </h3>

          <p
            className="
              mt-6
              text-xl
              text-slate-600
            "
          >
            Track your growth, improve
            consistency and receive
            AI-powered guidance.
          </p>

          <Link
            to="/signup"
            className="
              mt-10
              inline-flex
              items-center
              gap-3

              px-8
              py-4

              rounded-2xl

              bg-[#485E73]
              text-white

              font-semibold

              hover:scale-105
              transition-all
            "
          >
            Start Tracking

            <ArrowRight size={20} />
          </Link>

        </div>

      </div>
    </section>
  );
}

export default CTA;