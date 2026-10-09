import React from 'react'
import {STATIC_IMAGE} from '../../utils/staticImage'
import { Link } from 'react-router-dom'

export default function HomeSlider() {
    return (
        <>
            <section 
            className="rs-search-area"
            style={{
                backgroundImage: `url(${STATIC_IMAGE.HOME})`
            }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="search-wrap">
                                <h1 className="rs-heading">Tribal Culture & Temple Stories in Photos</h1>
                                <p className="rs-description">Buy original photos of tribal culture, temples, people, festivals and
                                    heritage for commercial, editorial and creative projects.</p>
                                <div className="input-wrap">
                                    <input type="text" placeholder="Search photos by place, culture, category or keyword..." data-mobile-placeholder="Search photos..."/>
                                    <a href="#" className="btn-search">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            className="bi bi-search" viewBox="0 0 16 16">
                                            <path
                                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                        </svg>
                                    </a>
                                </div>
                                <div className="popular-tag">
                                    <Link to="/" className="popular-list">Birhor</Link>
                                    <Link to="/" className="popular-list">Bonda</Link>
                                    <Link to="/" className="popular-list">Chuktia Bhunjia</Link>
                                    <Link to="/" className="popular-list">Didayi</Link>
                                    <Link to="/" className="popular-list">Dongaria</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
       
        </section>
        </>
    )
}
