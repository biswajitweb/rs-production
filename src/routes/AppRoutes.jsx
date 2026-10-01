import React from 'react'
import { Route, Routes } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import WebsiteLayout from '../pages/layout/WebsiteLayout';
import { ROUTES } from './routeConfig';
import { ROUTE_AREA } from '../api/constants/common';
import { PAGES } from './pages';
import WebsiteProtectedRoute from './WebsiteProtectedRoute'; 
import WebsiteGuestRoute from './WebsiteGuestRoute';


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

                    </Route>
                </Routes>
            </ErrorBoundary>
        </>
    )
}
