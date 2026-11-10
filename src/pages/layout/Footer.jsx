import React, { lazy } from 'react'
import {STATIC_IMAGE} from '../../utils/staticImage'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import categories from '../../../public/data/categories.json';

const CustomersView = lazy(()=>
    import('../home/CustomersView')
);

const SecurePayment = lazy(()=>
    import('../../components/SecurePayment')
);

export default function Footer() {
    const {categories : stateCategories} =  useSelector(state => state.categories);
    const selectedSlugs = ["tribes", "temples"];
    const filteredCategories = categories
    .filter(item => selectedSlugs.includes(item.slug));

    const footerMenu = filteredCategories?.map((item)=>{
        const subCat = (stateCategories || []).filter(
            (subItem) => subItem.parent_slug === item.slug
        );
        return {
            ...item,
            hasChildren : subCat.length > 0,
            subCat
        }
    });
    
    return (
        <>
        <SecurePayment/>


        <section className='customer-view-area'>
            <CustomersView/>
        </section>
        <footer 
            className="rs-footer-area"
            style={{
                backgroundImage: `url("${STATIC_IMAGE.FOOTER}")`
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

                                        <li>
                                            <div className="rs-heading">Social Media</div>
                                            <div className="rs-description">
                                                <a href="https://www.youtube.com/@RabiSankarFilms" target="_blank" rel="noopener noreferrer" > YouTube</a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {
                                Array.isArray(footerMenu) && footerMenu.length > 0 &&
                                footerMenu.map((item, index)=>{
                                    return(
                                        <>
                                            <div 
                                                className="rs-footer-widget tribal-wrap"
                                                key={index}
                                                >
                                                    <ul>
                                                        {
                                                            item.subCat?.map((sunCatItem, subIndex)=>{
                                                                return (
                                                                    <>
                                                                        <li
                                                                            key={subIndex}
                                                                        >
                                                                            <Link 
                                                                                to={`/${item.slug}?subCat=${sunCatItem.slug}`}>
                                                                                { sunCatItem.name }
                                                                            </Link>
                                                                        </li>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                            </div>
                                        </>
                                    )
                                })
                            }
                            
                            <div className="rs-footer-widget term-wrap">
                                <ul>
                                    <li><Link to="/about">About</Link></li>
                                    <li><Link to="/contact">Contact Us</Link></li>
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
