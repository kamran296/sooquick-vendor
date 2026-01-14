import React, { useEffect } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaCalendarAlt,
  FaUserPlus,
  FaCog,
} from "react-icons/fa";
import { BsFillCircleFill } from "react-icons/bs";
import UserLayout from "../../layouts/user/UserLayout";
import { formatDate } from "../../utils/helpers";
import {
  getAllNotifications,
  markNotificationRead,
  markAllNotificationsAsRead,
  setCurrentPage,
} from "../../redux/slices/notificationSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    pagination,
    status: loading,
  } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(
      getAllNotifications({ page: pagination.page, limit: pagination.limit }),
    );
  }, [dispatch, pagination.page, pagination.limit]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleDelete = async (id) => {
    // If you have delete API, implement here
    console.log("Delete notification:", id);
  };

  const getIcon = (type, icon) => {
    switch (icon) {
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "WITHDRAWAL":
        return <FaExclamationTriangle className="text-yellow-500" />;
      case "info":
        return <FaInfoCircle className="text-blue-500" />;
      case "user":
        return <FaUserPlus className="text-purple-500" />;
      case "KYC_REJECTED":
      case "SERVICE_REJECTED":
        return <FaCalendarAlt className="text-red-500" />;
      case "message":
        return <FaEnvelope className="text-teal-500" />;
      case "settings":
        return <FaCog className="text-gray-500" />;
      default:
        return (
          <FaBell
            className={`text-${type === "success" ? "green" : type === "warning" ? "yellow" : "teal"}-800`}
          />
        );
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.page - Math.floor(maxVisiblePages / 2),
    );
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1,
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`rounded-md px-3 py-1 transition-all duration-200 ${
            pagination.page === i
              ? "bg-[#0b8263] text-white"
              : "text-gray-600 hover:bg-teal-50 hover:text-[#0b8263]"
          }`}
        >
          {i}
        </button>,
      );
    }

    return (
      <div className="mt-8 flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
          disabled={!pagination.hasPrevPage}
          className={`rounded-md p-2 ${
            pagination.hasPrevPage
              ? "text-[#0b8263] hover:bg-teal-50"
              : "cursor-not-allowed text-gray-400"
          }`}
        >
          <FaChevronLeft />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="rounded-md px-3 py-1 text-gray-600 hover:bg-teal-50 hover:text-[#0b8263]"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-400">...</span>}
          </>
        )}

        {pages}

        {endPage < pagination.totalPages && (
          <>
            {endPage < pagination.totalPages - 1 && (
              <span className="text-gray-400">...</span>
            )}
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              className="rounded-md px-3 py-1 text-gray-600 hover:bg-teal-50 hover:text-[#0b8263]"
            >
              {pagination.totalPages}
            </button>
          </>
        )}

        <button
          onClick={() =>
            handlePageChange(
              Math.min(pagination.totalPages, pagination.page + 1),
            )
          }
          disabled={!pagination.hasNextPage}
          className={`rounded-md p-2 ${
            pagination.hasNextPage
              ? "text-[#0b8263] hover:bg-teal-50"
              : "cursor-not-allowed text-gray-400"
          }`}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-[#0b8263] p-3 text-white">
                  <FaBell size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                    Notifications
                  </h1>
                  <p className="text-gray-600">
                    Stay updated with your latest activities
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleMarkAllAsRead}
                  className="rounded-lg bg-teal-50 px-4 py-2 text-sm font-medium text-[#0b8263] transition-colors duration-200 hover:bg-teal-100"
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </button>
                <div className="relative">
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
                    <span className="text-sm font-medium text-gray-700">
                      {unreadCount} unread
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Notifications</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {pagination.total}
                    </p>
                  </div>
                  <FaBell className="text-[#0b8263]" size={24} />
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Unread</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {unreadCount}
                    </p>
                  </div>
                  <BsFillCircleFill className="text-red-500" size={24} />
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Page</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {pagination.page}
                    </p>
                  </div>
                  <FaInfoCircle className="text-blue-500" size={24} />
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Pages</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {pagination.totalPages}
                    </p>
                  </div>
                  <FaCog className="text-[#0b8263]" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {loading === "loading" ? (
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-[#0b8263]"></div>
                <p className="mt-2 text-gray-600">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <FaBell className="mx-auto text-gray-400" size={48} />
                <p className="mt-4 text-gray-600">No notifications found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => {
                      if (notification.link) {
                        navigate(notification.link);
                      }
                    }}
                    className={`p-6 transition-all duration-200 hover:cursor-pointer hover:bg-gray-50 ${
                      !notification.isRead
                        ? "border-l-4 border-l-[#0b8263] bg-teal-50"
                        : "bg-white-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          {getIcon(notification.type, notification.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-800">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <BsFillCircleFill
                                className="text-[#0b8263]"
                                size={8}
                              />
                            )}
                          </div>
                          <p className="mt-1 text-gray-600">
                            {notification.message}
                          </p>
                          <div className="mt-3 flex flex-col items-center space-x-4 md:flex-row">
                            <span className="text-sm text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                            <span className="rounded-full bg-teal-100 px-2 py-1 text-xs text-[#0b8263]">
                              {notification.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="rounded bg-teal-50 px-3 py-1 text-xs font-medium text-[#0b8263] transition-colors duration-200 hover:bg-teal-100"
                          >
                            Mark as read
                          </button>
                        )}
                        {/* <button
                          onClick={() => handleDelete(notification._id)}
                          className="rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
                        >
                          <FaTimes size={14} />
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} notifications
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Page size:</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => {
                      dispatch(
                        getAllNotifications({
                          page: 1,
                          limit: parseInt(e.target.value),
                        }),
                      );
                    }}
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {renderPagination()}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default NotificationPage;
