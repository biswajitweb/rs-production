import React, { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';

import { pagination } from '../../api/pagination';
import { service } from '../../api/service';

const Spinner = lazy(() => import('../../components/Spinner'));

export default function Category() {

    const { parentSlug, childSlug } = useParams();

    const categoryParam = {
        ...pagination.HOME_PAGE,
        category: parentSlug,
        ...(childSlug ? { subcategory: childSlug } : {})
    };

    const {
        isPending,
        isError,
        error,
        data: catProductData
    } = useQuery({
        queryKey: ['product-cat', parentSlug, childSlug ?? ''],

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

    const categoryName = formatSlug(childSlug || parentSlug);
    const parentName = formatSlug(parentSlug);

    const seoTitle = `${categoryName} Photography | Tribal Culture`;

    const seoDescription =
        catProductData?.category?.description ||
        `Explore ${categoryName} in ${parentName} photography, cultural heritage, traditions and original photographs from Odisha and India.`;

    const canonicalUrl = childSlug
        ? `https://rabisankar.com/${parentSlug}/${childSlug}`
        : `https://rabisankar.com/${parentSlug}`;

    return (
        <>
            <Helmet>
                <title>{seoTitle}</title>

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