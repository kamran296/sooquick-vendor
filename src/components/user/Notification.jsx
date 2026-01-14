import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUnreadNotifications,
  markNotificationRead,
  markAllNotificationsAsRead,
} from "../../redux/slices/notificationSlice";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { unreadNotifications, unreadCount } = useSelector(
    (state) => state.notifications,
  );
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef();

  // Fetch unread notifications when component mounts
  useEffect(() => {
    dispatch(getUnreadNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id, link) => {
    dispatch(markNotificationRead(id));
    if (link) {
      navigate(link);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative cursor-pointer" ref={modalRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800"
      >
        <FaBell className="text-2xl text-[#0b8266]" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex h-5 w-5 translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-yellow-300 text-xs leading-none font-bold text-black">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-md bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-3">
            <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {unreadNotifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-500">
                No unread notifications
              </p>
            ) : (
              unreadNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`border-b border-gray-100 p-3 transition hover:bg-gray-50 ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      if (notification.link) {
                        navigate(notification.link);
                        setIsOpen(false);
                      }
                    }}
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      className="mt-2 text-xs font-medium text-blue-600 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification._id);
                      }}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-200 bg-gray-50 p-3">
            <button
              onClick={() => {
                navigate("/notifications");
                setIsOpen(false);
              }}
              className="w-full text-center text-sm font-medium text-[#0b8266] hover:text-[#0a7155]"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
