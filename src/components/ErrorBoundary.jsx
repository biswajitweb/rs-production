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
       <section className="error-section section-b-space">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-10">
                        <div className="error-content">
                            <div className="error-img">
                                <img
                                    src=''
                                    className="img-fluid"
                                    alt="400 Bad Request"
                                />

                                <h2 className="error-bg-text">404</h2>
                            </div>

                            <div className="error-text">
                                <h3>Oops! Not Found</h3>

                                <p>
                                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Please double-check your URL or try going back to our homepage.
                                </p>

                                <div className="error-buttons">
                                    <Link to="/" className="btn theme-btn">
                                        <i className="ri-home-4-line"></i>
                                        {" "}Back to Home
                                    </Link>

                                    <Link to={`/contact-us`} className="btn btn-outline">
                                        <i className="ri-customer-service-2-line"></i>
                                        {" "}Contact Support
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
       </> 
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;