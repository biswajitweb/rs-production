import { ROUTE_AREA } from "../api/constants/common";
import { ROLES } from "../utils/roles";

/**
 * Application Routes
 *
 * area:
 * - website → Public website routes
 *
 * roles:
 * - Required only for protected routes
 */

export const ROUTES = [
    // =========================
    // Website Routes
    // =========================
    {
        path: "/",
        element: "Home",
        area: ROUTE_AREA.WEBSITE,
        public: true,
        is_show: "top-menu",
        title : "Home"
    },
    {
        path: "/shop",
        element: "Shop",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "top-menu",
        title : "My Products"
    },
    {
        path: "/about-us",
        element: "About",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "top-menu",
        title : "About Us"
    },
    {
        path: "/contact-us",
        element: "ContactUs",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "top-menu",
        title : "Contact Us"
    },
    {
        path: "/product-details/:id/variants/:variantId",
        element: "ProductDetails",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "product-details",
        title : "Product Details"
    },
    {
        path: "/cart",
        element: "Cart",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "cart",
        title : "Cart"
    },
    {
        path: "/sign-in",
        element: "Login",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "login",
        title : "Login"
    },
    {
        path: "/sign-up",
        element: "SignUp",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "sign-up",
        title : "SignUp"
    },
    {
        path: "/terms-conditions",
        element: "TermsConditions",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "terms-conditions",
        title : "TermsConditions"
    },
    {
        path: "/checkout",
        element: "Checkout",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "checkout",
        title : "Checkout"
    },
    {
        path: "/order-success",
        element: "OrderSuccess",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "order-success",
        title : "OrderSuccess"
    },
    // My account
    
    {
        path: "/my-account",
        element: "Dashboard",
        area: ROUTE_AREA.WEBSITE,
        is_show: "my-account",
        title: "Dashboard",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-grid-1x2"
    },
    {
        path: "/my-account/profile",
        element: "Profile",
        area: ROUTE_AREA.WEBSITE,
        is_show: "my-account",
        title: "My Profile",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-person"
    },
    {
        path: "/my-account/orders",
        element: "Orders",
        area: ROUTE_AREA.WEBSITE,
        is_show: "my-account",
        title: "My Orders / Purchases",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-bag-check"
    },
    {
        path: "/my-account/addresses",
        element: "Addresses",
        area: ROUTE_AREA.WEBSITE,
        is_show: "my-account",
        title: "Saved Addresses",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-geo-alt"
    },
    {
        path: "/my-account/account-details",
        element: "AccountDetails",
        area: ROUTE_AREA.WEBSITE,
        is_show: "my-account",
        title: "Account Details",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-person-gear"
    },
    {
        path: "/my-account/change-password",
        element: "ChangePassword",
        area: ROUTE_AREA.WEBSITE,
        is_show: "my-account",
        title: "Change Password",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-shield-lock"
    },
    {
        path: "/my-account/orders/:id",
        element: "OrdersDetails",
        area: ROUTE_AREA.WEBSITE,
        is_show: "orders-details",
        title: "Orders Details",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-shield-lock"
    }
    
];