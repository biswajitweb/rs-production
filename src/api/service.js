
import axiosInstance from './axiosInterceptor';
import { API_MODULE, API_PREFIX } from './constants';

export const service = {

    /**
     * Gte site infrmatiom 
    */

    site: {
        getInfo: ()=> axiosInstance.get(`${API_PREFIX}info`)
    },

    /**
     * PRODUCTS 
    */
   product: {
    getAll: (params = {})=> 
        axiosInstance.get(`${API_PREFIX}${API_MODULE.PRODUCTS}`, {params}

    ),
    getById: (id, variantId) => 
        axiosInstance.get(`${API_PREFIX}${API_MODULE.PRODUCTS}/${id}/?variant_id=${variantId}`
            
        ),
    getRelated: (id, count)=> 
        axiosInstance.get(`${API_PREFIX}${API_MODULE.PRODUCTS}/${id}/related?count=${count}`

    ),
    getBestSelling: (count)=> 
        axiosInstance.get(`${API_PREFIX}${API_MODULE.PRODUCTS}/best-selling?count=${count}`

    ),
    getVariation: (id, attributes)=> 
        axiosInstance.get(`${API_PREFIX}${API_MODULE.PRODUCTS}/${id}/variation?${attributes}`
        
    )
   },

   /**
    * Customer info 
    */
    customer: {
        login: (params = {}) => {
            return axiosInstance.post(
                `${API_PREFIX}customer/login`,
                params
            );
        },
        create : (params = {})=>{
            return axiosInstance.post(
                `${API_PREFIX}customers`, 
                params
            );
        },
        refreshToken : (params = {})=>{
            return axiosInstance.post(`${API_PREFIX}refresh-token`, {
                params: params
            });
        },
        password : (params = {})=>{
            return axiosInstance.post(`${API_PREFIX}update-password`, 
                params
            );
        }
    },
    
    /**
     * Order info
    */
    order : {
        create : (params = {})=>{
            return axiosInstance.post(`${API_PREFIX}orders`, params);
        },
        byCustomer : (params = {})=>{
            return axiosInstance.get(`${API_PREFIX}orders`, {
                params : params
            });
        },
        single : (orderId)=>{
            return axiosInstance.get(`${API_PREFIX}orders/${orderId}`);
        }
    }
};