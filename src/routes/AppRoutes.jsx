import React from "react";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import WebsiteLayout from "../pages/layout/WebsiteLayout";
import { ROUTES } from "./routeConfig";
import { ROUTE_AREA } from "../api/constants/common";
import { PAGES } from "./pages";
import WebsiteProtectedRoute from "./WebsiteProtectedRoute";
import WebsiteGuestRoute from "./WebsiteGuestRoute";
import MyAccountLayout from "../pages/layout/MyAccountLayout";
import { ROLES } from "../utils/roles";

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

                        let element = <WebsiteComponent />;

                        if (route.protected) {
                            element = (
                                <WebsiteProtectedRoute
                                    allowedRoles={route.roles}
                                >
                                    {element}
                                </WebsiteProtectedRoute>
                            );
                        } else if (route.guest) {
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
                            if (route.path === "/my-account") {
                                return (
                                    <Route
                                        key={route.path}
                                        index
                                        element={<AccountComponent />}
                                    />
                                );
                            }

                            const childPath = route.path.replace(
                                "/my-account/",
                                ""
                            );

                            return (
                                <Route
                                    key={route.path}
                                    path={childPath}
                                    element={<AccountComponent />}
                                />
                            );
                        })}

                    </Route>

                </Route>

            </Routes>
        </ErrorBoundary>
    );
}