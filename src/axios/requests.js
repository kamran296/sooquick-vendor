import API from "./apiRoutes";
import instances from "./instances";

const signup = async (payload) => {
  return await instances.publicRequest.post(API.AUTH.SIGN_UP, payload);
};

const login = async (payload) => {
  return await instances.publicRequest.post(API.AUTH.LOGIN, payload);
};

const logout = async (payload) => {
  return await instances.privateRequest.get(API.AUTH.LOGOUT);
};

const emailVerify = async (token) => {
  return await instances.publicRequest.get(API.AUTH.VERIFY_EMAIL(token));
};

const requestOtp = async (payload) => {
  return await instances.publicRequest.post(API.AUTH.RESET_PASSWORD, payload);
};
const verifyOtp = async (payload) => {
  return await instances.publicRequest.post(API.AUTH.VERIFY_OTP, payload);
};
const changePassword = async (payload) => {
  return await instances.publicRequest.post(API.AUTH.CHANGE_PASSWORD, payload);
};

const checkAuth = async () => {
  return await instances.privateRequest.post(API.AUTH.CHECK_AUTH);
};

const verifyTwoFactor = async (payload) => {
  return await instances.publicRequest.post(API.AUTH.VERIFY_2FA, payload);
};

const getUser = async () => {
  return await instances.privateRequest.get(API.USER.GET);
};

const updateUser = async (formData) => {
  return await instances.privateRequest.put(API.USER.UPDATE, formData);
};

const purchaseMembership = async (formData) => {
  return await instances.privateRequest.post(
    API.USER.PUECHASE_MEMBERSHIP,
    formData,
  );
};

// ====================Notification===================
const getNotification = async () => {
  return await instances.privateRequest.get(API.NOTIFICATION.GET);
};
const markNotification = async (id) => {
  return await instances.privateRequest.put(API.NOTIFICATION.UPDATE(id));
};

// ===============KYC==================
const getKycDetails = async () => {
  return await instances.privateRequest.get(API.KYC.GET);
};
const submitKycDetails = async (formData) => {
  return await instances.privateRequest.post(API.KYC.REQUEST, formData);
};

// ========================Services===================
const createService = async (formData) => {
  return await instances.privateRequest.post(API.SERVICES.CREATE, formData);
};
const updateService = async (id, formData) => {
  return await instances.privateRequest.put(API.SERVICES.UPDATE(id), formData);
};
const getAllServices = async () => {
  return await instances.privateRequest.get(API.SERVICES.GET_ALL);
};
const getRequestedService = async () => {
  return await instances.privateRequest.get(API.SERVICES.GET_REQUESTED);
};
const getRejectedServices = async () => {
  return await instances.privateRequest.get(API.SERVICES.GET_REJECTED);
};
const getServiceDetails = async (serviceId) => {
  return await instances.privateRequest.get(API.SERVICES.GET(serviceId));
};

// ------orders--------------
const updateOrderStatus = (orderId, data) => {
  return axios.put(`/api/orders/${orderId}/status`, data);
};

const getAllOrders = async () => {
  return await instances.privateRequest.get(API.ORDER.GET_ALL);
};

const initiateOrderCompletion = async (orderId) => {
  return await instances.privateRequest.get(
    API.ORDER.INTIATE_COMPLETION(orderId),
  );
};
const resendOtp = async (orderId) => {
  return await instances.privateRequest.get(API.ORDER.RESEND_OTP(orderId));
};

const verifyOrderOtp = async (orderId, data) => {
  return await instances.privateRequest.post(
    API.ORDER.VERIFY_OTP(orderId),
    data,
  );
};

const addAdditionalService = async (orderId, data) => {
  return await instances.privateRequest.post(
    API.ORDER.ADD_ADDITONAL_SERVICE(orderId),
    data,
  );
};

// ----------------wallet------------------
const getWallet = async () => {
  return await instances.privateRequest.get(API.USER.GET_WALLET);
};
const cashoutWallet = async (payload) => {
  return await instances.privateRequest.post(API.USER.REQUEST_CASHOUT, payload);
};

// -------------------support=================
const requestSupportTickets = async () => {
  return await instances.privateRequest.get(API.SUPPORT.GET_TICKETS);
};
const createSupportTicket = async (payload) => {
  return await instances.privateRequest.post(
    API.SUPPORT.CREATE_TICKET,
    payload,
  );
};
const addMessageToTicket = async (ticketId, payload) => {
  return await instances.privateRequest.post(
    API.SUPPORT.ADD_MESSAGE(ticketId),
    payload,
  );
};
const getTicketById = async (ticketId) => {
  return await instances.privateRequest.get(
    API.SUPPORT.GET_TICKET_BY_ID(ticketId),
  );
};
const getAllSupportTickets = async () => {
  return await instances.privateRequest.get(API.SUPPORT.GET_TICKETS);
};

const request = {
  signup,
  login,
  logout,
  emailVerify,
  requestOtp,
  verifyOtp,
  changePassword,
  checkAuth,
  getUser,
  updateUser,
  getKycDetails,
  submitKycDetails,
  purchaseMembership,
  verifyTwoFactor,

  getNotification,
  markNotification,

  createService,
  updateService,
  getAllServices,
  getRequestedService,
  getRejectedServices,
  getServiceDetails,

  getAllOrders,
  addAdditionalService,
  initiateOrderCompletion,
  resendOtp,
  verifyOrderOtp,

  getWallet,
  cashoutWallet,

  requestSupportTickets,
  createSupportTicket,
  addMessageToTicket,
  getTicketById,
  getAllSupportTickets,
};

export default request;
