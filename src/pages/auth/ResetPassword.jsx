import React from 'react';
import {STATIC_IMAGE} from '../../utils/staticImage';

export default function ResetPassword() {
    return (
        <>
           
<main class="login-page">
    <div class="login-card">

        
      <div className="login-logo">
                          <img src={STATIC_IMAGE.LOGO}/>
                      </div>

        
        <div class="text-center">
            <h1>Reset Password</h1>
            <p class="login-subtitle">
                Create a new password for your account.
            </p>
        </div>

        
        <div class="mb-3">
            <label for="password" class="form-label">
                New Password
            </label>

            <input
                type="password"
                id="password"
                name="password"
                class="form-control"
                placeholder="Enter new password"
                autocomplete="new-password"
                required
            />
        </div>

        
        <div class="mb-3">
            <label for="confirmPassword" class="form-label">
                Confirm New Password
            </label>

            <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                class="form-control"
                placeholder="Confirm new password"
                autocomplete="new-password"
                required
            />
        </div>

        
        <button
            type="button"
            class="btn custom-btn btn-primary login-btn"
        >
            Reset Password
        </button>

        
        <div class="register-text mt-3">
            Remember your password?
            <a className='ms-2' href="login.html">Back to Login</a>
        </div>

    </div>
</main>
    
        </>
    )
}
