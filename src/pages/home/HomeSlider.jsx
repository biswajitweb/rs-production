
import React, { lazy } from 'react'
import { STATIC_IMAGE } from '../../utils/staticImage'
import { Link } from 'react-router-dom'


const CustomersView = lazy(()=>
    import('./CustomersView')
);

export default function HomeSlider({
    search,
    setSearch
}) {

    // Combine the default background with search images
    const images = STATIC_IMAGE.searchBanner;

    // Select a random background image on page refresh
   const randomImage =
    images[Math.floor(Math.random() * images.length)];

    return (
        <>
            <section
                className="rs-search-area"
                style={{
                    backgroundImage: `url("${randomImage}")`,
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="search-wrap">

                                <h1 className="rs-heading">
                                    Tribal Culture & Temple Stories in Photos
                                </h1>

                                <p className="rs-description">
                                    Buy original photos of tribal culture, temples,
                                    people, festivals and heritage for commercial,
                                    editorial and creative projects.
                                </p>

                                <div className="input-wrap">
                                    <input
                                        type="text"
                                        name='search'
                                        placeholder="Search photos by place, culture, category or keyword..."
                                        data-mobile-placeholder="Search photos..."
                                        value={search}
                                        onChange={(e)=>setSearch(e.target.value)}
                                        autoComplete='off'
                                    />

                                    <button
                                        type="button"
                                        className="btn-search"
                                        aria-label="Search photos"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="popular-tag">
                                    <Link to="/" className="popular-list">
                                        Birhor
                                    </Link>

                                    <Link to="/" className="popular-list">
                                        Bonda
                                    </Link>

                                    <Link to="/" className="popular-list">
                                        Chuktia Bhunjia
                                    </Link>

                                    <Link to="/" className="popular-list">
                                        Didayi
                                    </Link>

                                    <Link to="/" className="popular-list">
                                        Dongaria
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

    
       


<section className="rs-award-strip">
    <div className="rs-award-track">

       
        <div className="rs-award-item">
            <i className="bi bi-trophy"></i>
            <span>5 Odisha State Film Awards</span>
        </div>
        <span className="rs-award-dot"></span>

        <div className="rs-award-item">
            <i className="bi bi-film"></i>
            <span>Best Producer Award</span>
        </div>
        <span className="rs-award-dot"></span>

        <div className="rs-award-item">
            <i className="bi bi-award"></i>
            <span>Special Jury Award</span>
        </div>
        <span className="rs-award-dot"></span>

        <div className="rs-award-item">
            <i className="bi bi-music-note-beamed"></i>
            <span>Best Sound Recordist</span>
        </div>
        <span className="rs-award-dot"></span>

        <div className="rs-award-item">
            <i className="bi bi-camera-reels"></i>
            <span>Best Editor Award</span>
        </div>
        <span className="rs-award-dot"></span>

        <div className="rs-award-item">
            <i className="bi bi-bookmark-star"></i>
            <span>Best Story Award</span>
        </div>
        <span className="rs-award-dot"></span>

        <div className="rs-award-item">
            <i className="bi bi-person-badge"></i>
            <span>Best Supporting Actor Award</span>
        </div>
        <span className="rs-award-dot"></span>

        <div className="rs-award-item">
            <i className="bi bi-star"></i>
            <span>Odisha Cine Critics Association Award</span>
        </div>
        <span className="rs-award-dot"></span>

        <div className="rs-award-item">
            <i className="bi bi-award"></i>
            <span>Rajiv Gandhi Sadbhavana Award · 2005</span>
        </div>
        <span className="rs-award-dot"></span>

        <div className="rs-award-item">
            <i className="bi bi-mortarboard"></i>
            <span>Senior Fellowship Award · Ministry of Culture, Government of India</span>
        </div>
        <span className="rs-award-dot"></span>

       
        <div className="rs-award-item" aria-hidden="true">
            <i className="bi bi-trophy"></i>
            <span>5 Odisha State Film Awards</span>
        </div>
        <span className="rs-award-dot" aria-hidden="true"></span>

        <div className="rs-award-item" aria-hidden="true">
            <i className="bi bi-film"></i>
            <span>Best Producer Award</span>
        </div>
        <span className="rs-award-dot" aria-hidden="true"></span>

        <div className="rs-award-item" aria-hidden="true">
            <i className="bi bi-award"></i>
            <span>Special Jury Award</span>
        </div>
        <span className="rs-award-dot" aria-hidden="true"></span>

        <div className="rs-award-item" aria-hidden="true">
            <i className="bi bi-music-note-beamed"></i>
            <span>Best Sound Recordist</span>
        </div>
        <span className="rs-award-dot" aria-hidden="true"></span>

        <div className="rs-award-item" aria-hidden="true">
            <i className="bi bi-camera-reels"></i>
            <span>Best Editor Award</span>
        </div>
        <span className="rs-award-dot" aria-hidden="true"></span>

        <div className="rs-award-item" aria-hidden="true">
            <i className="bi bi-bookmark-star"></i>
            <span>Best Story Award</span>
        </div>
        <span className="rs-award-dot" aria-hidden="true"></span>

        <div className="rs-award-item" aria-hidden="true">
            <i className="bi bi-person-badge"></i>
            <span>Best Supporting Actor Award</span>
        </div>
        <span className="rs-award-dot" aria-hidden="true"></span>

        <div className="rs-award-item" aria-hidden="true">
            <i className="bi bi-star"></i>
            <span>Odisha Cine Critics Association Award</span>
        </div>
        <span className="rs-award-dot" aria-hidden="true"></span>

        <div className="rs-award-item" aria-hidden="true">
            <i className="bi bi-award"></i>
            <span>Rajiv Gandhi Sadbhavana Award · 2005</span>
        </div>
        <span className="rs-award-dot" aria-hidden="true"></span>

        <div className="rs-award-item" aria-hidden="true">
            <i className="bi bi-mortarboard"></i>
            <span>Senior Fellowship Award · Ministry of Culture, Government of India</span>
        </div>
        <span className="rs-award-dot" aria-hidden="true"></span>

    </div>
</section>



            <CustomersView/>

      </>  
    )
}