import React from 'react'

export default function Shop() {
    return (
        <>

        <main className="login-page d-none">
                <div className="login-card"> {/* Logo */} <div className="login-logo"> RS </div> {/* Heading */} <div className="text-center"> <h1>Welcome Back</h1> <p className="login-subtitle"> Login to explore and manage your photo collection. </p> </div> {/* Login Form */} <form> {/* Email */} <div className="mb-3"> <label htmlFor="email" className="form-label"> Email Address </label> <input type="email" id="email" name="email" className="form-control" placeholder="Enter your email" autoComplete="email" required /> </div> {/* Password */} <div className="mb-3"> <div className="d-flex justify-content-between align-items-center"> <label htmlFor="password" className="form-label"> Password </label> <a href="/forgot-password" className="forgot-password"> Forgot Password? </a> </div> <input type="password" id="password" name="password" className="form-control" placeholder="Enter your password" autoComplete="current-password" required /> </div> {/* Remember Me */} <div className="form-check mb-4"> <input type="checkbox" id="remember" name="remember" className="form-check-input" /> <label htmlFor="remember" className="form-check-label"> Remember me </label> </div> {/* Login Button */} <button type="submit" className="login-btn"> Login </button> </form> {/* Divider */} <div className="divider"> <span>OR</span> </div> {/* Register */} <div className="register-text"> Don't have an account?{" "} <a href="/register"> Create an account </a> </div> </div> </main>

                <main className="signup-page d-none"> <div className="signup-card"> {/* Logo */} <div className="signup-logo"> RS </div> {/* Heading */} <div className="text-center mb-4"> <h1>Create Your Account</h1> <p className="signup-subtitle"> Join our photography community and discover original images. </p> </div> {/* Signup Form */} <form> {/* Full Name */} <div className="mb-3"> <label htmlFor="name" className="form-label"> Full Name </label> <input type="text" id="name" name="name" className="form-control" placeholder="Enter your full name" autoComplete="name" required /> </div> {/* Email */} <div className="mb-3"> <label htmlFor="email" className="form-label"> Email Address </label> <input type="email" id="email" name="email" className="form-control" placeholder="Enter your email" autoComplete="email" required /> </div> {/* Password */} <div className="mb-3"> <label htmlFor="password" className="form-label"> Password </label> <input type="password" id="password" name="password" className="form-control" placeholder="Create a password" autoComplete="new-password" required /> </div> {/* Confirm Password */} <div className="mb-3"> <label htmlFor="confirmPassword" className="form-label"> Confirm Password </label> <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" placeholder="Confirm your password" autoComplete="new-password" required /> </div> {/* Terms */} <div className="form-check mb-4"> <input type="checkbox" id="terms" className="form-check-input" required /> <label htmlFor="terms" className="form-check-label"> I agree to the{" "} <a href="/terms">Terms & Conditions</a> </label> </div> {/* Signup Button */} <button type="submit" className="signup-btn"> Create Account </button> </form> {/* Login */} <div className="login-text"> Already have an account?{" "} <a href="/login"> Login </a> </div> </div> </main>
           
           
          


            <main class="error-page d-none">
                <div class="error-content">
                    <div class="error-number">404</div>
                    <h1>This Moment Couldn't Be Found</h1>
                    <p>
                        The page you're looking for may have been moved, removed,
                        or is no longer available. Explore our collection of
                        original photographs from Odisha and India.
                    </p>
                    <div class="error-buttons">
                        <a href="/" class="btn-primary">
                            Go to Homepage
                        </a>
                        <a href="/" class="btn-secondary">
                            Go to Contact
                        </a>
                    </div>

                    <div class="error-note">
                        Discover tribal culture, temples, festivals, people and
                        everyday life through original photography.
                    </div>
                </div>

            </main>
        </>
    )
}
