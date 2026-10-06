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
       Checkout : lazy(()=>import('../pages/checkout/Checkout')),
       Dashboard : lazy(()=> import('../pages/my-account/Dashboard')),
       Profile : lazy(()=>import('../pages/my-account/Profile')),
       Orders : lazy(()=>import('../pages/my-account/Orders')),
       Addresses : lazy(()=>import('../pages/my-account/Addresses')),
       AccountDetails : lazy(()=>import('../pages/my-account/AccountDetails')),
       ChangePassword : lazy(()=>import('../pages/my-account/ChangePassword')),
       OrderSuccess : lazy(()=>import('../pages/order/OrderSuccess')),
       OrdersDetails : lazy(()=>import('../pages/my-account/OrdersDetails'))
    } 
};