import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fetchTodos } from "@/slices/todosSlice";
import { FaClock, FaStar } from "react-icons/fa";

export default function PendingItemsPage() {
  const dispatch = useDispatch();
  const { items: todos, status } = useSelector((state) => state.todos);
  const { items: groups } = useSelector((state) => state.groups);
  const pendingTodos = todos.filter((todo) => !todo.isComplete);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [dispatch, status]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto mb-10 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Pending Todos
        </h1>
        <p className="mt-2 text-base text-gray-600 font-medium">
          {status === "loading"
            ? "Loading..."
            : `${pendingTodos.length} Task${
                pendingTodos.length === 1 ? "" : "s"
              } Remaining`}
        </p>
        <motion.div
          className="mt-3 h-0.5 w-16 bg-gray-400 rounded-full mx-auto"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto">
        {status === "loading" ? (
          <div className="text-center text-gray-600 font-medium">
            Fetching pending todos...
          </div>
        ) : status === "failed" ? (
          <div className="text-center text-red-600 font-medium">
            Failed to load todos.
          </div>
        ) : pendingTodos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 py-16"
          >
            <p className="text-lg font-medium">No pending todos!</p>
            <p className="mt-1 text-sm">
              You’ve completed everything—great job!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {pendingTodos.map((todo) => {
              const group = groups.find((g) => g.id === todo.groupId);
              return (
                <motion.div
                  key={todo.id}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden"
                >
                  <div className="flex items-start space-x-4">
                    <FaClock
                      className="text-gray-500 flex-shrink-0"
                      size={24}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {todo.heading}
                        </h3>
                        <FaStar
                          className={
                            todo.isStarred ? "text-yellow-500" : "text-gray-400"
                          }
                          size={18}
                        />
                      </div>
                      <div className="mt-2 max-h-32 overflow-y-auto custom-scrollbar">
                        <p className="text-base text-gray-600 whitespace-pre-wrap">
                          {todo.body || "No details provided."}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-700">
                        <span>
                          Created:{" "}
                          {todo.createdDate
                            ? formatDistanceToNow(parseISO(todo.createdDate), {
                                addSuffix: true,
                              })
                            : "unknown"}
                        </span>
                        <span>
                          Group:{" "}
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                            {group?.name || todo.groupName || "Ungrouped"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Subtle gray overlay */}
                  <div className="absolute inset-0 bg-gray-400 opacity-5 pointer-events-none" />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>

      {/* Custom Scrollbar CSS */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280; // gray-500
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563; // gray-600
        }
      `}</style>
    </div>
  );
}
