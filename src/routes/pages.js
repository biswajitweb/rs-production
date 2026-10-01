import { lazy } from "react";

export const PAGES = {
    website: {
       Home : lazy(()=>import('../pages/home/Home')),
       About : lazy(()=>import('../pages/about/About')),
       Shop: lazy(()=>import('../pages/shop/Shop')),
       ContactUs : lazy(()=>import('../pages/contact/ContactUs')),
       ProductDetails : lazy( ()=>import('../pages/product-details/ProductDetails'))
    } 
};