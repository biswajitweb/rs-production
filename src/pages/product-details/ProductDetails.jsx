import React, { lazy } from 'react'

const SimilarProducts = lazy(()=>import('./SimilarProducts'));

export default function ProductDetails() {
    return (
        <>
            <section className="rs-list-details mt-4">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="rs-list-details-wrap">
                                <div className="header-col-left">
                                    <img src="https://images.pexels.com/photos/36195580/pexels-photo-36195580/free-photo-of-tribal-man-in-traditional-face-paint-and-headdress.jpeg"/>
                                </div>
                                <div className="header-col-right">
                                    <h1 className="p-heading">Traditional Tribal Life in Odisha</h1>
                                    <p className="p-description">A photo of three tribal women wearing traditional dress in a village in Odisha, India.</p>
                                    <h3 className="p-price">₹850.00</h3>
                                    <table className="table  table-borderless p-table">
                                        <tr>
                                            <td>Location</td>
                                            <td>Koraput, Odisha, India</td>
                                        </tr>
                                        <tr>
                                            <td>Date taken</td>
                                            <td>25 July 2026</td>
                                        </tr>
                                        <tr>
                                            <td>Category</td>
                                            <td>Tribal Culture</td>
                                        </tr>
                                        <tr>
                                            <td>File Format</td>
                                            <td>JPG</td>
                                        </tr>
                                        <tr>
                                            <td>Dimensions</td>
                                            <td>6000 x 4000</td>
                                        </tr>
                                        <tr>
                                            <td>File Size</td>
                                            <td>12.4 MB</td>
                                        </tr>
                                        <tr>
                                            <td>Orientation</td>
                                            <td>Landscape</td>
                                        </tr>
                                        <tr>
                                            <td>License</td>
                                            <td>Commercial</td>
                                        </tr>
                                    </table>
                                    <a className="btn btn-buy-now" href="#">
                                        <span>Buy Now</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                                        </svg>
                                    </a>
                                    <p className="p-question">Have a question about this photo?</p>
                                    <h3 className="p-phone">+91-88952-67838</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <SimilarProducts/>
        </>
    )
}
