import React, { lazy, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';

import { pagination } from '../../api/pagination';
import { service } from '../../api/service';
import useDebounce from '../../hook/useDebounce'



const HomeSlider = lazy(()=>
    import('./HomeSlider')
);
const HomePageProductListing = lazy(()=>
    import('./HomePageProductListing')
);

export default function Home() {
    const initialParams = pagination.HOME_PAGE;
    const [search, setSearch] = useState("");

    // Wait 500ms after user stops typing
    const debouncedSearch = useDebounce(search, 500);
    
    
    const {
        data,
        error,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
    } = useInfiniteQuery({
        queryKey: ['home-products', initialParams, debouncedSearch],

        queryFn: async ({ pageParam = initialParams.page }) => {
            const requestParams = {
                ...initialParams,
                page: pageParam,
                search : search
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
        <>
            <HomeSlider
                search = {search}
                setSearch = {setSearch}
            />
            <HomePageProductListing
                isLoading = {isLoading}
                products = {products}
                isFetchingNextPage = {isFetchingNextPage}
                hasNextPage = {hasNextPage}
                fetchNextPage = {fetchNextPage}
                isError = {isError}
                handleLoadMore = {handleLoadMore}
            />
        </>
    )
}
