import React from 'react';
import {STATIC_IMAGE} from '../../utils/staticImage';
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
    return (
        <>
<main class="login-page">
    <div class="login-card">

        
       <div className="login-logo">
                <img src={STATIC_IMAGE.LOGO}/>
        </div>
        
        <div class="text-center">
            <h1>Forgot Password?</h1>
            <p class="login-subtitle">
                Enter your registered email address to reset your password.
            </p>
        </div>

        
        <div class="mb-3">
            <label for="email" class="form-label">
                Email Address
            </label>

            <input
                type="email"
                id="email"
                name="email"
                class="form-control"
                placeholder="Enter your email address"
                autocomplete="email"
                required
            />
        </div>

       
        <button
            type="submit"
            class="btn custom-btn btn-primary login-btn"
        >
            Send Reset Link
        </button>

        
        <div class="register-text mt-3 text-center">
            Remember your password?
            <Link className='ms-2' to="/sign-in">
                            Back to Login
                        </Link>
        </div>

    </div>
</main>
        </>
    )
}
