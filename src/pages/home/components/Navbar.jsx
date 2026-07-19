import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="
        sticky
        top-0
        z-50
        bg-white/80
        backdrop-blur-md
        border-b
        border-slate-200
      "
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="h-17 flex items-center">


        <Link
            to="/"
            className="
              absolute
              left-10
              flex
              items-center
              gap-3
            "
          >
            <img
              src={logo}
              alt="AlgoNest"
              className="h-12"
            />

            <h1 className="text-3xl font-bold text-slate-900">
              Algo
              <span className="text-[#485E73]">Nest</span>
            </h1>
          </Link>

          {/* Desktop Nav */}

          <nav
            className="
              hidden
              md:flex
              items-center
              gap-10

              absolute
              left-1/2
              -translate-x-1/2
            "
          >
            <a
              href="#features"
              className="
                text-slate-600
                hover:text-[#485e73]
                transition
              "
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="
                text-slate-600
                hover:text-[#485e73]
                transition
              "
            >
              How It Works
            </a>

            <a
              href="#cta"
              className="
                text-slate-600
                hover:text-[#485e73]
                transition
              "
            >
              FAQs
            </a>
          </nav>

          {/* Desktop Buttons */}

          <div
            className="
              hidden
              md:flex
              items-center
              gap-4

              absolute
              right-10
            "
          >
            <Link
              to="/login"
              className="
                text-slate-700
                hover:text-[#485e73]
              "
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="
                px-5
                py-2.5
                rounded-xl
                bg-[#485e73]
                text-white
                font-medium
                hover:opacity-90
                transition
              "
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Button */}

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}

        {isOpen && (
          <div
            className="
              md:hidden
              py-6
              flex
              flex-col
              gap-5
            "
          >
            <a href="#features">Features</a>

            <a href="#cta">FAQs</a>

            <a href="#how-it-works">
              How It Works
            </a>

            <Link to="/login">
              Login
            </Link>

            <Link
              to="/signup"
              className="
                bg-[#485e73]
                text-white
                px-5
                py-3
                rounded-xl
                text-center
              "
            >
              Sign Up
            </Link>
          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;