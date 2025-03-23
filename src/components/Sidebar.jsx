import { Outlet, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { api } from "@/axiosClient";

export default function Sidebar({
  isNavOpen,
  setIsNavAnimating,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [todos, setTodos] = useState([]);

  const location = useLocation();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsData, todosData] = await Promise.all([
          api.getGroups(),
          api.getTodos(),
        ]);
        setGroups(groupsData);
        setTodos(todosData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchData();
  }, []);

  const addGroup = async () => {
    if (!newGroup.trim()) return;

    const newGroupData = { id: uuidv4(), name: newGroup };
    try {
      const createdGroup = await api.createGroup(newGroupData);
      setGroups([...groups, createdGroup]);
      setNewGroup("");
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isNavOpen) {
      setIsNavAnimating(true);
    }
  };

  return (
    <div className="flex flex-1 relative">
      {/* Desktop Sidebar - Hidden on Home */}
      {!isHomePage && (
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
      )}

      {/* Mobile Sidebar Gem Trigger - Hidden on Home */}
      {!isHomePage && (
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
      )}

      {/* Mobile Sidebar Radial Menu - Hidden on Home */}
      {!isHomePage && isSidebarOpen && (
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
        <Outlet context={{ selectedGroupId, groups, todos }} />
      </main>
    </div>
  );
}
