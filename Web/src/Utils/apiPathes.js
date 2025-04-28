

export const BASE_URL = "http://127.0.0.1:5000";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/signup",
        GET_USER_INFO: "/api/auth/user",
        UPDATE_USER: "/api/auth/edit",
    },
    DASHBOARD: {
        GET_DATA: "/api/dashboard/",
    },
    INCOME: {
        ADD_INCOME: "/api/income/add",
        GET_INCOMES: "/api/income/",
        DELETE_INCOME: (incomeID) => `/api/income/delete/${incomeID}`,
        DOWNLOAD_INCOME: "/api/income/download",
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/expense/add",
        GET_EXPENSES: "/api/expense/",
        DELETE_EXPENSE: (expenseID) => `/api/expense/delete/${expenseID}`,
        DOWNLOAD_EXPENSE: "/api/expense/download",
    },
    IMAGE:{
        UPLOADE_IMAGE:"/auth/upload-image"
    }
};
