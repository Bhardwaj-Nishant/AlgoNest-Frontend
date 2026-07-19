import React from 'react'

import logo from "../assets/logo.png";

import { Link } from "react-router-dom";

import {
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Top Row */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo + Name */}

          <div className="flex items-center gap-3">

            <Link
        to="/"
        className="
          absolute
          flex
          items-center
          gap-2
          z-20
        "
      >
        <img
          src={logo}
          alt="AlgoNest"
          className="h-12"
        />

        <h1 className="text-3xl font-bold text-slate-900">
          Algo
          <span className="text-[#485E73]">
            Nest
          </span>
        </h1>
      </Link>

          </div>

          {/* Socials */}

          <div className="flex items-center gap-6">

            <a
              href="https://www.instagram.com/mr.nishantbhardwaj/"
              target='_blank'
              className="
                flex items-center gap-2
                text-slate-600
                hover:text-[#485E73]
                transition-colors
              "
            >
              <FaInstagram size={18} />
              <span className="hidden sm:block">
                Instagram
              </span>
            </a>

            <a
              href="https://x.com/__N1shant"
              target='_blank'
              className="
                flex items-center gap-2
                text-slate-600
                hover:text-[#485E73]
                transition-colors
              "
            >
              <FaXTwitter size={18} />
              <span className="hidden sm:block">
                Twitter
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/n1shantbhardwaj/"
              target='_blank'
              className="
                flex items-center gap-2
                text-slate-600
                hover:text-[#485E73]
                transition-colors
              "
            >
              <FaLinkedin size={18} />
              <span className="hidden sm:block">
                LinkedIn
              </span>
            </a>

            <a
              href="https://github.com/Bhardwaj-Nishant"
              target='_blank'
              className="
                flex items-center gap-2
                text-slate-600
                hover:text-[#485E73]
                transition-colors
              "
            >
              <FaGithub size={18} />
              <span className="hidden sm:block">
                GitHub
              </span>
            </a>

          </div>

        </div>

        {/* Bottom Row */}

        <div
          className="
            mt-0
            pt-5
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-3
          "
        >

          <p className="text-sm text-slate-500">
            © 2026 AlgoNest. All rights reserved.
          </p>

          <p className="text-sm text-slate-500">
            Built with ☕ and clean code.
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;