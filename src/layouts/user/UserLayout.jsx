import React from "react";
import Navbar from "../../components/user/Navbar";
import Sidebar from "../../components/user/Sidebar";

const UserLayout = ({ children }) => {
  return (
    <div className="font-mont flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50/35 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
