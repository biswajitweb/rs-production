import axiosInstance from "./axiosInterceptor";
import { API_PREFIX } from "./constants";


/**
 * Creates a Cashfree payment session for a WooCommerce order.
 *
 * @param {Object} params - Payment details, such as order_id.
 * @returns {Promise<Object>} API response containing payment session details.
*/
export const createCashfreePayment = async (params = {} ) => {
   const response = await axiosInstance.post(`${API_PREFIX}cashfree/create-payment`, 
        params
        ,
        {
            // Include cookies and credentials with the request.
            withCredentials : true
        }
    );
    return response.data;
};

/**
 * Creates a Cashfree payment session for a WooCommerce order.
 *
 * @param {Object} params - Payment details, such as order_id.
 * @returns {Promise<Object>} API response containing payment session details.
*/

export const verifyCashfreePayment = async (params = {}) => {
    const response = await axiosInstance.post(`${API_PREFIX}cashfree/verify-payment`, 
        params
        ,
        {
            // Include cookies and credentials with the request.
            withCredentials : true
        }
    );
    return response.data;
};