// import React, { useState } from "react";
// import Title from "../Title";
// import { FaSquareCheck } from "react-icons/fa6";
// import FAQ from "./FAQ";
// import {
//   customerFaqData,
//   customerSteps,
//   vendorFaqData,
//   vendorSteps,
// } from "../../../utils/landingData";

// const HowitWorks = () => {
//   const [tab, setTab] = useState(0);
//   const whom = tab === 0 ? "Customer" : "Vendor";
//   const data = tab === 0 ? customerSteps : vendorSteps;
//   const faqData = tab === 0 ? customerFaqData : vendorFaqData;

//   return (
//     <div className="font-mont flex flex-col items-center justify-center py-12">
//       {/* tab */}

//       <div className="tab flex w-fit items-center justify-center gap-4 rounded-full bg-slate-100 px-4 py-4 shadow-2xl">
//         <div
//           onClick={() => setTab(0)}
//           className={`tab1 rounded-full px-4 py-2 text-[40px] ${tab === 0 ? "bg-teal-800 text-white" : ""} `}
//         >
//           Customer
//         </div>
//         <div
//           onClick={() => setTab(1)}
//           className={`tab1 rounded-full px-4 py-2 text-[40px] ${tab === 1 ? "bg-teal-300" : ""} `}
//         >
//           Vendor
//         </div>
//       </div>

//       {/* header */}
//       <Title title={`For ${whom}`} />

//       <h2 className="mb-10 text-[16px] font-medium md:text-[40px]">
//         How It Works — Just Simple Steps
//       </h2>

//       {/* data */}
//       <div className="mb-10 flex flex-col gap-5">
//         {data.map((item, idx) => (
//           <div className="flex flex-col items-start px-4">
//             <div className="title mb-8 flex items-center justify-center gap-4">
//               <FaSquareCheck className="text-2xl text-green-400" />
//               <div className="text-[16px] font-bold md:text-[22px]">
//                 {item.title}
//               </div>
//             </div>
//             <ul className="whitespace-pre-line">
//               <li className="text-[12px] md:text-[16px]">{item.desc}</li>
//             </ul>
//           </div>
//         ))}
//       </div>

//       {/* video */}
//       <div className="mb-10 flex h-[200px] w-[300px] items-center justify-center rounded-4xl bg-green-600 md:h-[350px] md:w-5xl">
//         Vedio of How it works
//       </div>

//       {/* FAQ */}
//       <div className="flex flex-col">
//         {/* title */}
//         <Title title={"FAQs"} />

//         <div className="faq mt-12">
//           <FAQ faqData={faqData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HowitWorks;

import React, { useState } from "react";
import Title from "../Title";
import { FaSquareCheck } from "react-icons/fa6";
import FAQ from "./FAQ";
import {
  customerFaqData,
  customerSteps,
  vendorFaqData,
  vendorSteps,
} from "../../../utils/landingData";
import { motion, AnimatePresence } from "framer-motion";

const HowItWorks = () => {
  const [tab, setTab] = useState(0);
  const whom = tab === 0 ? "Customer" : "Vendor";
  const data = tab === 0 ? customerSteps : vendorSteps;
  const faqData = tab === 0 ? customerFaqData : vendorFaqData;

  // Animation variants
  const tabContentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="font-mont flex w-full flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      {/* Tab Selector */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-12 flex w-full max-w-md items-center justify-center rounded-full bg-slate-100 p-1 shadow-lg"
      >
        <button
          onClick={() => setTab(0)}
          className={`flex-1 rounded-full px-6 py-3 text-lg font-medium transition-all duration-300 md:text-xl ${
            tab === 0
              ? "bg-teal-700 text-white shadow-md"
              : "text-gray-600 hover:bg-slate-200"
          }`}
        >
          Customer
        </button>
        <button
          onClick={() => setTab(1)}
          className={`flex-1 rounded-full px-6 py-3 text-lg font-medium transition-all duration-300 md:text-xl ${
            tab === 1
              ? "bg-teal-700 text-white shadow-md"
              : "text-gray-600 hover:bg-slate-200"
          }`}
        >
          Vendor
        </button>
      </motion.div>

      {/* Header */}
      <div className="mb-12 text-center">
        <Title title={`For ${whom}`} />
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-2xl font-semibold text-gray-800 md:text-4xl"
        >
          How It Works — Just Simple Steps
        </motion.h2>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          variants={tabContentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="mb-16 w-full max-w-4xl"
        >
          {/* Steps */}
          <div className="mb-16 space-y-8">
            {data.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="rounded-xl bg-gray-50 p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="hidden items-center justify-center rounded-full bg-teal-100 text-teal-700 md:flex md:h-10 md:w-10">
                    <span className="text-lg font-bold">{idx + 1}</span>
                  </div>
                  <span className="flex text-lg font-bold md:hidden">
                    {idx + 1}
                  </span>

                  <h3 className="text-xl font-bold text-gray-800 md:text-2xl">
                    {item.title}
                  </h3>
                </div>
                <p className="ml-14 text-gray-600 md:text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Video Placeholder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-16 flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-xl"
          >
            <div className="text-center text-white">
              <p className="text-2xl font-bold md:text-4xl">
                How It Works Video
              </p>
              <p className="mt-2 text-sm md:text-base">Coming soon</p>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <div className="w-full">
            <Title title={"FAQs"} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <FAQ faqData={faqData} />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HowItWorks;
