// import React, { useEffect, useRef, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   markAsRead,
//   markAllAsRead,
//   getAllNotifications,
//   markNotificationRead,
// } from "../../redux/slices/notificationSlice";
// import { FaBell } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const NotificationBell = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { notifications, unreadCount } = useSelector(
//     (state) => state.notifications,
//   );
//   const [isOpen, setIsOpen] = useState(false);
//   const modalRef = useRef();

//   useEffect(() => {
//     dispatch(getAllNotifications());
//   }, []);

//   const handleMarkAsRead = (id, link) => {
//     dispatch(markNotificationRead(id));
//     if (link) {
//       navigate(link);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   return (
//     <div className="relative cursor-pointer" ref={modalRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="relative p-2 text-gray-600 hover:text-gray-800"
//       >
//         <FaBell className="text-2xl text-[#0b8266]" />
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 inline-flex h-5 w-5 translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-yellow-300 text-xs leading-none font-bold text-black">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-md bg-white shadow-lg">
//           <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-3">
//             <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
//             {/* {unreadCount > 0 && (
//               <button
//                 onClick={() => dispatch(markAllAsRead())}
//                 className="text-xs text-blue-600 hover:text-blue-800"
//               >
//                 Mark all as read
//               </button>
//             )} */}
//           </div>

//           <div className="max-h-96 overflow-y-auto">
//             {notifications.length === 0 ? (
//               <p className="p-4 text-center text-sm text-gray-500">
//                 No notifications
//               </p>
//             ) : (
//               notifications.map((notification) => (
//                 <div
//                   key={notification._id}
//                   className={`cursor-pointer border-b border-gray-100 p-3 hover:bg-gray-50 ${
//                     !notification.read ? "bg-blue-50" : ""
//                   }`}
//                   onClick={() =>
//                     handleMarkAsRead(notification._id, notification.link)
//                   }
//                 >
//                   <p className="text-sm font-medium text-gray-900">
//                     {notification.title}
//                   </p>
//                   <p className="mt-1 text-xs text-gray-600">
//                     {notification.message}
//                   </p>
//                   <p className="mt-2 text-xs text-gray-400">
//                     {new Date(notification.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;

// de2
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  markAsRead,
  markAllAsRead,
  getAllNotifications,
  markNotificationRead,
} from "../../redux/slices/notificationSlice";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector(
    (state) => state.notifications,
  );
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    dispatch(getAllNotifications());
  }, []);

  const handleMarkAsRead = (id, link) => {
    dispatch(markNotificationRead(id));
    if (link) {
      navigate(link);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
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
            {/* {unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllAsRead())}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )} */}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-500">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`border-b border-gray-100 p-3 transition hover:bg-gray-50 ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  {/* Main clickable content */}
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

                  {/* Mark as read action */}
                  {!notification.read && (
                    <button
                      className="mt-2 text-xs font-medium text-blue-600 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(markNotificationRead(notification._id));
                      }}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
