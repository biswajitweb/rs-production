
import React from 'react'
import { STATIC_IMAGE } from '../../utils/staticImage'
import { Link } from 'react-router-dom'

export default function HomeSlider() {

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
                                    placeholder="Search photos by place, culture, category or keyword..."
                                    data-mobile-placeholder="Search photos..."
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

    
<div class="rs-rating-bar">

    <div class="rs-rating-label">
        <span>Our customers say</span>
        <strong>Excellent</strong>
    </div>

    <span class="rs-rating-divider"></span>

    <div class="rs-rating-stars" aria-label="4.4 out of 5 stars">
        
        <span class="rs-star">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
        </span>

        
        <span class="rs-star">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
        </span>

        
        <span class="rs-star">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
        </span>

        
        <span class="rs-star">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
        </span>

        
        <span class="rs-star">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-half" viewBox="0 0 16 16">
  <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z"/>
</svg>
        </span>
    </div>

    <p class="rs-rating-text">4.9 out of 5 stars based on <strong>147</strong> reviews </p>

</div>

      </>  
    )
}