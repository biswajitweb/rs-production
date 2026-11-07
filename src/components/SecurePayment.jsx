import React from 'react'

export default function SecurePayment() {
    return (
        <>
            <section className="rs-trust-section">
                <div className="container">
                    <div className="rs-trust-grid">
                        <div className="rs-trust-card">
                            <div className="rs-trust-icon rs-icon-green">
                                <svg viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="1.8"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    aria-hidden="true">
                                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>
                            <div className='rs-trust-content'>
                                <h3>Secure Website</h3>
                                <p>Protected connection with HTTPS.</p>
                            </div>
                        </div>

                
                        <div className="rs-trust-card">
                            <div className="rs-trust-icon rs-icon-orange">
                                <svg viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="1.8"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    aria-hidden="true">
                                    <rect x="2" y="5" width="20" height="14" rx="3" />
                                    <path d="M2 10h20" />
                                    <path d="M6 15h4" />
                                </svg>
                            </div>
                            <div className='rs-trust-content'>
                                <h3>Secure Payments</h3>
                                <p>Payments processed securely by our payment gateway.</p>
                            </div>
                        </div>

                        
                        <div className="rs-trust-card">
                            <div className="rs-trust-icon rs-icon-blue">
                                <svg viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="1.8"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    aria-hidden="true">
                                    <path d="M14 4h-4L8 7H4a2 2 0 0 0-2 2v10
                                            a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9
                                            a2 2 0 0 0-2-2h-4l-2-3Z"/>
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </div>
                            <div className='rs-trust-content'>
                                <h3>Original Photography</h3>
                                <p>Authentic photographs with clear usage licenses.</p>
                            </div>
                        </div>

                    
                        <div className="rs-trust-card">
                            <div className="rs-trust-icon rs-icon-purple">
                                <svg viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="1.8"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    aria-hidden="true">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    <circle cx="12" cy="16" r="1"/>
                                    <path d="M12 17v2"/>
                                </svg>
                            </div>
                            <div className='rs-trust-content'>
                                <h3>Privacy Protected</h3>
                                <p>Customer information handled according to our privacy policy.</p>
                            </div>
                        </div>

                    
                        <div className="rs-trust-card">
                            <div className="rs-trust-icon rs-icon-teal">
                                <svg viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="1.8"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    aria-hidden="true">
                                    <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
                                    <path d="M5 14h2a2 2 0 0 1 2 2v3
                                            a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5
                                            a2 2 0 0 1 2-2Z"/>
                                    <path d="M19 14h-2a2 2 0 0 0-2 2v3
                                            a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5
                                            a2 2 0 0 0-2-2Z"/>
                                </svg>
                            </div>
                            <div className='rs-trust-content'>
                                <h3>Customer Support</h3>
                                <p>Contact us for purchase and download assistance.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}
