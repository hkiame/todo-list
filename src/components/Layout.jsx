import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import { v4 as uuidv4 } from "uuid";

function Layout() {
  const [isOpen, setIsOpen] = useState(false);
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

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/todos", label: "All Todos" },
    { path: "/completed", label: "Completed Todos" },
    { path: "/edit", label: "Edit Todo" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">To-Do App</h1>
        <div className="hidden md:flex gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md hover:bg-green-700 transition ${
                  isActive ? "bg-green-700" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-green-600 text-white p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block py-2 px-4 hover:bg-green-700 transition ${
                  isActive ? "bg-green-700" : ""
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white shadow-md p-4 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed inset-y-0 left-0 md:static transition-transform duration-300 ease-in-out z-40`}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Task Groups
          </h2>
          <ul className="space-y-2">
            <li
              onClick={() => setSelectedGroupId(null)}
              className={`p-2 rounded-md hover:bg-green-100 transition cursor-pointer ${
                !selectedGroupId ? "bg-green-100" : "bg-green-50"
              }`}
            >
              All Groups
            </li>
            {groups.map((group) => (
              <li
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className={`p-2 rounded-md hover:bg-green-100 transition cursor-pointer ${
                  selectedGroupId === group.id ? "bg-green-100" : "bg-green-50"
                }`}
              >
                {group.name}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <input
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              placeholder="New group"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={addGroup}
              disabled={!newGroup.trim()}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              Add
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <Outlet context={{ selectedGroupId, groups }} />
        </main>
      </div>
    </div>
  );
}

export default Layout;
