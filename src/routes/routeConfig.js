
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
 *
 * seo:
 * - title
 * - description
 * - canonical
 * - noindex (optional)
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
        title: "Home",
        seo: {
            title: "Home | Tribal Culture",
            description:
                "Discover our latest products, explore popular collections, and shop quality products at great prices.",
            canonical: "/",
        },
    },
    {
        path: "/about-us",
        element: "About",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "top-menu",
        title: "About Us",
        seo: {
            title: "About Us | Tribal Culture",
            description:
                "Learn more about Tribal Culture, our story, our values, and our commitment to quality products and customer satisfaction.",
            canonical: "/about-us",
        },
    },
    {
        path: "/contact-us",
        element: "ContactUs",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "top-menu",
        title: "Contact Us",
        seo: {
            title: "Contact Us | Tribal Culture",
            description:
                "Contact Tribal Culture for product enquiries, order assistance, customer support, and other questions.",
            canonical: "/contact-us",
        },
    },
    {
        path: "/product-details/:id/variants/:variantId",
        element: "ProductDetails",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "product-details",
        title: "Product Details",
        seo: {
            title: "Product Details | Tribal Culture",
            description:
                "Explore product details, features, available variants, and pricing. Find the right product for your needs.",
            canonical: "/product-details/:id/variants/:variantId",
            noindex: true,
        },
    },
    {
        path: "/cart",
        element: "Cart",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "cart",
        title: "Shopping Cart",
        seo: {
            title: "Shopping Cart | Tribal Culture",
            description:
                "Review your shopping cart, check selected products, and prepare your order before checkout.",
            canonical: "/cart",
            noindex: true,
        },
    },
    {
        path: "/sign-in",
        element: "Login",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "login",
        title: "Login",
        seo: {
            title: "Sign In | Tribal Culture",
            description:
                "Sign in to your Tribal Culture account to manage your profile, view orders, and access your saved addresses.",
            canonical: "/sign-in",
            noindex: true,
        },
    },
    {
        path: "/sign-up",
        element: "SignUp",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "sign-up",
        title: "Create Account",
        seo: {
            title: "Create an Account | Tribal Culture",
            description:
                "Create your Tribal Culture account to manage purchases, save addresses, and enjoy a convenient shopping experience.",
            canonical: "/sign-up",
            noindex: true,
        },
    },
    {
        path: "/terms-conditions",
        element: "TermsConditions",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "terms-conditions",
        title: "Terms and Conditions",
        seo: {
            title: "Terms and Conditions | Tribal Culture",
            description:
                "Read the terms and conditions governing the use of the Tribal Culture website, services, and shopping facilities.",
            canonical: "/terms-conditions",
        },
    },
    {
        path: "/checkout",
        element: "Checkout",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "checkout",
        title: "Checkout",
        seo: {
            title: "Checkout | Tribal Culture",
            description:
                "Review your order details and complete your purchase securely through the checkout process.",
            canonical: "/checkout",
            noindex: true,
        },
    },
    {
        path: "/order-success",
        element: "OrderSuccess",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "order-success",
        title: "Order Confirmation",
        seo: {
            title: "Order Confirmation | Tribal Culture",
            description:
                "View your order confirmation and find information about your recently placed purchase.",
            canonical: "/order-success",
            noindex: true,
        },
    },

    // =========================
    // My Account Routes
    // =========================
    {
        path: "/my-account",
        element: "Dashboard",
        area: ROUTE_AREA.WEBSITE,
        is_show: "my-account",
        title: "Dashboard",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-grid-1x2",
        seo: {
            title: "My Account Dashboard | Tribal Culture",
            description:
                "Manage your customer account, review recent activity, and access your shopping account dashboard.",
            canonical: "/my-account",
            noindex: true,
        },
    },
    {
        path: "/my-account/profile",
        element: "Profile",
        area: ROUTE_AREA.WEBSITE,
        is_show: "false",
        title: "My Profile",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-person",
        seo: {
            title: "My Profile | Tribal Culture",
            description:
                "View and manage your customer profile and personal account information.",
            canonical: "/my-account/profile",
            noindex: true,
        },
    },
    {
        path: "/my-account/orders",
        element: "Orders",
        area: ROUTE_AREA.WEBSITE,
        is_show: "my-account",
        title: "My Orders / Purchases",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-bag-check",
        seo: {
            title: "My Orders | Tribal Culture",
            description:
                "View your order history, track purchases, and review your previous orders.",
            canonical: "/my-account/orders",
            noindex: true,
        },
    },
    {
        path: "/my-account/addresses",
        element: "Addresses",
        area: ROUTE_AREA.WEBSITE,
        is_show: "my-account",
        title: "Saved Addresses",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-geo-alt",
        seo: {
            title: "Saved Addresses | Tribal Culture",
            description:
                "Manage your saved shipping and billing addresses for convenient order checkout.",
            canonical: "/my-account/addresses",
            noindex: true,
        },
    },
    {
        path: "/my-account/account-details",
        element: "AccountDetails",
        area: ROUTE_AREA.WEBSITE,
        is_show: "my-account",
        title: "Account Details",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-person-gear",
        seo: {
            title: "Account Details | Tribal Culture",
            description:
                "Update your account information and manage your customer account preferences.",
            canonical: "/my-account/account-details",
            noindex: true,
        },
    },
    {
        path: "/my-account/change-password",
        element: "ChangePassword",
        area: ROUTE_AREA.WEBSITE,
        is_show: "my-account",
        title: "Change Password",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-shield-lock",
        seo: {
            title: "Change Password | Tribal Culture",
            description:
                "Update your account password and maintain the security of your Tribal Culture account.",
            canonical: "/my-account/change-password",
            noindex: true,
        },
    },
    {
        path: "/my-account/orders/:orderId",
        element: "OrdersDetails",
        area: ROUTE_AREA.WEBSITE,
        is_show: "false",
        title: "Order Details",
        protected: true,
        roles: [ROLES.CUSTOMER],
        icon: "bi bi-shield-lock",
        seo: {
            title: "Order Details | Tribal Culture",
            description:
                "Review the details and status of an individual order in your customer account.",
            canonical: "/my-account/orders/:orderId",
            noindex: true,
        },
    },

    // =========================
    // Footer Menu Routes
    // =========================
    {
        path: "/help",
        element: "Help",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "footer-menu",
        title: "Help",
        seo: {
            title: "Help and Support | Tribal Culture",
            description:
                "Find help with shopping, orders, payments, deliveries, and other customer support questions.",
            canonical: "/help",
        },
    },
    {
        path: "/privacy-policy",
        element: "PrivacyPolicy",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "footer-menu",
        title: "Privacy Policy",
        seo: {
            title: "Privacy Policy | Tribal Culture",
            description:
                "Read the Tribal Culture privacy policy to understand how personal information is collected, used, and protected.",
            canonical: "/privacy-policy",
        },
    },
    {
        path: "/license-agreement",
        element: "LicenseAgreement",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "footer-menu",
        title: "License Agreement",
        seo: {
            title: "License Agreement | Tribal Culture",
            description:
                "Review the license agreement and applicable terms governing the use of Tribal Culture website content and services.",
            canonical: "/license-agreement",
        },
    },
    {
        path: "/refund-cancellation-policy",
        element: "RefundCancellation",
        area: ROUTE_AREA.WEBSITE,
        guest: true,
        is_show: "footer-menu",
        title: "Refund and Cancellation Policy",
        seo: {
            title: "Refund and Cancellation Policy | Tribal Culture",
            description:
                "Review the refund, return, and cancellation terms applicable to purchases made through Tribal Culture.",
            canonical: "/refund-cancellation-policy",
        },
    },
];
