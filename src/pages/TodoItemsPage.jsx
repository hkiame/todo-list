import { useState } from "react";
import { useOutletContext } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, parseISO } from "date-fns";
import Modal from "react-modal";
import { useTodoStats } from "@/hooks/useTodosStats";
import { updateTodo, deleteTodo } from "@/slices/todosSlice";
import {
  FaCheck,
  FaEdit,
  FaTrash,
  FaExpandAlt,
  FaCompressAlt,
} from "react-icons/fa";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default function TodosPage() {
  const { selectedGroupId, groups } = useOutletContext();
  const { todos, totalTasks, completedTasks, status } = useTodoStats();
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editHeading, setEditHeading] = useState("");
  const [editBody, setEditBody] = useState("");

  const currentGroup =
    selectedGroupId === null
      ? "Todos"
      : groups.find((g) => g.id === selectedGroupId)?.name || "Unknown Group";

  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
    }),
  };

  // Modal animation variants
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
    dispatch(updateTodo({ ...todo, isComplete: !todo.isComplete }));
    if (expandedId === todo.id) setExpandedId(null);
  };

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditHeading(todo.heading);
    setEditBody(todo.body);
  };

  const handleSaveEdit = (todo) => {
    dispatch(updateTodo({ ...todo, heading: editHeading, body: editBody }));
    setEditId(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto mb-12 text-center"
      >
        <h1 className="text-3xl font-bold text-[#15803D] tracking-tight">
          {currentGroup}
        </h1>
        <p className="mt-2 text-base text-[#6B7280] font-medium">
          {status === "loading"
            ? "Loading..."
            : `${completedTasks} / ${totalTasks} Done`}
        </p>
        <motion.div
          className="mt-3 h-0.5 w-16 bg-[#15803D] rounded-full mx-auto"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.header>

      {/* Todos Vertical List */}
      <main className="max-w-2xl mx-auto">
        {status === "loading" ? (
          <div className="text-center text-[#6B7280] font-medium">
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
            className="text-center text-[#6B7280] py-16"
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
                className="bg-white py-5 px-6 flex items-center justify-between border-2 border-dotted border-[#15803D] rounded-md relative"
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`h-5 w-5 flex items-center justify-center rounded-full border-2 ${
                      todo.isComplete
                        ? "bg-[#15803D] border-[#15803D]"
                        : "bg-white border-[#6B7280]"
                    } cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(todo);
                    }}
                  >
                    {todo.isComplete && (
                      <FaCheck size={12} className="text-white" />
                    )}
                  </motion.div>
                  <h3
                    className={`text-lg font-medium ${
                      todo.isComplete ? "text-[#6EE7B7]" : "text-[#000000]"
                    }`}
                  >
                    {todo.heading}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(expandedId === todo.id ? null : todo.id);
                  }}
                  className="text-[#15803D] hover:text-[#126D34] transition z-10"
                >
                  {expandedId === todo.id ? (
                    <FaCompressAlt size={16} />
                  ) : (
                    <FaExpandAlt size={16} />
                  )}
                </button>
                {/* Very Light Emerald Overlay for Completed Todos */}
                {todo.isComplete && (
                  <div className="absolute inset-0 bg-[#15803D] opacity-15 rounded-md pointer-events-none" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modal with react-modal, Scrollable Body, and Visible Footer */}
      <Modal
        isOpen={!!expandedId}
        onRequestClose={() => setExpandedId(null)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "28rem", // 448px
            maxHeight: "85vh",
            padding: 0,
            border: "none",
            borderRadius: "0.5rem",
            overflow: "hidden",
            background: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
          },
        }}
        contentLabel="Todo Details Modal"
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
                  {/* Fixed Header */}
                  <div className="bg-[#F3F4F6] p-5 relative flex-shrink-0">
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-[50%]"></div>
                    <h3
                      className={`text-lg font-semibold ${
                        todo.isComplete ? "text-[#6EE7B7]" : "text-[#000000]"
                      }`}
                    >
                      {todo.heading}
                    </h3>
                  </div>
                  {/* Scrollable Body */}
                  <div className="px-5 py-3 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                    {editId === todo.id ? (
                      <div className="space-y-4">
                        <input
                          value={editHeading}
                          onChange={(e) => setEditHeading(e.target.value)}
                          className="w-full p-2 border border-[#E5E7EB] rounded text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                        <textarea
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          className="w-full p-2 border border-[#E5E7EB] rounded text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#15803D] h-32"
                          placeholder="Todo details..."
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-[#000000] whitespace-pre-wrap font-medium">
                        {todo.body || "No details provided."}
                      </p>
                    )}
                  </div>
                  {/* Fixed Footer */}
                  <div className="px-5 py-4 border-t border-[#E5E7EB] flex-shrink-0">
                    {editId === todo.id ? (
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleSaveEdit(todo)}
                          className="px-4 py-1 bg-[#15803D] text-white rounded hover:bg-[#126D34] transition flex items-center text-sm"
                        >
                          <FaCheck className="mr-1" /> Save
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setEditId(null)}
                          className="px-4 py-1 bg-white text-[#6B7280] rounded hover:bg-[#F3F4F6] transition border border-[#E5E7EB] text-sm"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-xs text-[#6B7280] mb-3">
                          <span>
                            {formatDistanceToNow(parseISO(todo.createdDate), {
                              addSuffix: true,
                            })}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#F3F4F6] text-[#6B7280]">
                            {groups.find((g) => g.id === todo.group)?.name ||
                              "Ungrouped"}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleToggleComplete(todo)}
                            className="px-4 py-1 bg-[#15803D] text-white rounded hover:bg-[#126D34] transition flex items-center text-sm"
                          >
                            <FaCheck className="mr-1" />{" "}
                            {todo.isComplete ? "Unmark" : "Complete"}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleEdit(todo)}
                            className="px-4 py-1 bg-white text-[#6B7280] rounded hover:bg-[#F3F4F6] transition border border-[#E5E7EB] flex items-center text-sm"
                          >
                            <FaEdit className="mr-1" /> Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleDelete(todo.id)}
                            className="px-4 py-1 bg-white text-red-600 rounded hover:bg-red-50 transition border border-red-200 flex items-center text-sm"
                          >
                            <FaTrash className="mr-1" /> Delete
                          </motion.button>
                        </div>
                      </>
                    )}
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
          background: #15803d;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #126d34;
        }
      `}</style>
    </div>
  );
}
