import React, { lazy } from 'react'
import {STATIC_IMAGE} from '../../utils/staticImage'
import { Link } from 'react-router-dom';


const SecurePayment = lazy(()=>
    import('../../components/SecurePayment')
);

// Combine the default background with search images
const images = STATIC_IMAGE.footerBanner;

// Select a random background image on page refresh
const randomImage = images[Math.floor(Math.random() * images.length)];

export default function Footer() {
    return (
        <>
        <SecurePayment/>



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
