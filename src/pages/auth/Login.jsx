import React from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
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
                <form>
                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
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
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
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
                        type="submit"
                        className="login-btn"
                    >
                        Login
                    </button>
                </form>

                {/* Divider */}
                <div className="divider">
                    <span>OR</span>
                </div>

                {/* Register */}
                <div className="register-text">
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
