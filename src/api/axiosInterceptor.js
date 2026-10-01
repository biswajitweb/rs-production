import axiosInstance from "./axiosInstance";

// =========================
// REQUEST INTERCEPTOR
// =========================
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =========================
// RESPONSE INTERCEPTOR
// =========================
axiosInstance.interceptors.response.use(
    (response) => response,
    
    (error) => {
        // No response from server
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

        // Unauthorized
        if (status === 401) {
            localStorage.removeItem("token");

            // Avoid redirect during login request
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }

        // Forbidden
        if (status === 403) {
            error.message =
                data?.message || "You do not have permission to perform this action.";
        }

        // Validation / bad request
        if (status === 400) {
            error.message =
                data?.message || "Invalid request. Please check your input.";
        }

        // Not found
        if (status === 404) {
            error.message =
                data?.message || "The requested resource was not found.";
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