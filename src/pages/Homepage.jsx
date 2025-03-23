import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ProgressSection from "@/components/ProgressSection";
import MilestoneSection from "@/components/MilestoneSection";

function Home() {
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
      <ProgressSection />
      <MilestoneSection />
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
