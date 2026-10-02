import { lazy } from "react";

export const PAGES = {
    website: {
       Home : lazy(()=>import('../pages/home/Home')),
       About : lazy(()=>import('../pages/about/About')),
       Shop: lazy(()=>import('../pages/shop/Shop')),
       ContactUs : lazy(()=>import('../pages/contact/ContactUs')),
       ProductDetails : lazy( ()=>import('../pages/product-details/ProductDetails')),
       Cart : lazy(()=>import('../pages/cart/Cart')),
       Login : lazy(()=>import('../pages/auth/Login')),
       SignUp : lazy(()=> import('../pages/auth/SignUp')),
       TermsConditions : lazy(()=>import('../pages/auth/TermsConditions')),
       Checkout : lazy(()=>import('../pages/checkout/Checkout'))
    } 
};