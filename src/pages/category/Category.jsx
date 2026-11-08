import React, { lazy, Suspense, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';

import { pagination } from '../../api/pagination';
import { service } from '../../api/service';
import useDebounce from '../../hook/useDebounce';

const Spinner = lazy(() => import('../../components/Spinner'));

export default function Category() {

    const { parentSlug } = useParams();
    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search, 500);

    const categoryParam = {
        ...pagination.HOME_PAGE,
        category: parentSlug,
        search : debounceSearch
       
    };

    const {
        isPending,
        isError,
        error,
        data: catProductData
    } = useQuery({
        queryKey: ['product-cat', parentSlug, debounceSearch],

        queryFn: async () => {
            const response = await service.product.getAll(categoryParam);

            const productData = response?.data;

            return {
                products: Array.isArray(productData?.data)
                    ? productData.data
                    : [],
                totalPages: Number(productData?.meta?.total_pages ?? 0),
                currentPage: Number(productData?.meta?.current_page ?? 0),
                category: productData?.category ?? null
            };
        },

        // API runs when parentSlug exists, even without childSlug
        enabled: !!parentSlug,

        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    const products = catProductData?.products ?? [];

    const formatSlug = (slug = '') =>
        slug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());

   
    const parentName = formatSlug(parentSlug);

  

    const seoDescription =
        catProductData?.category?.description ||
        `Explore  in ${parentName} photography, cultural heritage, traditions and original photographs from Odisha and India.`;

    const canonicalUrl = `https://rabisankar.com/${parentSlug}`;

    return (
        <>
            <Helmet>
                <title>{parentName}</title>

                <meta
                    name="description"
                    content={seoDescription}
                />

                <link
                    rel="canonical"
                    href={canonicalUrl}
                />

                <meta
                    name="robots"
                    content="index, follow"
                />
            </Helmet>

            <div className="sections mt-4">
                
                <section className="rs-listing-area">
                    <div className="container">
                        <div className="row">
                        <div className='category-upper-area'>
                            <div class="rs-sub-category-grid">
                                    <button type="button" class="rs-sub-category-link">
                                        <svg class="search-icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32" fill="currentColor">
                                        <path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path>
                                        </svg>
                                        <span class="link-text">Birhor Tribe</span>
                                    </button>
                                    <button type="button" class="rs-sub-category-link">
                                        <svg class="search-icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32" fill="currentColor">
                                        <path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path>
                                        </svg>
                                        <span class="link-text">Bonda Tribe</span>
                                    </button>
                                    <button type="button" class="rs-sub-category-link">
                                        <svg class="search-icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32" fill="currentColor">
                                        <path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path>
                                        </svg>
                                        <span class="link-text">Chuktia Bhunjia</span>
                                    </button>
                                    </div>
                                    <div
                                    className="input-wrap d-flex align-items-center category-page-search"

                                >
                                    <input
                                        type="text"
                                        placeholder={`Search ${parentName} photos...`}
                                        autoComplete="off"
                                        value={search}
                                        name="search"
                                        onChange={(e) => setSearch(e.target.value)}
                                    />

                                    {/* Clear Search */}
                                    {search.trim() && (
                                        <button
                                            type="button"
                                            className="btn-clear-search"
                                            onClick={() => setSearch('')}
                                            aria-label="Clear search"
                                            title="Clear search"
                                        >
                                            <i class="bi bi-x"></i>
                                        </button>
                                    )}

                                    {/* Search Button */}
                                    <button
                                        type="button"
                                        className="btn-search"
                                        aria-label="Search photos"
                                    >
                                        <svg class="search-icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32" fill="currentColor"><path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path></svg>
                                    </button>
                                </div>
                        </div>

                            


                            <div
                                className="col-12"
                                style={{ minHeight: '300px' }}
                            >
                                {isPending && (
                                    <Suspense fallback={null}>
                                        <Spinner
                                            centered={true}
                                            label="Loading products..."
                                            color="primary"
                                        />
                                    </Suspense>
                                )}

                                {isError && (
                                    <div className="text-center py-5">
                                        <h4>Something went wrong!</h4>
                                        <p className="text-danger">
                                            {error?.message || 'Unable to load products.'}
                                        </p>
                                    </div>
                                )}

                                {!isPending && !isError && (
                                    products.length > 0 ? (
                                        <div className="rs-grid">
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
                                                    <div className="rs-image">
                                                        <img
                                                            src={item?.image?.src}
                                                            alt={item?.name || 'Product'}
                                                            loading="lazy"
                                                        />
                                                    </div>

                                                    <div className="action-area">
                                                        <figcaption>
                                                            {item?.name}
                                                        </figcaption>

                                                        <div className="btn-buy-icon">
                                                            <i className="bi bi-download"></i>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i
                                                className="bi bi-box-seam"
                                                style={{
                                                    fontSize: '70px',
                                                    color: '#adb5bd'
                                                }}
                                            />

                                            <h4 className="mt-3">
                                                No Products Found
                                            </h4>

                                            <p className="text-muted">
                                                No products are available in this category.
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}