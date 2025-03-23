import { useState } from "react";
import { NavLink } from "react-router";

export default function Navbar({
  isSidebarOpen,
  setIsSidebarOpen,
  isNavAnimating,
  setIsNavAnimating,
  isNavOpen,
  setIsNavOpen,
}) {
  const toggleNav = () => {
    if (isNavOpen) {
      setIsNavAnimating(true);
    } else {
      setIsNavOpen(true);
      setIsNavAnimating(false);
    }
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  const handleAnimationEnd = (e) => {
    if (e.animationName === "slide-up") {
      setIsNavOpen(false);
      setIsNavAnimating(false);
    }
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/todos", label: "All Todos" },
    { path: "/completed", label: "Completed Todos" },
    { path: "/edit", label: "Edit Todo" },
  ];

  return (
    <>
      <nav className="bg-white text-slate-800 p-4 flex justify-between items-center shadow-md border-b border-emerald-200 sticky top-0 z-50">
        <NavLink to="/">
          <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
            To-Do Elite
          </h1>
        </NavLink>
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
                  isActive
                    ? "text-emerald-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-emerald-600"
                    : "text-slate-800 hover:text-emerald-600"
                }`
              }
            >
              {item.label}
              <span className="absolute inset-0 -z-10 h-full w-full bg-emerald-200 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-md" />
            </NavLink>
          ))}
        </div>
        <div className="flex gap-4 md:hidden items-center">
          <button
            onClick={toggleNav}
            className="text-emerald-600 hover:text-emerald-700 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile Navbar Slide */}
      {(isNavOpen || isNavAnimating) && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-gray-800 opacity-40 animate-fade-in"
            onClick={toggleNav}
          />
          <div
            className={`absolute top-0 w-full bg-white text-slate-800 p-6 shadow-xl border-b-4 border-emerald-600 ${
              isNavOpen && !isNavAnimating
                ? "animate-slide-down"
                : "animate-slide-up"
            }`}
            onAnimationEnd={handleAnimationEnd}
          >
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block py-4 px-6 text-sm font-medium uppercase tracking-wide transition-all duration-300 delay-${
                    index * 50
                  } transform translate-y-0 hover:translate-x-4 ${
                    isActive
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-slate-800 hover:text-emerald-600 hover:bg-emerald-50"
                  }`
                }
                onClick={toggleNav}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
