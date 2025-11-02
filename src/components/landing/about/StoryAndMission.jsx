import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

const StoryAndMission = ({ title, info }) => {
  return (
    <div className="font-mont flex h-auto flex-col px-14 py-12">
      <div className="title font-mont flex text-center text-[36px] font-bold md:hidden">
        {title}
      </div>
      <div className="body flex flex-col-reverse items-start justify-center gap-10 md:flex-row">
        <div className="flex w-fit flex-col gap-3 md:max-w-[40%]">
          <p className="hidden items-center justify-center text-center text-[50px] font-bold md:flex">
            <AnimatedTitle title={title} />
          </p>
          <div className="font-mont px-4 text-center text-[21px] leading-[180%] whitespace-pre-line">
            {info.desc}
          </div>
        </div>
        <div className="img mt-[82px]">
          <AnimatedImage img={info.img} />
          {/* <img src={info.img} alt="" className="h-fit w-fit object-cover" /> */}
        </div>
      </div>
    </div>
  );
};

const AnimatedTitle = ({ title }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const headerVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: {
      opacity: 1,
      x: 20,
      transition: { duration: 1, ease: "easeOut" },
    },
  };
  return (
    <motion.h2
      ref={ref}
      initial="hidden"
      variants={headerVariants}
      animate={isInView ? "visible" : "hidden"}
    >
      {title}
    </motion.h2>
  );
};

const AnimatedImage = ({ img }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Variants for a left-to-right reveal
  const revealVariants = {
    hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
    visible: {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={revealVariants}
      style={{ overflow: "hidden", display: "inline-block" }}
    >
      <img src={img} alt="" className="h-fit w-fit object-cover" />
    </motion.div>
  );
};

export default StoryAndMission;
