
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

 <section className='rs-category-area'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='upper-area'>
                            {/* <div className='category-heading'>Always AI free</div> */}
                            <CustomersView/>
                        </div>
                        <div className='rs-category-grid'>
                            <a href='/tribes' className='rs-category-link'>
                                <picture className='rs-category-img'><img src='https://images.ctfassets.net/hrltx12pl8hq/2ppk3Ug2z6oFMZY5z8WXnx/75af41f13939954c93de0ff8c1972612/shutterstock_1922207966.jpg?fit=fill&w=640&h=360' /></picture>
                                <div className='rs-category-text'>Tribal Heritage</div>
                            </a>
                             <a href='/templates' className='rs-category-link'>
                                <picture className='rs-category-img'><img src='https://images.ctfassets.net/hrltx12pl8hq/1qoVFqqABKxtFRMkUh0v6l/6a9bbdc723ac373f4e44400de87997b2/shutterstock_1734177410__1_.jpg?fit=fill&w=640&h=360' /></picture>
                                <div className='rs-category-text'>Sacred Places</div>
                            </a>
                             <a href='/books' className='rs-category-link'>
                                <picture className='rs-category-img'><img src='https://images.ctfassets.net/hrltx12pl8hq/go6z2gBaTMDvTrtoOipOw/3b9d21ff7003ca392a2daeb569d629fc/shutterstock_1802211250.jpg?fit=fill&w=640&h=360' /></picture>
                                <div className='rs-category-text'>Books & Stories</div>
                            </a>
                             <a href='/contact-us' className='rs-category-link'>
                                <picture className='rs-category-img'><img src='https://images.ctfassets.net/hrltx12pl8hq/ss2daMHu3XewLBroGgbtp/6cf4fbe1fc297c20ee6cd2bb303e12a1/shutterstock_2390735237.jpg?fit=fill&w=640&h=360' /></picture>
                                <div className='rs-category-text'>Custom Photography</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>


      </>  
    )
}