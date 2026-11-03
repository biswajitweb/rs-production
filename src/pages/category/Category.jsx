
import React, { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { pagination } from '../../api/pagination';
import { service } from '../../api/service';

const Spinner = lazy(() =>
    import('../../components/Spinner')
);

export default function Category() {

    const { parentSlug, childSlug } = useParams();

    const categoryParam = {
        ...pagination.HOME_PAGE,
        category: parentSlug,
        subcategory: childSlug
    };

    const {
        isPending,
        isError,
        error,
        data: catProductData
    } = useQuery({
        queryKey: ['product-cat', parentSlug, childSlug],

        queryFn: async () => {
            const response = await service.product.getAll(categoryParam);
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
                )
            };
        },

        enabled: !!parentSlug && !!childSlug,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    const products = catProductData?.products ?? [];

    return (
        <>
            <div className="sections mt-4">
                <section className="rs-listing-area">
                    <div className="container">
                        <div className="row">
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
                                        <h4>Something went wrong!</h4>
                                        <p className="text-danger">
                                            {error?.message || 'Unable to load products.'}
                                        </p>
                                    </div>
                                )}

                                {/* Products */}
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
                                                            <svg
                                                                className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall"
                                                                focusable="false"
                                                                aria-hidden="true"
                                                                viewBox="0 0 32 32"
                                                            >
                                                                <path d="M24.933 15.733l-1.867-1.867-5.733 5.733V3.332h-2.667v16.267l-5.733-5.733-1.867 1.867 8.933 8.933 8.933-8.933zm-22.266 11.6V30h26.667v-2.667H2.667z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                    ) : (

                                        /* Data Not Found */
                                        <div className="text-center py-5">
                                            <i
                                                className="bi bi-box-seam"
                                                style={{
                                                    fontSize: '70px',
                                                    color: '#adb5bd'
                                                }}
                                            ></i>

                                            <h4 className="mt-3">No Products Found</h4>

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
