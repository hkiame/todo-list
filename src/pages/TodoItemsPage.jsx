// src/pages/TodosPage.jsx
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, parseISO } from "date-fns";
import Modal from "react-modal";
import toast from "react-hot-toast";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "@/slices/todosSlice";
import {
  FaCheck,
  FaEdit,
  FaTrash,
  FaExpandAlt,
  FaCompressAlt,
  FaStar,
  FaPlus,
} from "react-icons/fa";
import { useTodoStats } from "@/hooks/useTodosStats";
import { v4 as uuidv4 } from "uuid";

// Bind modal to app element
Modal.setAppElement("#root");

export default function TodosPage() {
  const { selectedGroupId, groups } = useOutletContext();
  const { todos, totalTasks, completedTasks, status } = useTodoStats();
  const { ungroupedId } = useSelector((state) => state.groups);
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editHeading, setEditHeading] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editGroupId, setEditGroupId] = useState("");
  const [editIsStarred, setEditIsStarred] = useState(false); // New state for starred status
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newHeading, setNewHeading] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newGroupId, setNewGroupId] = useState(selectedGroupId || ungroupedId);

  const currentGroup =
    selectedGroupId === null
      ? "Todos"
      : groups.find((g) => g.id === selectedGroupId)?.name || "Unknown Group";

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
    }),
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -30, transition: { duration: 0.2 } },
  };

  const handleToggleComplete = (todo) => {
    const updatedTodo = {
      ...todo,
      isComplete: !todo.isComplete,
      completedDate: !todo.isComplete ? new Date().toISOString() : null,
    };
    dispatch(updateTodo(updatedTodo))
      .unwrap()
      .then(() =>
        toast.success(`Todo ${todo.isComplete ? "unmarked" : "completed"}`)
      )
      .catch((e) => {
        console.log("Todo update failed:", e);
        toast.error("Failed to update todo");
      });
    if (expandedId === todo.id) setExpandedId(null);
  };

  const handleToggleStar = (todo) => {
    dispatch(updateTodo({ ...todo, isStarred: !todo.isStarred }))
      .unwrap()
      .then(() =>
        toast.success(`Todo ${todo.isStarred ? "unstarred" : "starred"}`)
      )
      .catch(() => toast.error("Failed to star todo"));
  };

  const handleEdit = (todo) => {
    console.log("handleEdit:", todo);
    setEditId(todo.id);
    setEditHeading(todo.heading);
    setEditBody(todo.body);
    setEditGroupId(todo.groupId);
    setEditIsStarred(todo.isStarred); // Initialize with current starred status
  };

  const handleSaveEdit = (todo) => {
    const group = groups.find((g) => g.id === editGroupId);
    const updatedTodo = {
      ...todo,
      heading: editHeading,
      body: editBody,
      groupId: editGroupId,
      groupName: group ? group.name : "Ungrouped",
      isStarred: editIsStarred, // Include updated starred status
    };
    dispatch(updateTodo(updatedTodo))
      .unwrap()
      .then(() => toast.success("Todo updated"))
      .catch(() => toast.error("Failed to update todo"));
    setEditId(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo(id))
      .unwrap()
      .then(() => toast.success("Todo deleted"))
      .catch(() => toast.error("Failed to delete todo"));
    if (expandedId === id) setExpandedId(null);
  };

  const handleCreateTodo = () => {
    if (!newHeading.trim()) {
      toast.error("Title is required");
      return;
    }
    const newTodo = {
      id: uuidv4(),
      heading: newHeading,
      body: newBody,
      completedDate: null,
      isComplete: false,
      isStarred: false,
      groupId: newGroupId,
    };
    dispatch(createTodo(newTodo))
      .unwrap()
      .then(() => {
        toast.success("Todo created");
        setIsCreateModalOpen(false);
        setNewHeading("");
        setNewBody("");
        setNewGroupId(selectedGroupId || ungroupedId);
      })
      .catch(() => toast.error("Failed to create todo"));
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-emerald-600 tracking-tight">
          {currentGroup}
        </h1>
        <p className="mt-2 text-base text-gray-600 font-medium">
          {status === "loading"
            ? "Loading..."
            : `${completedTasks} / ${totalTasks} Done`}
        </p>
        <motion.div
          className="mt-3 h-0.5 w-16 bg-emerald-600 rounded-full mx-auto"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-emerald-200 text-emerald-800 hover:bg-emerald-700 hover:text-white transition px-5 py-2 rounded-lg flex items-center text-base font-medium shadow-sm"
          >
            <FaPlus className="mr-2" /> New Todo
          </motion.button>
        </div>

        {status === "loading" ? (
          <div className="text-center text-gray-600 font-medium">
            Fetching todos...
          </div>
        ) : status === "failed" ? (
          <div className="text-center text-red-600 font-medium">
            Failed to load todos.
          </div>
        ) : todos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 py-16"
          >
            <p className="text-lg font-medium">No todos yet.</p>
            <p className="mt-1 text-sm">Add some to get started.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {todos.map((todo, index) => (
              <motion.div
                key={todo.id}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{
                  backgroundColor: todo.isComplete ? "#F3F4F6" : "#F3F4F6",
                }}
                className="bg-white py-5 px-6 flex items-center justify-between border-2 border-dotted border-emerald-600 rounded-md relative"
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`h-5 w-5 flex items-center justify-center rounded-full border-2 ${
                      todo.isComplete
                        ? "bg-emerald-600 border-emerald-600"
                        : "bg-white border-gray-600"
                    } cursor-pointer`}
                    onClick={() => handleToggleComplete(todo)}
                  >
                    {todo.isComplete && (
                      <FaCheck size={12} className="text-white" />
                    )}
                  </motion.div>
                  <h3
                    className={`text-lg font-medium ${
                      todo.isComplete ? "text-emerald-300" : "text-gray-900"
                    }`}
                  >
                    {todo.heading}
                  </h3>
                  <button
                    onClick={() => handleToggleStar(todo)}
                    className={`${
                      todo.isStarred ? "text-yellow-500" : "text-gray-400"
                    } hover:text-yellow-600 transition`}
                  >
                    <FaStar size={16} />
                  </button>
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === todo.id ? null : todo.id)
                  }
                  className="text-emerald-600 hover:text-emerald-700 transition z-10"
                >
                  {expandedId === todo.id ? (
                    <FaCompressAlt size={16} />
                  ) : (
                    <FaExpandAlt size={16} />
                  )}
                </button>
                {todo.isComplete && (
                  <div className="absolute inset-0 bg-emerald-600 opacity-15 rounded-md pointer-events-none" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create Todo Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 50 },
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "36rem",
            height: "36rem",
            padding: 0,
            border: "none",
            borderRadius: "0.75rem",
            overflow: "hidden",
            background: "#FFFFFF",
            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col min-h-0"
        >
          <div className="bg-emerald-50 px-6 py-5 relative flex-shrink-0">
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-white rounded-t-[50%]"></div>
            <h3 className="text-xl font-semibold text-emerald-600">
              Create Todo
            </h3>
          </div>
          <div className="px-6 py-6 overflow-y-auto custom-scrollbar flex-1 min-h-0 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                value={newHeading}
                onChange={(e) => setNewHeading(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                placeholder="Enter todo title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details
              </label>
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-40 text-base"
                placeholder="Add details..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group
              </label>
              <select
                value={newGroupId}
                onChange={(e) => setNewGroupId(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="px-6 py-5 border-t border-gray-200 flex-shrink-0 flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleCreateTodo}
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center text-base font-medium"
            >
              <FaCheck className="mr-2" /> Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="px-5 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 transition border border-gray-200 text-base font-medium"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </Modal>

      {/* Edit/Details Modal with Star Update */}
      <Modal
        isOpen={!!expandedId}
        onRequestClose={() => setExpandedId(null)}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 50 },
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "32rem",
            minHeight: "16rem",
            height: "70%",
            padding: 0,
            border: "none",
            borderRadius: "0.75rem",
            overflow: "hidden",
            background: "#FFFFFF",
            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
            display: "grid",
            gridTemplateRows: "1fr auto",
          },
        }}
      >
        <AnimatePresence>
          {expandedId &&
            todos
              .filter((todo) => todo.id === expandedId)
              .map((todo) => (
                <motion.div
                  key={todo.id}
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col min-h-0"
                >
                  <div className="bg-emerald-50 px-6 py-5 relative flex-shrink-0">
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-white rounded-t-[50%]"></div>
                    <h3
                      className={`text-xl font-semibold ${
                        todo.isComplete ? "text-emerald-300" : "text-gray-900"
                      }`}
                    >
                      {todo.heading}
                    </h3>
                  </div>
                  <div className="px-6 py-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                    {editId === todo.id ? (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            value={editHeading}
                            onChange={(e) => setEditHeading(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Details
                          </label>
                          <textarea
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-40 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Group
                          </label>
                          <select
                            value={editGroupId}
                            onChange={(e) => setEditGroupId(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                          >
                            {groups.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-items">
                          <button
                            onClick={() => handleToggleStar(todo)}
                            className={`${
                              todo.isStarred
                                ? "text-yellow-500"
                                : "text-gray-400"
                            } hover:text-yellow-600 transition mr-2`}
                          >
                            <FaStar size={14} />
                          </button>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {todo.isStarred ? "Starred" : "Not Starred"}
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-base text-gray-900 whitespace-pre-wrap font-medium">
                          {todo.body || "No details provided."}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-emerald-50 px-6 py-4 flex-shrink-0 border-t border-emerald-100">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-4 text-sm text-emerald-800">
                        <span className="flex items-center">
                          <FaCheck
                            className="mr-2 text-emerald-600"
                            size={12}
                          />
                          Created:{" "}
                          {todo.createdDate
                            ? formatDistanceToNow(parseISO(todo.createdDate), {
                                addSuffix: true,
                              })
                            : "unknown"}
                        </span>
                        {todo.completedDate && (
                          <span className="flex items-center">
                            <FaCheck
                              className="mr-2 text-emerald-600"
                              size={12}
                            />
                            Completed:{" "}
                            {formatDistanceToNow(parseISO(todo.completedDate), {
                              addSuffix: true,
                            })}
                          </span>
                        )}
                        <span className="flex items-center">
                          <span className="mr-2 text-emerald-600 font-medium">
                            Group:
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
                            {todo.groupName}
                          </span>
                        </span>
                        <span className="flex items-center">
                          <FaStar className="mr-2 text-yellow-500" size={12} />
                          {todo.isStarred ? "Starred" : "Not Starred"}
                        </span>
                      </div>
                      <div className="h-px bg-emerald-200" />
                      <div className="flex justify-end space-x-3">
                        {editId === todo.id ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSaveEdit(todo)}
                              className="px-5 py-2 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center text-sm font-semibold shadow-md"
                            >
                              <FaCheck className="mr-2" /> Save
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setEditId(null)}
                              className="px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center text-sm font-semibold shadow-md"
                            >
                              Cancel
                            </motion.button>
                          </>
                        ) : (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleToggleComplete(todo)}
                              className="px-5 py-2 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center text-sm font-semibold shadow-md"
                            >
                              <FaCheck className="mr-2" />{" "}
                              {todo.isComplete ? "Unmark" : "Complete"}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(todo)}
                              className="px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center text-sm font-semibold shadow-md"
                            >
                              <FaEdit className="mr-2" /> Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(todo.id)}
                              className="px-5 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center text-sm font-semibold shadow-md"
                            >
                              <FaTrash className="mr-2" /> Delete
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
        </AnimatePresence>
      </Modal>

      {/* Custom Scrollbar CSS */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #ffffff;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #059669; // emerald-600
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #047857; // emerald-700
        }
      `}</style>
    </div>
  );
}
