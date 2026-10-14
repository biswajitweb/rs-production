import React from 'react'
import {STATIC_IMAGE} from '../../utils/staticImage'
import { Link } from 'react-router-dom';

    // Combine the default background with search images
   const images = STATIC_IMAGE.footerBanner;

    // Select a random background image on page refresh
    const randomImage =
    images[Math.floor(Math.random() * images.length)];

export default function Footer() {
    return (
        <>

<section class="rs-trust-section">
    <div class="rs-trust-container">
        <div class="rs-trust-grid">
            <div class="rs-trust-card">
                <div class="rs-trust-icon rs-icon-green">
                    <svg viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="1.8"
                         stroke-linecap="round" stroke-linejoin="round"
                         aria-hidden="true">
                        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/>
                        <path d="m9 12 2 2 4-4"/>
                    </svg>
                </div>
                <h3>Secure Website</h3>
                <p>Protected connection with HTTPS.</p>
            </div>

      
            <div class="rs-trust-card">
                <div class="rs-trust-icon rs-icon-orange">
                    <svg viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="1.8"
                         stroke-linecap="round" stroke-linejoin="round"
                         aria-hidden="true">
                        <rect x="2" y="5" width="20" height="14" rx="3"/>
                        <path d="M2 10h20"/>
                        <path d="M6 15h4"/>
                    </svg>
                </div>
                <h3>Secure Payments</h3>
                <p>Payments processed securely by our payment gateway.</p>
            </div>

            
            <div class="rs-trust-card">
                <div class="rs-trust-icon rs-icon-blue">
                    <svg viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="1.8"
                         stroke-linecap="round" stroke-linejoin="round"
                         aria-hidden="true">
                        <path d="M14 4h-4L8 7H4a2 2 0 0 0-2 2v10
                                 a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9
                                 a2 2 0 0 0-2-2h-4l-2-3Z"/>
                        <circle cx="12" cy="13" r="4"/>
                    </svg>
                </div>
                <h3>Original Photography</h3>
                <p>Authentic photographs with clear usage licenses.</p>
            </div>

          
            <div class="rs-trust-card">
                <div class="rs-trust-icon rs-icon-purple">
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
                <h3>Privacy Protected</h3>
                <p>Customer information handled according to our privacy policy.</p>
            </div>

           
            <div class="rs-trust-card">
                <div class="rs-trust-icon rs-icon-teal">
                    <svg viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="1.8"
                         stroke-linecap="round" stroke-linejoin="round"
                         aria-hidden="true">
                        <path d="M3 14v-3a9 9 0 0 1 18 0v3"/>
                        <path d="M5 14h2a2 2 0 0 1 2 2v3
                                 a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5
                                 a2 2 0 0 1 2-2Z"/>
                        <path d="M19 14h-2a2 2 0 0 0-2 2v3
                                 a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5
                                 a2 2 0 0 0-2-2Z"/>
                    </svg>
                </div>
                <h3>Customer Support</h3>
                <p>Contact us for purchase and download assistance.</p>
            </div>

        </div>
    </div>
</section>


            <footer 
                className="rs-footer-area"
                style={{
                    backgroundImage: `url("${randomImage}")`
                }}
                >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="upper-area">
                                <div className="rs-footer-widget info-wrap">
                                    <div className="footer-logo">
                                        <img src={STATIC_IMAGE.LOGO}/>
                                    </div>
                                    <div className="contact-info">
                                        <ul>
                                            <li>
                                                <div className="rs-heading">Address</div>
                                                <div className="rs-description">R S Productions (Rabi Sankar Rath), 
                                                    <br/>Plat No: 611/998 (1st Floor), BJB Nagar, Bhubaneswar, Odisha</div>
                                            </li>
                                            <li>
                                                <div className="rs-heading">Phone</div>
                                                <div className="rs-description">+91-88952-67838</div>
                                            </li>
                                            <li>
                                                <div className="rs-heading">Email</div>
                                                <div className="rs-description">rsrath13@gmail.com</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="rs-footer-widget tribal-wrap">
                                    <ul>
                                        <li><a href="#">Birhor</a></li>
                                        <li><a href="#">Bonda</a></li>
                                        <li><a href="#">Chuktia Bhunjia</a></li>
                                        <li><a href="#">Didayi</a></li>
                                        <li><a href="#">Dongaria</a></li>
                                        <li><a href="#">Hill Kharia</a></li>
                                        <li><a href="#">Juang</a></li>
                                        <li><a href="#">Kutia</a></li>
                                        <li><a href="#">Lanjia</a></li>
                                        <li><a href="#">Lodha</a></li>
                                        <li><a href="#">Mankridia</a></li>
                                        <li><a href="#">Paudi Bhuyan</a></li>
                                        <li><a href="#">Saura</a></li>
                                    </ul>
                                </div>
                                <div className="rs-footer-widget temple-wrap">
                                    <ul>
                                        <li><a href="#">Lingaraj Temple</a></li>
                                        <li><a href="#">Mukteswara Temple</a></li>
                                        <li><a href="#">Rajarani Temple</a></li>
                                        <li><a href="#">Ananta Vasudeva Temple</a></li>
                                        <li><a href="#">Brahmeswara Temple</a></li>
                                        <li><a href="#">Parsurameswara Temple</a></li>
                                        <li><a href="#">Kedargauri Temple</a></li>
                                        <li><a href="#">Baitala Deula</a></li>
                                        <li><a href="#">Bhaskareswara Temple</a></li>
                                        <li><a href="#">Meghesvara Temple</a></li>
                                        <li><a href="#">Chausathi Yogini</a></li>
                                    </ul>
                                </div>
                                <div className="rs-footer-widget term-wrap">
                                    <ul>
                                        <li><Link to="/about-us">About Us</Link></li>
                                        <li><Link to="/contact-us">Contact Us</Link></li>
                                        <li><Link to="/help">Help</Link></li>
                                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                        <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
                                        <li><Link to="/license-agreement">License Agreement</Link></li>
                                        <li><Link to="/refund-cancellation-policy">Refund & Cancellation Policy</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="lower-area">
                                © 2026 R S Productions. All rights reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
