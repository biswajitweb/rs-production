import React, { useEffect, useState } from "react";
import { ROUTES } from "../../routes/routeConfig";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { decryptData } from "../../utils/encryption";
import {logout} from '../../features/auth/authSlice'

export default function MyAccountLayout() {

    const myAccountMenu = ROUTES.filter(
        (item) => item.is_show === "my-account"
    );

    const {authToken} =  useSelector((state)=>state.user);
    const [userInfo, setUserInfo] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        decryptAuth();
    }, [authToken]);
    
    const decryptAuth = async () => {
        if (!authToken) {
            return;
        }
        try {
            const userDecrypt = await decryptData(authToken);
            setUserInfo(userDecrypt?.data);
        } catch (error) {
            console.error("Decrypt error:", error);
        }
    };

    const handleLogout = ()=>{
        dispatch(logout());
        navigate(`/`, {
            replace : true
        });
    }


    return (
        <div className="my-account">
            <div className="account-layout">
                
                {/* ================= SIDEBAR ================= */}
                <aside className="account-sidebar">

                    <div className="account-user">
                        <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                            style={{ width: "50px", height: "50px" }}
                        >
                            <i className="bi bi-person-fill fs-4 text-secondary"></i>
                        </div>
                       

                        <div className="account-user-info">
                            <h4>{userInfo?.first_name} {userInfo?.last_name}</h4>
                            <span>
                                {userInfo?.email}
                            </span>
                        </div>
                    </div>

                    <nav className="account-menu">

                        {Array.isArray(myAccountMenu) &&
                            myAccountMenu.length > 0 &&
                            myAccountMenu.map((item) => {
                                const relativePath = item.path
                                    .replace("/my-account/", "")
                                    .replace("/my-account", "");
                                
                                const isDashboard = item.path === "/my-account";

                            
                                return (
                                    <NavLink
                                        key={item.path}
                                        data-page={item.element}
                                        to={relativePath || "."}
                                        end={isDashboard}
                                        className={({ isActive }) =>
                                            `button ${
                                                isActive ? "active" : ""
                                            }`
                                        }
                                    >
                                        <span className="menu-icon">
                                           <i className={item.icon}></i>
                                        </span>

                                        {item.title}
                                    </NavLink>
                                );
                            })
                        }

                        <div className="menu-divider"></div>

                        <button
                           className="logout button"
                           onClick={handleLogout}
                        >
                            <span className="menu-icon">
                                <i className="bi bi-box-arrow-right"></i> 
                            </span>
                            Logout
                        </button>

                    </nav>
                </aside>

                {/* ================= CONTENT ================= */}
                <main className="account-content">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}