import React, { lazy, useEffect, useState } from 'react'
import {STATIC_IMAGE} from '../../utils/staticImage'
import {ROUTES} from '../../routes/routeConfig'
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { decryptData } from '../../utils/encryption';


const MyAccountDropDown = lazy(()=>import('../../components/MyAccountDropDown'));

export default function Header() {
    const primaryMenu  = ROUTES.filter((item)=> item.is_show === "top-menu" );
    const {totalQuantity} =  useSelector((state)=> state.cart);

    const {authToken} =  useSelector((state)=>state.user);
    const [userInfo, setUserInfo] = useState({});

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

    
    
    return (
        <>
            <header className="rs-header-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="header-wrap">
                                <div className="header-col-left">
                                    <Link to="/" className="logo-wrap">
                                        <img src={STATIC_IMAGE.LOGO}/>
                                        <span className="logo-text">RS Production</span>
                                    </Link>
                                    <div className="nav-wrap">
                                        <ul>
                                            {
                                                (Array.isArray(primaryMenu) && primaryMenu.length > 0 ) &&
                                                primaryMenu.map((item, index)=>{
                                                    return(
                                                        <>
                                                            <li key={index}>
                                                                <NavLink
                                                                    to={item.path}
                                                                    className={({ isActive }) =>
                                                                        `nav-link ${isActive ? 'text-danger' : ''}`
                                                                    }
                                                                >
                                                                    {item.title}
                                                                </NavLink>
                                                            </li>
                                                        </>
                                                    )
                                                })
                                            }
                                           
                                        </ul>
                                    </div>
                                </div>
                                <div className="header-col-right">
                                    <div className="acount-wrap">
                                        <ul>
                                            <li>
                                                <Link 
                                                    className="btn-cart" to="/cart">
                                                    <span className="number">{totalQuantity}</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                                                        <path
                                                            d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                    </svg>
                                                </Link>
                                            </li>
                                            <li>
                                                {
                                                    authToken === null ? (
                                                        <>
                                                            <Link className="btn-signin" to="/sign-in">Sign in</Link>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MyAccountDropDown
                                                                user={userInfo}
                                                            />
                                                        </>
                                                    )
                                                }
                                                
                                            </li>
                                        </ul>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
