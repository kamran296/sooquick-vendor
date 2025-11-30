const API = {
  AUTH: {
    SIGN_UP: "/auth/register/vendor",
    CHANGE_PASSWORD: "/auth/change-password/vendor",
    VERIFY_EMAIL: (token) => `/auth/verify/${token}`,
    VERIFY_OTP: "/auth/verify-otp",
    RESET_PASSWORD: "/auth/reset-password/vendor",
    LOGIN: "/auth/login/vendor",
    LOGOUT: "/auth/logout",
    CHECK_AUTH: "/auth/check-auth/vendor",
    VERIFY_2FA: "/auth/verify-two-factor",
  },
  USER: {
    GET: "/vendor",
    UPDATE: "/vendor/update",
    PUECHASE_MEMBERSHIP: "/vendor/membership",
    GET_WALLET: "/vendor/wallet",
    REQUEST_CASHOUT: "/vendor/cashout",
    DASHBOARD: "/vendor/dashboard",
  },
  KYC: {
    GET: "/vendor/kyc/details",
    REQUEST: "/vendor/kyc",
  },
  NOTIFICATION: {
    GET: "/notification",
    UPDATE: (id) => `/notification/mark-read/${id}`,
  },
  SERVICES: {
    GET_ALL: "/vendor/services",
    GET_REQUESTED: "/vendor/requested-services",
    GET_REJECTED: "/vendor/rejected-services",
    CREATE: "/vendor/create-service",
    UPDATE: (id) => `/vendor/update-service/${id}`,
    GET: (serviceId) => `/service/${serviceId}`,
  },
  ORDER: {
    GET_ALL: "/vendor/order/",
    INTIATE_COMPLETION: (id) => `/order/initiate-completion/${id}`,
    VERIFY_OTP: (id) => `/order/${id}/verify-otp `,
    RESEND_OTP: (id) => `/order/resend-otp/${id} `,
    ADD_ADDITONAL_SERVICE: (id) => `/order/additional-services/${id}`,
  },
  SUPPORT: {
    GET_TICKETS: "/support",
    CREATE_TICKET: "/support/create-ticket",
    ADD_MESSAGE: (ticketId) => `/support/add-message/${ticketId}`,
    GET_TICKET_BY_ID: (ticketId) => `/support/${ticketId}`,
  },
};

export default API;
