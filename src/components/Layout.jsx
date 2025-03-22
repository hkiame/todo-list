import { useState } from "react";
import { NavLink, Outlet } from "react-router";

function Layout() {
  const [isOpen, setIsOpen] = useState(false); // For mobile sidebar toggle

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/todos", label: "All Todos" },
    { path: "/completed", label: "Completed Todos" },
    { path: "/edit", label: "Edit Todo" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-green-600 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold">To-Do App</h2>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block py-2 px-4 text-white hover:bg-green-700 transition ${
                  isActive ? "bg-green-700" : ""
                }`
              }
              onClick={() => setIsOpen(false)} // Close sidebar on mobile click
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-4 bg-green-600 text-white fixed top-0 left-0 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Content Area */}
        <div className="flex-1 p-6 mt-12 md:mt-0">
          <Outlet /> {/* Renders the active page */}
        </div>
      </div>
    </div>
  );
}

export default Layout;
