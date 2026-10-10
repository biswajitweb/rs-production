import React, { lazy, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { validateField } from "../../utils/validateField";
import { service } from '../../api/service';
import { FORM_ERROR_STYLE } from '../../utils/formStyles';
import { encryptData } from '../../utils/encryption';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../features/auth/authSlice';


const Spinner = lazy(()=>import('../../components/Spinner'));

export default function Login() {

    const {authToken} =  useSelector((state)=>state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    useEffect(()=>{
        if(authToken !== null) {
            navigate(`/my-account`);
        }
    }, [authToken])

    const initialFormData  = {
        email : "",
        password : ""
    }; 

    const initialTouched  = {
        email : false,
        password: false
    };

    const [fromData, setFromData] = useState(initialFormData );
    const [touched, setTouched] = useState(initialTouched);
    const REQURIED_FIELD = Object.keys(initialFormData);
    const [errors, setErrors] = useState({});
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    
    

    const handleFromData = (e)=>{
        const {name, value} = e.target;
        setFromData((prev)=>({
            ...prev,
            [name] : value
        }));
    }

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({
        ...prev,
        [name]: true,
        }));
        setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
        }));
    };

    const onHandleLogin = async()=>{
        setLoginErrorMessage('');
        // Mark all fields as touched
        const touchedFields  = REQURIED_FIELD.reduce((acc, field )=>{
            acc[field] = true;
            return acc;
        }, {});
        setTouched(touchedFields)
        const isValid = REQURIED_FIELD.reduce((isValid, field)=>{
            return isValid && fromData[field] !== '' 
        }, true);

        const newErrors = {
            email: validateField("email", fromData.email),
            password: validateField("password", fromData.password),
        };

        setErrors(newErrors);
        const hasError = Object.values(newErrors).some((error) => error);
        if (hasError) return;
        try {
            if(isValid)  {
                setLoader(true);
                const playload = {... fromData};
                const response = await service.customer.login(playload);
                const loginResponse = response.data;
                const userData =  await encryptData(loginResponse);
                if(userData) {
                    sessionStorage.setItem('auth' , userData);
                    sessionStorage.setItem('role', "CUSTOMER");
                    dispatch(
                        loginSuccess({
                            auth : userData,
                            role : "CUSTOMER"
                        })
                    );
                    const redirectPath = location.state?.from || "/my-account";
                    navigate(redirectPath, {
                        replace : true
                    });
                }
            }
        } catch (error) {
            if(error) {
                setLoginErrorMessage(error.message);
            }
        } finally {
            setLoader(false);
        }
        
    }
    
    return (
       <>
        <main className="login-page">
            <div className="login-card">
                {/* Logo */}
                <div className="login-logo">
                    RS
                </div>

                {/* Heading */}
                <div className="text-center">
                    <h1>Welcome Back</h1>
                    <p className="login-subtitle">
                        Login to explore and manage your photo collection.
                    </p>
                </div>

                {/* Login Form */}
                {
                    loginErrorMessage && <span className='text-danger'>{loginErrorMessage}</span>
                }
               
                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email Address
                    </label>

                    <input
                        type="email"
                        id="login"
                        name="email"
                        className="form-control"
                        autoComplete="off"
                        value={fromData.login}
                        onChange={handleFromData}
                        onBlur={handleBlur}
                        style={
                            fromData.login === "" && touched.login
                            ? FORM_ERROR_STYLE
                            : {}
                        }
                    />
                   {errors.email && (
                        <small className="text-danger">{errors.email}</small>
                    )}
                    
                </div>

                {/* Password */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>

                        <a
                            href="/forgot-password"
                            className="forgot-password"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        autoComplete="off"
                        value={fromData.password}
                        onChange={handleFromData}
                        onBlur={handleBlur}
                        style={
                            fromData.password === "" && touched.password
                            ? FORM_ERROR_STYLE
                            : {}
                        }
                    />
                    {errors.password && (
                        <small className="text-danger">{errors.password}</small>
                    )}
                    
                </div>

                {/* Remember Me */}
                <div className="form-check mb-4">
                    <input
                        type="checkbox"
                        id="remember"
                        name="remember"
                        className="form-check-input"
                    />

                    <label
                        htmlFor="remember"
                        className="form-check-label"
                    >
                        Remember me
                    </label>
                </div>

                {/* Login Button */}
                <button
                    type="button"
                    className="btn btn-primary login-btn"
                    onClick={onHandleLogin}
                    disabled={loader}
                    style={{
                        cursor: loader ? "none" : "pointer"
                    }}
                >
                    {loader  && <Spinner color= "white" size='sm' />}
                    Login
                </button>
                

                {/* Register */}
                <div className="register-text mt-3">
                    Don't have an account?{" "}
                    <Link to="/sign-up">
                        Create an account
                    </Link>
                </div>
            </div>
        </main>
       </>
    )
}
