import React, { lazy } from 'react';
import { Link } from 'react-router-dom';
import NoProductsFound from './NoProductsFound';

const Spinner = lazy(()=>
    import('../../components/Spinner')
);

export default function HomePageProductListing({
    isLoading,
    products,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    handleLoadMore
}) {
    

    return (
        <>
        <section className='rs-sub-category-area'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='rs-sub-category-grid'>
                            <a href='/tribes/birhor-tribe' className='rs-sub-category-link'>
                                <svg class="search-icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32"><path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path></svg>
                                <span className='link-text'>Birhor Tribe</span>
                            </a>
                            <a href='tribes/bonda-tribe' className='rs-sub-category-link'>
                                <svg class="search-icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32"><path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path></svg>
                                <span className='link-text'>Bonda Tribe</span>
                            </a>
                            <a href='tribes/dangaria-kandha-tribe' className='rs-sub-category-link'>
                                <svg class="search-icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32"><path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path></svg>
                                <span className='link-text'>Dangaria Kandha Tribe</span>
                            </a>
                            <a href='tribes/dangaria-didayi-tribe' className='rs-sub-category-link'>
                                <svg class="search-icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32"><path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path></svg>
                                <span className='link-text'>Didayi Tribe</span>
                            </a>
                            <a href='tribes/dangaria-kharia-tribe' className='rs-sub-category-link'>
                                <svg class="search-icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32"><path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path></svg>
                                <span className='link-text'>Hill Kharia Tribe</span>
                            </a>
                            <a href='tribes/dangaria-juang-tribe' className='rs-sub-category-link'>
                                <svg class="search-icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32"><path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path></svg>
                                <span className='link-text'>Juang Tribe</span>
                            </a>
                                <a href='tribes/dangaria-koya-tribe' className='rs-sub-category-link'>
                                <svg class="search-icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32"><path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path></svg>
                                <span className='link-text'>Koya Tribe</span>
                            </a>
                        </div>
                        <div className='recent-random-wrap'>
                            <a className='recent-item active' href='#'>Most Popular</a>
                            <a className='recent-item' href='#'>Latest</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="rs-listing-area">
            <div className="container">
                <div className="row">
                    <div
                        className="col-12"
                        style={{ minHeight: '300px' }}
                    >
                        {/* Initial Loading */}
                        {isLoading && (
                            <Spinner
                                centered={true}
                                label="Loading products..."
                                color="primary"
                            />
                        )}

                        {/* Error */}
                        {isError && !isLoading && (
                            <div className="text-center py-5">
                                <p className="text-danger mb-3">
                                    Failed to load products.
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Product Grid */}
                        {!isError && (
                            <div
                                className="rs-grid"
                                style={{
                                    opacity: isLoading ? 0.2 : 1,
                                }}
                            >
                                {products.map((item, index) => (
                                    <Link
                                        to={`/product-details/${item.id}/variants/${item.variant_id}`}
                                        className="rs-card"
                                        key={
                                            item.variant_id
                                                ? `${item.id}-${item.variant_id}`
                                                : item.id ?? index
                                        }
                                    >
                                        <div className='rs-image'>
                                            <img
                                            src={item?.image?.src}
                                            alt={
                                                item?.name ||
                                                'Product'
                                            }
                                            loading="lazy"
                                        />
                                        </div>
                                        <div className="action-area">
                                            <figcaption>
                                                {item?.name}
                                            </figcaption>

                                            <div className="btn-buy-icon">
                                                <svg
                                                    className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall"
                                                    focusable="false"
                                                    aria-hidden="true"
                                                    viewBox="0 0 32 32"
                                                    aria-label="download-icon"
                                                >
                                                    <path d="M24.933 15.733l-1.867-1.867-5.733 5.733V3.332h-2.667v16.267l-5.733-5.733-1.867 1.867 8.933 8.933 8.933-8.933zm-22.266 11.6V30h26.667v-2.667H2.667z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Load More Loading */}
                        {isFetchingNextPage && (
                            <div className="mt-4">
                                <Spinner
                                    centered={true}
                                    color="primary"
                                    label="Loading more products..."
                                />
                            </div>
                        )}

                        {/* Load More Button */}
                        {!isLoading &&
                            !isError &&
                            products.length > 0 &&
                            hasNextPage && (
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        className="btn rs-grid-loader"
                                        onClick={handleLoadMore}
                                        disabled={isFetchingNextPage}
                                    >
                                        {isFetchingNextPage
                                            ? 'Loading...'
                                            : 'Load more'}
                                    </button>
                                </div>
                            )}

                        {/* No Products */}
                        {!isLoading &&
                            !isError &&
                            products.length === 0 && (
                                <NoProductsFound/>
                            )}

                        
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}
