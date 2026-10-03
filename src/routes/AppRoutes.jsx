import React from 'react'
import { Route, Routes } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import WebsiteLayout from '../pages/layout/WebsiteLayout';
import { ROUTES } from './routeConfig';
import { ROUTE_AREA } from '../api/constants/common';
import { PAGES } from './pages';
import WebsiteProtectedRoute from './WebsiteProtectedRoute'; 
import WebsiteGuestRoute from './WebsiteGuestRoute';
import MyAccountLayout from '../pages/layout/MyAccountLayout';


export default function AppRoutes() {
    return (
        <>
            <ErrorBoundary>
                <Routes>
                    {/* ==================== WEBSITE ==================== */}
                    <Route
                        element={<WebsiteLayout/>}
                    >
                        {
                            ROUTES
                            .filter(route => route.area === ROUTE_AREA.WEBSITE)
                            .map(route =>{
                                const WebsiteComponent = PAGES.website[route.element];
                                

                                if (!WebsiteComponent) {
                                    return null;
                                }

                                let element = <WebsiteComponent />;

                                if (route.protected) {
                                    element = (
                                        <WebsiteProtectedRoute allowedRoles={route.roles}>
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

                            })
                        }

                        {/* ==================== MY ACCOUNT ==================== */}
                       

                        <Route
                            path="/my-account"
                            element={
                                <WebsiteProtectedRoute>
                                    <MyAccountLayout />
                                </WebsiteProtectedRoute>
                            }
                        >
                            {
                                ROUTES
                                    .filter(
                                        (route) =>
                                            route.area === ROUTE_AREA.WEBSITE &&
                                            route.is_show === "my-account"
                                    )
                                    .map((route) => {

                                        const AccountComponent =
                                            PAGES.website[route.element];

                                        if (!AccountComponent) {
                                            return null;
                                        }

                                        // /my-account/profile -> profile
                                        // /my-account/orders  -> orders
                                        const childPath = route.path
                                            .replace("/my-account/", "")
                                            .replace("/my-account", "");

                                        return (
                                            <Route
                                                key={route.path}
                                                index={childPath === ""}
                                                path={childPath || undefined}
                                                element={
                                                    <AccountComponent />
                                                }
                                            />
                                        );
                                    })
                            }
                        </Route>

                    </Route>
                </Routes>
            </ErrorBoundary>
        </>
    )
}
