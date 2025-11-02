import React, { useState } from "react";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";

const FAQ = ({ faqData }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <div className="font-poppins mx-auto mt-[34px] max-w-[350px] md:mt-[64px] md:max-w-[768px]">
      <div className="space-y-5 divide-y divide-[#DFDFDF] md:space-y-10">
        {faqData.slice(0, 5).map((faq, index) => (
          <div key={index} className="py-5 hover:cursor-pointer">
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-[16px] leading-[160%] font-normal tracking-[1%] text-[#121212] hover:cursor-pointer md:text-lg md:leading-[150%] md:tracking-[0%]">
                {faq.question}
              </h3>
              <span className="ml-6 flex h-7 items-center hover:cursor-pointer">
                {activeIndex === index ? (
                  <MdOutlineKeyboardArrowUp className="h-5 w-5 text-black" />
                ) : (
                  <MdOutlineKeyboardArrowDown className="h-5 w-5 text-black" />
                )}
              </span>
            </button>

            {activeIndex === index && (
              <div className="mt-2 pr-12">
                <p className="text-[14px] leading-[160%] font-light tracking-[1%] text-[#121212] md:text-[16px]">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
