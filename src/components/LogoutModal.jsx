import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const LogoutModal = ({ isOpen, onLogout, onCancel }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Prevent background clicks
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.pointerEvents = "auto";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.pointerEvents = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      style={{ pointerEvents: "auto" }}
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Leave Application?
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            You're about to leave the authenticated area. Do you want to logout?
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Stay Logged In
          </button>
          <button
            onClick={onLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default LogoutModal;
