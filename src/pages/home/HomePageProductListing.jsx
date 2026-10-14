import React from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

import { pagination } from '../../api/pagination';
import { service } from '../../api/service';
import Spinner from '../../components/Spinner';

export default function HomePageProductListing() {
    const initialParams = pagination.HOME_PAGE;

    const {
        data,
        error,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
    } = useInfiniteQuery({
        queryKey: ['home-products', initialParams],

        queryFn: async ({ pageParam = initialParams.page }) => {
            const requestParams = {
                ...initialParams,
                page: pageParam,
            };

            const response =
                await service.product.getAll(requestParams);

            const productData = response?.data;

            return {
                products: Array.isArray(productData?.data)
                    ? productData.data
                    : [],

                totalRecords: Number(
                    productData?.meta?.total_records ?? 0
                ),

                totalPages: Number(
                    productData?.meta?.total_pages ?? 0
                ),

                currentPage: pageParam,
            };
        },

        initialPageParam: initialParams.page,

        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.currentPage;
            const totalPages = lastPage.totalPages;

            if (currentPage >= totalPages) {
                return undefined;
            }

            return currentPage + 1;
        },
    });

    /**
     * Flatten all pages into one product array
     */
    const products =
        data?.pages?.flatMap((page) => page.products) ?? [];

    const total =
        data?.pages?.[0]?.totalRecords ?? 0;

    const handleLoadMore = () => {
        if (!hasNextPage || isFetchingNextPage) {
            return;
        }

        fetchNextPage();
    };

    return (
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
                                color="success"
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
                                        <img
                                            src={item?.image?.src}
                                            alt={
                                                item?.name ||
                                                'Product'
                                            }
                                            loading="lazy"
                                        />

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
                                <div className="text-center py-5">
                                    <p className="mb-0">
                                        No products found.
                                    </p>
                                </div>
                            )}

                        
                    </div>
                </div>
            </div>
        </section>
    );
}
