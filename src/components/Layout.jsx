import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import { v4 as uuidv4 } from "uuid";

function Layout() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavAnimating, setIsNavAnimating] = useState(false);
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/groups")
      .then((res) => res.json())
      .then((data) => setGroups(data));
  }, []);

  const addGroup = () => {
    if (newGroup.trim()) {
      const newGroupData = { id: uuidv4(), name: newGroup };
      fetch("http://localhost:3001/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGroupData),
      })
        .then((res) => res.json())
        .then((group) => {
          setGroups([...groups, group]);
          setNewGroup("");
        });
    }
  };

  const toggleNav = () => {
    if (isNavOpen) {
      setIsNavAnimating(true);
    } else {
      setIsNavOpen(true);
      setIsNavAnimating(false);
    }
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isNavOpen) {
      setIsNavAnimating(true);
    }
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
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white text-slate-800 p-4 flex justify-between items-center shadow-md border-b border-emerald-200 sticky top-0 z-50">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
          To-Do Elite
        </h1>
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

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 bg-white shadow-lg p-6 border-r border-gray-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 tracking-tight">
            Task Groups
          </h2>
          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-gray-100">
            <ul className="space-y-3">
              <li
                onClick={() => setSelectedGroupId(null)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  !selectedGroupId
                    ? "bg-emerald-200 text-emerald-800 font-medium shadow-sm"
                    : "text-slate-800 hover:bg-emerald-50"
                }`}
              >
                All Groups
              </li>
              {groups.map((group) => (
                <li
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedGroupId === group.id
                      ? "bg-emerald-200 text-emerald-800 font-medium shadow-sm"
                      : "text-slate-800 hover:bg-emerald-50"
                  }`}
                >
                  {group.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <div className="relative flex items-center">
              <input
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                placeholder="New Group"
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-800 placeholder-gray-400 transition-all"
              />
              <button
                onClick={addGroup}
                disabled={!newGroup.trim()}
                className="absolute right-1 p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Gem Trigger */}
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed bottom-4 right-4 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-all duration-300 z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white animate-gem-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 4h4"
            />
          </svg>
          <span className="absolute w-16 h-16 bg-emerald-200 opacity-30 rounded-full animate-pulse" />
        </button>

        {/* Mobile Sidebar Radial Menu */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-gray-800 opacity-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="absolute bottom-20 right-4 bg-white text-slate-800 p-6 rounded-2xl shadow-xl transform transition-all duration-500 ease-out animate-radial-unfurl max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-gray-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 tracking-tight sticky top-0 bg-white z-10">
                Task Groups
              </h2>
              <ul className="space-y-2">
                <li
                  onClick={() => {
                    setSelectedGroupId(null);
                    setIsSidebarOpen(false);
                  }}
                  className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    !selectedGroupId
                      ? "bg-emerald-200 text-emerald-800 font-medium"
                      : "text-slate-800 hover:bg-emerald-50"
                  }`}
                >
                  All Groups
                </li>
                {groups.map((group) => (
                  <li
                    key={group.id}
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedGroupId === group.id
                        ? "bg-emerald-200 text-emerald-800 font-medium"
                        : "text-slate-800 hover:bg-emerald-50"
                    }`}
                  >
                    {group.name}
                  </li>
                ))}
              </ul>
              <div className="mt-4 sticky bottom-0 bg-white z-10">
                <div className="relative flex items-center">
                  <input
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    placeholder="New Group"
                    className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-800 placeholder-gray-400 transition-all"
                  />
                  <button
                    onClick={addGroup}
                    disabled={!newGroup.trim()}
                    className="absolute right-1 p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-8 bg-gray-100">
          <Outlet context={{ selectedGroupId, groups }} />
        </main>
      </div>
    </div>
  );
}

export default Layout;
