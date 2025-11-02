import { useInView } from "framer-motion";
import React, { useRef } from "react";
import { motion } from "framer-motion";

const Title = ({ title, subText }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };
  return (
    <motion.div
      ref={ref}
      variants={headerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="flex flex-col items-center"
    >
      <h2 className="font-mont text-center text-3xl font-bold sm:text-4xl md:text-[42px]">
        {title}
      </h2>
      <h3 className="font-mont mt-3 text-center text-xl font-medium whitespace-pre-line sm:text-xl md:text-[16px]">
        {subText ? subText : ""}
      </h3>
    </motion.div>
  );
};

export default Title;
