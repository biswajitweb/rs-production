
import React, {
    lazy,
    Suspense,
    useState,
    useEffect,
    useMemo
} from 'react';

import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

import { pagination } from '../../api/pagination';
import { service } from '../../api/service';
import useDebounce from '../../hook/useDebounce';

const Spinner = lazy(() => import('../../components/Spinner'));

export default function Category() {

    const { parentSlug } = useParams();

    // States
    const [search, setSearch] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // Debounce search
    const debounceSearch = useDebounce(search, 500);

    // Redux categories
    const { categories } = useSelector(
        state => state.categories
    );

    // Reset filters when parent category changes
    useEffect(() => {
        setSubcategory('');
        setSearch('');
        setShowDropdown(false);
    }, [parentSlug]);

    // Memoized API parameters
    const categoryParam = useMemo(() => ({
        ...pagination.HOME_PAGE,
        category: parentSlug,
        search: debounceSearch,
        subcategory: subcategory
    }), [
        parentSlug,
        debounceSearch,
        subcategory
    ]);

    // React Query
    const {
        isPending,
        isError,
        error,
        data: catProductData
    } = useQuery({

        queryKey: [
            'product-cat',
            parentSlug,
            debounceSearch,
            subcategory
        ],

        queryFn: async () => {

            const response = await service.product.getAll(
                categoryParam
            );

            const productData = response?.data;

            return {
                products: Array.isArray(productData?.data)
                    ? productData.data
                    : [],

                totalPages: Number(
                    productData?.meta?.total_pages ?? 0
                ),

                currentPage: Number(
                    productData?.meta?.current_page ?? 0
                ),

                category: productData?.category ?? null
            };
        },

        enabled: !!parentSlug,

        gcTime: 10 * 60 * 1000,

        staleTime: 30 * 1000,

        refetchOnWindowFocus: false,

        refetchOnMount: false

    });

    // Product data
    const products = catProductData?.products ?? [];

    // Format slug
    const formatSlug = (slug = '') =>
        slug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());

    const parentName = formatSlug(parentSlug);

    // SEO description
    const seoDescription =
        catProductData?.category?.description ||
        `Explore ${parentName} photography, cultural heritage, traditions and original photographs from Odisha and India.`;

    const canonicalUrl =
        `https://rabisankar.com/${parentSlug}`;

    // Subcategory click
    const onHandleCategoryClick = (catSlug) => {

        setSubcategory(prev =>
            prev === catSlug ? '' : catSlug
        );

        setShowDropdown(false);
    };

    // Clear filters
    const clearFilters = () => {

        setSubcategory('');
        setSearch('');
        setShowDropdown(false);

    };

    // Filter subcategories
    const subcategories = useMemo(() => {

        if (!Array.isArray(categories)) {
            return [];
        }

        return categories.filter(
            cat => cat.parent_slug === parentSlug
        );

    }, [categories, parentSlug]);

    // Visible categories
    const visibleCategories = subcategories.slice(0, 5);

    // Remaining categories
    const remainingCategories = subcategories.slice(5);

    return (

        <>

            {/* SEO */}
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

                            {/* Category Upper Area */}
                            <div className="category-upper-area">

                                <div className="rs-left">

                                    {/* Visible Subcategories */}
                                    <div className="rs-sub-category-grid">

                                        {visibleCategories.map(cat => (

                                            <button
                                                key={cat.id || cat.slug}
                                                type="button"
                                                className={`rs-sub-category-link ${
                                                    subcategory === cat.slug
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    onHandleCategoryClick(cat.slug)
                                                }
                                                aria-pressed={
                                                    subcategory === cat.slug
                                                }
                                            >

                                                <svg
                                                    className="search-icon"
                                                    focusable="false"
                                                    aria-hidden="true"
                                                    viewBox="0 0 32 32"
                                                    fill="currentColor"
                                                >

                                                    <path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" />

                                                </svg>

                                                <span
                                                    className="link-text"
                                                    style={{
                                                        color: subcategory === cat.slug
                                                            ? '#f16f21'
                                                            : ''
                                                    }}
                                                >
                                                    {cat.name}
                                                </span>

                                            </button>

                                        ))}

                                    </div>

                                    {/* More Dropdown */}
                                    {remainingCategories.length > 0 && (

                                        <div className="rs-sub-category-more-menu">

                                            <div className="d-inline-flex align-items-center">

                                                <div className="dropdown">

                                                    <button
                                                        type="button"
                                                        className="btn btn-link btn-more"
                                                        onClick={() =>
                                                            setShowDropdown(prev => !prev)
                                                        }
                                                        aria-expanded={showDropdown}
                                                    >

                                                        <i className="bi bi-three-dots me-1"></i>

                                                        <span>More</span>

                                                    </button>

                                                    {showDropdown && (

                                                        <div className="dropdown-menu show">

                                                            {remainingCategories.map(cat => (

                                                                <button
                                                                    type="button"
                                                                    key={cat.id || cat.slug}
                                                                    className="dropdown-item"
                                                                    onClick={() =>
                                                                        onHandleCategoryClick(cat.slug)
                                                                    }
                                                                >

                                                                    <span
                                                                        className="link-text"
                                                                        style={{
                                                                            color: subcategory === cat.slug
                                                                                ? '#f16f21'
                                                                                : ''
                                                                        }}
                                                                    >
                                                                        {cat.name}
                                                                    </span>

                                                                </button>

                                                            ))}

                                                        </div>

                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    )}

                                    {/* Clear Filter */}
                                    {(subcategory || search.trim()) && (

                                        <div className="active-filter-area">

                                            <button
                                                type="button"
                                                className="btn btn-link clear-filter-btn"
                                                onClick={clearFilters}
                                            >

                                                <i className="bi bi-x"></i>

                                                <span>Clear</span>

                                            </button>

                                        </div>

                                    )}

                                </div>

                                {/* Search Area */}
                                <div className="rs-right">

                                    <div className="input-wrap d-flex align-items-center category-page-search">

                                        <input
                                            type="text"
                                            placeholder={`Search ${parentName} photos...`}
                                            autoComplete="off"
                                            value={search}
                                            name="search"
                                            onChange={e =>
                                                setSearch(e.target.value)
                                            }
                                        />

                                        {/* Clear Search */}
                                        {search.trim() && (

                                            <button
                                                type="button"
                                                className="btn-clear-search"
                                                onClick={() =>
                                                    setSearch('')
                                                }
                                                aria-label="Clear search"
                                                title="Clear search"
                                            >

                                                <i className="bi bi-x"></i>

                                            </button>

                                        )}

                                        {/* Search Button */}
                                        <button
                                            type="button"
                                            className="btn-search"
                                            aria-label="Search photos"
                                        >

                                            <svg
                                                className="search-icon"
                                                focusable="false"
                                                aria-hidden="true"
                                                viewBox="0 0 32 32"
                                                fill="currentColor"
                                            >

                                                <path d="M29.333 27.453l-7.587-7.587c1.399-1.787 2.243-4.067 2.243-6.544 0-5.891-4.776-10.667-10.667-10.667S2.655 7.431 2.655 13.322s4.776 10.667 10.667 10.667c2.477 0 4.757-.844 6.567-2.261l7.563 7.604zm-24-14.12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" />

                                            </svg>

                                        </button>

                                    </div>

                                </div>

                            </div>

                            {/* Products Area */}
                            <div
                                className="col-12"
                                style={{ minHeight: '300px' }}
                            >

                                {/* Loading */}
                                {isPending && (

                                    <Suspense fallback={null}>

                                        <Spinner
                                            centered={true}
                                            label="Loading products..."
                                            color="primary"
                                        />

                                    </Suspense>

                                )}

                                {/* Error */}
                                {isError && (

                                    <div className="text-center py-5">

                                        <h4>
                                            Something went wrong!
                                        </h4>

                                        <p className="text-danger">
                                            {error?.message ||
                                                'Unable to load products.'}
                                        </p>

                                    </div>

                                )}

                                {/* Product Listing */}
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

                                            {(subcategory || search.trim()) && (

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary mt-2"
                                                    onClick={clearFilters}
                                                >
                                                    View All Products
                                                </button>

                                            )}

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