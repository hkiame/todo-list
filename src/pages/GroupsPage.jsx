import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import { updateGroup, deleteGroup } from "../slices/groupsSlice";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default function GroupsPage() {
  const dispatch = useDispatch();
  const {
    items: groups,
    ungroupedId,
    status,
  } = useSelector((state) => state.groups);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

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

  const handleEdit = (group) => {
    setEditId(group.id);
    setEditName(group.name);
  };

  const handleSaveEdit = async () => {
    try {
      await dispatch(updateGroup({ id: editId, name: editName })).unwrap();
      setEditId(null);
      setEditName("");
    } catch (error) {
      console.error("Failed to update group:", error);
    }
  };

  const handleDelete = async (id) => {
    if (id === ungroupedId) {
      alert("Cannot delete the Ungrouped category.");
      return;
    }
    try {
      await dispatch(deleteGroup(id)).unwrap();
    } catch (error) {
      console.error("Failed to delete group:", error);
      // Optionally show an error message
    }
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
          Manage Groups
        </h1>
        <p className="mt-2 text-base text-[#6B7280] font-medium">
          {status === "loading" ? "Loading..." : `${groups.length} Groups`}
        </p>
        <motion.div
          className="mt-3 h-0.5 w-16 bg-[#15803D] rounded-full mx-auto"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.header>

      {/* Groups List */}
      <main className="max-w-2xl mx-auto">
        {status === "loading" ? (
          <div className="text-center text-[#6B7280] font-medium">
            Fetching groups...
          </div>
        ) : status === "failed" ? (
          <div className="text-center text-red-600 font-medium">
            Failed to load groups.
          </div>
        ) : groups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#6B7280] py-16"
          >
            <p className="text-lg font-medium">No groups yet.</p>
            <p className="mt-1 text-sm">Add some to get started.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ backgroundColor: "#F3F4F6" }}
                className="bg-white py-5 px-6 flex items-center justify-between border-2 border-dotted border-[#15803D] rounded-md"
              >
                <h3 className="text-lg font-medium text-[#000000]">
                  {group.name}
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(group)}
                    className="text-[#15803D] hover:text-[#126D34] transition"
                    disabled={group.id === ungroupedId}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="text-red-600 hover:text-red-700 transition"
                    disabled={group.id === ungroupedId}
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editId}
        onRequestClose={() => setEditId(null)}
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
            maxWidth: "28rem",
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
        contentLabel="Edit Group Modal"
      >
        <AnimatePresence>
          {editId && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col min-h-0"
            >
              {/* Fixed Header */}
              <div className="bg-[#F3F4F6] p-5 relative flex-shrink-0">
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-[50%]"></div>
                <h3 className="text-lg font-semibold text-[#000000]">
                  Edit Group
                </h3>
              </div>
              {/* Scrollable Body */}
              <div className="px-5 py-3 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border border-[#E5E7EB] rounded text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                  placeholder="Group name"
                />
              </div>
              {/* Fixed Footer */}
              <div className="px-5 py-4 border-t border-[#E5E7EB] flex-shrink-0">
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleSaveEdit}
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
              </div>
            </motion.div>
          )}
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
