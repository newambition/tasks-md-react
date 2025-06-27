// src/components/SplashScreen.js
import React from "react";
import { motion } from "framer-motion";
import AnimatedCanvas from "./AnimatedCanvas";
import SplashTitle from "./SplashTitle";
import SplashTagline from "./SplashTagline";

const SplashScreen = () => {
  const splashContainerVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { duration: 1.2 } },
    exit: {
      opacity: 0,
      transition: {
        duration: 1.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      key="splash-screen-container"
      variants={splashContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="splash-screen fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      style={{
        backgroundColor: "var(--cartoon-bg-light)",
        fontFamily: "var(--cartoon-font)",
      }}
    >
      <AnimatedCanvas />
      <motion.div
        className="relative z-10 text-center select-none"
        initial="hidden"
        animate="visible"
      >
        <SplashTitle />
        <SplashTagline />
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
