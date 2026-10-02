import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
    return (
        <>
        <main className="signup-page">
            <div className="signup-card">
                {/* Logo */}
                <div className="signup-logo">
                    RS
                </div>

                {/* Heading */}
                <div className="text-center mb-4">
                    <h1>Create Your Account</h1>

                    <p className="signup-subtitle">
                        Join our photography community and discover original images.
                    </p>
                </div>

                {/* Signup Form */}
                <form>
                    {/* Full Name */}
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Full Name
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                        />
                    </div>

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
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Create a password"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    {/* Terms */}
                    <div className="form-check mb-4">
                        <input
                            type="checkbox"
                            id="terms"
                            className="form-check-input"
                            required
                        />

                        <label
                            htmlFor="terms"
                            className="form-check-label"
                        >
                            I agree to the{" "}
                            <Link to="/terms-conditions">Terms & Conditions</Link>
                        </label>
                    </div>

                    {/* Signup Button */}
                    <button
                        type="submit"
                        className="signup-btn"
                    >
                        Create Account
                    </button>
                </form>

                {/* Login */}
                <div className="login-text">
                    Already have an account?{" "}
                    <Link to="/sign-in">Login</Link>
                </div>
            </div>
        </main>


        </>
    )
}
