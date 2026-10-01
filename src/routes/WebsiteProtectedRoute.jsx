import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { ROLES } from "../utils/roles";

const WebsiteProtectedRoute = ({ 
        children,
        allowedRoles = [] 
    }) => {
    const userToken = '';
    const userRole = '';
    if (!userToken) {
        return (
            <Navigate
                to="/"
                replace
                
            />
        );
    }
    if (allowedRoles.length && !allowedRoles.includes(userRole)) {
        const target = userRole === ROLES.CUSTOMER ? "/my-account" : "/";
        return <Navigate to={target} replace />;
    }
    
    return children || <Outlet />;
};

export default WebsiteProtectedRoute;