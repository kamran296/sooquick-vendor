import React from "react";
import Landing from "../../assets/landing/landing.mp4";

const VideosAndBlogs = () => {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto flex w-full items-center justify-center px-4">
        {/* <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Coming Soon Services
        </h2> */}

        <video src={Landing} controls></video>
      </div>
    </div>
  );
};

export default VideosAndBlogs;
