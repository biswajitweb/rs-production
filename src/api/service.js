
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
        },
        states : async(countryCode) =>{
            return await axiosInstance.get(`${API_PREFIX}states/${countryCode}`);
        },
        contact : async(params)=>{
            return await axiosInstance.post(`${API_PREFIX}/contact`, params);
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
        },
        generate_token : (params = {})=>{
            return axiosInstance.post(`${API_PREFIX}order/generate-token`, params);
        },
        download_image : (token)=>{
            return axiosInstance.get(`${API_PREFIX}order/download-image?token=${token}`);
        } 
    },
    /**
     * Address book 
    */
    address: {
        getAll : async (params = {})=>{
            return await axiosInstance.get(`${API_PREFIX}addresses`, {
                params : params
            });
        },
        save : async(params = {})=>{
            return await axiosInstance.post(`${API_PREFIX}addresses`, params);
        },
        update : async(params = {})=>{
            return await axiosInstance.put(`${API_PREFIX}addresses`, 
                params
            );
        },
        delete: async(params = {})=>{
            return await axiosInstance.delete(`${API_PREFIX}addresses`, {
                params : params
            });
        },
        default : async(params = {})=>{
            return await axiosInstance.put(`${API_PREFIX}addresses/default`, params);
        }
    }
};