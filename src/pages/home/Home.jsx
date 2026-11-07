import React, { lazy, useState, useEffect, useRef, Suspense } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { pagination } from '../../api/pagination';
import { service } from '../../api/service';
import useDebounce from '../../hook/useDebounce';

const HomeSlider = lazy(() => import('./HomeSlider'));
const HomePageProductListing = lazy(
    () => import('./HomePageProductListing')
);

export default function Home() {
    const initialParams = pagination.HOME_PAGE;

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    // Sentinel element for automatic pagination
    const loadMoreRef = useRef(null);

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ['home-products', initialParams, debouncedSearch],

        initialPageParam: initialParams.page ?? 1,

        queryFn: async ({ pageParam, signal }) => {
            const requestParams = {
                ...initialParams,
                page: pageParam,
                search: debouncedSearch,
            };

            const response = await service.product.getAll(
                requestParams,
                { signal }
            );

            const productData = response?.data;

            return {
                products: Array.isArray(productData?.data)
                    ? productData.data
                    : [],
                totalPages: Number(
                    productData?.meta?.total_pages ?? 0
                ),
                currentPage: Number(pageParam),
            };
        },

        getNextPageParam: (lastPage) => {
            if (
                lastPage.currentPage >= lastPage.totalPages ||
                lastPage.products.length === 0
            ) {
                return undefined;
            }

            return lastPage.currentPage + 1;
        },

        staleTime: 60 * 1000,
    });

    const products =
        data?.pages?.flatMap((page) => page.products) ?? [];

    // Automatically fetch products when the sentinel enters view
    useEffect(() => {
        const target = loadMoreRef.current;

        if (
            !target ||
            !hasNextPage ||
            isFetchingNextPage ||
            isLoading ||
            isError
        ) {
            return;
        }

        // Graceful fallback for older browsers
        if (!('IntersectionObserver' in window)) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    fetchNextPage();
                }
            },
            {
                root: null,
                rootMargin: '300px 0px',
                threshold: 0,
            }
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        fetchNextPage,
    ]);

    return (
        <>
            <Suspense fallback={null}>
                <HomeSlider
                    search={search}
                    setSearch={setSearch}
                />
            </Suspense>

            <Suspense
                fallback={
                    null
                }
            >
                <HomePageProductListing
                    isLoading={isLoading}
                    products={products}
                    isFetchingNextPage={isFetchingNextPage}
                    isError={isError}
                    error={error}
                />
            </Suspense>

            {/* Automatic pagination trigger; no Load More button */}
            <div
                ref={loadMoreRef}
                className="text-center py-4"
                aria-live="polite"
            >
                {isFetchingNextPage && (
                    <span></span>
                )}
            </div>
        </>
    );
}
