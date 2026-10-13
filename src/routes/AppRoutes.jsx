
import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import ErrorBoundary from "../components/ErrorBoundary";
import WebsiteLayout from "../pages/layout/WebsiteLayout";
import MyAccountLayout from "../pages/layout/MyAccountLayout";
import SEO from "../components/SEO";

import { ROUTES } from "./routeConfig";
import { ROUTE_AREA } from "../api/constants/common";
import { PAGES } from "./pages";

import WebsiteProtectedRoute from "./WebsiteProtectedRoute";
import WebsiteGuestRoute from "./WebsiteGuestRoute";
import { ROLES } from "../utils/roles";

const NotFound = lazy(() =>
    import("../pages/others/NotFound")
);

export default function AppRoutes() {
    // Normal website routes
    const websiteRoutes = ROUTES.filter(
        (route) =>
            route.area === ROUTE_AREA.WEBSITE &&
            route.is_show !== "my-account"
    );

    // My account routes
    const myAccountRoutes = ROUTES.filter(
        (route) =>
            route.area === ROUTE_AREA.WEBSITE &&
            route.is_show === "my-account"
    );

    return (
        <ErrorBoundary>
            <Routes>
                {/* ==================== WEBSITE ==================== */}
                <Route element={<WebsiteLayout />}>
                    {websiteRoutes.map((route) => {
                        const WebsiteComponent =
                            PAGES.website[route.element];

                        if (!WebsiteComponent) {
                            return null;
                        }

                        // Add SEO metadata to the current page
                        let element = (
                            <>
                                <SEO {...route.seo} />
                                <WebsiteComponent />
                            </>
                        );

                        // Protected routes
                        if (route.protected) {
                            element = (
                                <WebsiteProtectedRoute
                                    allowedRoles={route.roles}
                                >
                                    {element}
                                </WebsiteProtectedRoute>
                            );
                        } else if (route.guest) {
                            // Guest-only routes
                            element = (
                                <WebsiteGuestRoute>
                                    {element}
                                </WebsiteGuestRoute>
                            );
                        }

                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={element}
                            />
                        );
                    })}

                    {/* ==================== MY ACCOUNT ==================== */}
                    <Route
                        path="/my-account"
                        element={
                            <WebsiteProtectedRoute
                                allowedRoles={[ROLES.CUSTOMER]}
                            >
                                <SEO
                                    title="My Account"
                                    description="Manage your customer account."
                                    noIndex={true}
                                />

                                <MyAccountLayout />
                            </WebsiteProtectedRoute>
                        }
                    >
                        {myAccountRoutes.map((route) => {
                            const AccountComponent =
                                PAGES.website[route.element];

                            if (!AccountComponent) {
                                return null;
                            }

                            // SEO for the account page
                            const accountElement = (
                                <>
                                    <SEO {...route.seo} />
                                    <AccountComponent />
                                </>
                            );

                            // /my-account
                            if (route.path === "/my-account") {
                                return (
                                    <Route
                                        key={route.path}
                                        index
                                        element={accountElement}
                                    />
                                );
                            }

                            // /my-account/orders -> orders
                            const childPath = route.path.replace(
                                "/my-account/",
                                ""
                            );

                            return (
                                <Route
                                    key={route.path}
                                    path={childPath}
                                    element={accountElement}
                                />
                            );
                        })}
                    </Route>
                </Route>

                {/* ==================== 404 ==================== */}
                <Route
                    path="*"
                    element={
                        <>
                            <SEO
                                title="Page Not Found"
                                description="The requested page could not be found."
                                noIndex={true}
                            />
                            <NotFound />
                        </>
                    }
                />
            </Routes>
        </ErrorBoundary>
    );
}
