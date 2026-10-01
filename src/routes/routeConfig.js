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
        path: "/product-details",
        element: "ProductDetails",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "product-details",
        title : "Product Details"
    }
    
];