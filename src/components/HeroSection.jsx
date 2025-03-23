import { motion } from "framer-motion";

export default function HeroSection() {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section variants={itemVariants} className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
        Welcome to{" "}
        <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
          To-Do Elite
        </span>
      </h1>
      <p className="text-lg text-slate-600 max-w-xl mx-auto">
        Elevate your productivity with elegance and precision. To-Do Elite turns
        tasks into triumphs, empowering you to master your goals with
        confidence.
      </p>
    </motion.section>
  );
}
