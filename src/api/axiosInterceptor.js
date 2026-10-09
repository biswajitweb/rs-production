import axios from "axios";
import axiosInstance from "./axiosInstance";
import { decryptData, encryptData } from "../utils/encryption";
import { service } from "./service";

// =========================
// REFRESH TOKEN STATE
// =========================
let refreshPromise = null;

// =========================
// REQUEST INTERCEPTOR
// =========================
axiosInstance.interceptors.request.use(
    async (config) => {
        const auth = sessionStorage.getItem("auth");

        if (auth) {
            const userData = await decryptData(auth);
            const accessToken = userData?.data?.access_token;

            if (accessToken) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// =========================
// REFRESH ACCESS TOKEN
// =========================
const refreshAccessToken = async () => {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        throw new Error("Authentication data not found.");
    }

    const userData = await decryptData(auth);
    const refreshToken = userData?.data?.refresh_token;

    if (!refreshToken) {
        throw new Error("Refresh token not found.");
    }

    // Use plain Axios to avoid interceptor loops
    const response = await axios.post(
        `${service.customer.refreshToken}`,
        {
            refresh_token: refreshToken,
        }
    );

    const refreshedData = response.data?.data;

    if (!refreshedData?.access_token) {
        throw new Error("Unable to refresh access token.");
    }

    // Preserve user details and update tokens
    const updatedAuth = {
        ...userData,
        data: {
            ...userData.data,
            ...refreshedData,
        },
    };

    const encryptedAuth = await encryptData(updatedAuth);
    sessionStorage.setItem("auth", encryptedAuth);

    return refreshedData.access_token;
};

// =========================
// RESPONSE INTERCEPTOR
// =========================
axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Handle network errors
        if (!error.response) {
            if (error.code === "ECONNABORTED") {
                error.message = "Request timeout. Please try again.";
            } else {
                error.message =
                    "Unable to connect to the server. Please check your internet connection.";
            }

            return Promise.reject(error);
        }

        const { status, data } = error.response;

        // Refresh expired access token and retry request
        if (
            status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/refresh")
        ) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = refreshAccessToken().finally(() => {
                        refreshPromise = null;
                    });
                }

                const newAccessToken = await refreshPromise;

                originalRequest.headers =
                    originalRequest.headers || {};

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                sessionStorage.removeItem("auth");
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");

                if (!window.location.pathname.includes("/login")) {
                    window.location.assign("/login");
                }

                return Promise.reject(refreshError);
            }
        }

        // Unauthorized
        if (status === 401) {
            error.message =
                data?.message || "Your session has expired. Please log in again.";
        }

        // Forbidden
        if (status === 403) {
            error.message =
                data?.message || "You do not have permission to perform this action.";
        }

        // Bad request
        if (status === 400) {
            error.message =
                data?.message || "Invalid request. Please check your input.";
        }

        // Not found
        if (status === 404) {
            error.message =
                data?.message || "The requested resource was not found.";
        }

        // Conflict
        if (status === 409) {
            error.message =
                data?.message || "The requested resource conflicts with existing data.";
        }

        // Server error
        if (status >= 500) {
            error.message =
                data?.message || "Something went wrong on the server.";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;