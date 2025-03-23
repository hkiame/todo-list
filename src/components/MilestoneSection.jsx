import { motion } from "framer-motion";
import { useTodoStats } from "@/hooks/useTodosStats";

export default function MilestoneSection() {
  const { totalTasks, completedTasks } = useTodoStats();

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section variants={itemVariants} className="mb-12">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
        Milestones
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          className="bg-emerald-50 rounded-xl p-6"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-slate-800">
            {completedTasks > 0 ? "First Victory" : "Getting Started"}
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            {completedTasks > 0
              ? `You've completed ${completedTasks} task${
                  completedTasks === 1 ? "" : "s"
                }!`
              : "Complete your first task to begin your journey."}
          </p>
        </motion.div>
        <motion.div
          className="bg-emerald-50 rounded-xl p-6"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-slate-800">Next Goal</h3>
          <p className="text-sm text-slate-600 mt-2">
            {totalTasks === 0
              ? "Add your first task to get going!"
              : `Only ${totalTasks - completedTasks} task${
                  totalTasks - completedTasks === 1 ? "" : "s"
                } to 100%!`}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
