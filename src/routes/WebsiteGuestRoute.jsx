import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "../utils/roles";


const WebsiteGuestRoute = ({ children }) => {
    const userToken = '';
    if (userToken) {
        return <Navigate to={userRole === ROLES.CUSTOMER ? "/my-account" : "/"} replace />;
    }
    return children || <Outlet />;
};

export default WebsiteGuestRoute;