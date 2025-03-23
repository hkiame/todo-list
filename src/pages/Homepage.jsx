// Home.jsx
import { useOutletContext } from "react-router";
import { VictoryPie, VictoryAnimation } from "victory";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";

function Home() {
  const { todos } = useOutletContext();

  // Calculate completion stats
  const totalTasks = todos.length;
  const completedTasks = todos.filter((todo) => todo.isComplete).length;
  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <HeroSection />
      {/* Refined Progress Section */}
      <motion.section
        variants={itemVariants}
        className="relative bg-gradient-to-b from-emerald-50 to-white rounded-xl shadow-lg p-8 mb-12 overflow-hidden"
      >
        {/* Creative Background Element */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0 Q 200 100, 400 0 T 800 0 Q 600 100, 400 200 T 0 400 Q 200 300, 400 400 T 800 400"
              stroke="#059669"
              strokeWidth="2"
              strokeDasharray="10 10"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-slate-800 mb-8 text-center relative z-10">
          Your Path to Mastery
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 relative z-10">
          {/* Donut Chart */}
          <div className="relative w-64 h-64">
            <VictoryAnimation
              duration={1500}
              data={{ percent: completionPercentage }}
            >
              {({ percent }) => (
                <VictoryPie
                  data={[
                    { x: `${percent}%`, y: percent },
                    {
                      x: `${100 - percent}%`,
                      y: 100 - percent,
                    },
                  ]}
                  innerRadius={90}
                  cornerRadius={6}
                  colorScale={["#059669", "#d4d4d4"]} // Emerald-600 for done, Slate-600 for to do
                  padding={0}
                  labelIndicator
                  padAngle={1}
                  labels // Labels well outside
                  animate={{ duration: 1500 }}
                  style={{
                    labels: { fontSize: 20, fill: "#333", fontWeight: "bold" }, // Set font size & color
                  }}
                />
              )}
            </VictoryAnimation>
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 1,
              }}
            >
              <span className="text-5xl font-bold text-emerald-600">
                {Math.round(completionPercentage)}%
              </span>
              <span className="text-sm text-slate-600 mt-1">Progress</span>
            </motion.div>
            {/* Creative Sparkles */}
            <motion.div
              className="absolute top-2 left-2 w-2 h-2 bg-emerald-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
            <motion.div
              className="absolute bottom-2 right-2 w-2 h-2 bg-slate-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.7 }}
            />
          </div>

          {/* Creative Stats Display with Matching Colors */}
          <div className="flex flex-col gap-6 w-full md:w-auto">
            <motion.div
              className="relative bg-white rounded-lg p-4 shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-emerald-600">
                      {completedTasks}
                    </span>
                    <p className="text-sm text-slate-600">Tasks Mastered</p>
                  </div>
                </div>
                <motion.div
                  className="w-16 h-2 bg-emerald-600 rounded-full opacity-20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                />
              </div>
            </motion.div>
            <motion.div
              className="relative bg-white rounded-lg p-4 shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-600" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-neutral-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6h4m-4-6a9 9 0 11-9 9 9 9 0 019-9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-neutral-500">
                      {totalTasks - completedTasks}
                    </span>
                    <p className="text-sm text-slate-600">Tasks to Conquer</p>
                  </div>
                </div>
                <motion.div
                  className="w-16 h-2 bg-slate-600 rounded-full opacity-20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                />
              </div>
            </motion.div>
            <motion.div
              className="text-center relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              <p className="text-sm text-emerald-600 font-medium italic">
                {completionPercentage === 100
                  ? "A Perfect Mastery!"
                  : `You're ${Math.round(completionPercentage)}% on your way`}
              </p>
              {/* Creative Divider */}
              <motion.div
                className="mt-2 h-px bg-gradient-to-r from-emerald-600 via-slate-600 to-emerald-600"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.8, duration: 0.8 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Milestones */}
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

      {/* Quote */}
      <motion.section
        variants={itemVariants}
        className="bg-emerald-50 rounded-xl p-8 text-center"
      >
        <blockquote className="text-xl md:text-2xl text-slate-800 italic">
          "The secret of getting ahead is getting started."
        </blockquote>
        <p className="text-sm text-slate-600 mt-2">- Mark Twain</p>
      </motion.section>
    </motion.div>
  );
}

export default Home;
