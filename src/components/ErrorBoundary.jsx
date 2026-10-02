import React from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error, errorInfo);

    // You can send this error to Sentry, LogRocket, etc.
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    
    if (this.state.hasError) {
      return (
       <>
          <main class="error-page">
                <div class="error-content">
                    <div class="error-number">404</div>
                    <h1>This Moment Couldn't Be Found</h1>
                    <p>
                        The page you're looking for may have been moved, removed,
                        or is no longer available. Explore our collection of
                        original photographs from Odisha and India.
                    </p>
                    <div class="error-buttons">
                        <Link to="/" class="btn-primary">
                            Go to Homepage
                        </Link>
                        <Link to="/contact-us" class="btn-secondary">
                            Go to Contact
                        </Link>
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

    return this.props.children;
  }
}

export default ErrorBoundary;