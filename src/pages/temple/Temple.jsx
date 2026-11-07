import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { pagination } from '../../api/pagination';
import { service } from '../../api/service';
import useDebounce from '../../hook/useDebounce';

const SEARCH_DELAY = 500;

export default function Temple() {
    
    const initialParams = pagination.POST_PAGE;

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, SEARCH_DELAY);

    const {
        data,
        error,
        isPending,
        isError,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['temple-list', initialParams, debouncedSearch],

        queryFn: async ({ pageParam }) => {
            const response = await service.other.getTemples({
                ...initialParams,
                page: pageParam,
                search: debouncedSearch
                
            });

            const result = response?.data;

            return {
                temples: Array.isArray(result?.data)
                    ? result.data
                    : [],
                totalRecords: Number(result?.meta?.total_records ?? 0),
                totalPages: Number(result?.meta?.total_pages ?? 0),
                currentPage: pageParam,
            };
        },

        initialPageParam: initialParams.page,

        getNextPageParam: (lastPage) =>
            lastPage.currentPage < lastPage.totalPages
                ? lastPage.currentPage + 1
                : undefined,

        staleTime: 60 * 1000,
        retry: 1,
    });

    const temples =
        data?.pages?.flatMap((page) => page.temples) ?? [];

    const getImage = (temple) => {
        const image =
            temple.featured_image ||
            temple.featured_image_url ||
            temple.image ||
            temple.thumbnail ||
            '';

        if (typeof image === 'string') return image;

        return image?.url || image?.source_url || '';
    };

    const getTitle = (temple) => {
        const title =
            temple.title?.rendered ||
            temple.title ||
            temple.name ||
            'Temple';

        return typeof title === 'string' ? title : 'Temple';
    };

    const getDescription = (temple) => {
        const content =
            temple.excerpt?.rendered ||
            temple.excerpt ||
            temple.description ||
            temple.content?.rendered ||
            temple.content ||
            '';

        if (typeof content !== 'string') return '';

        return content
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;|&#160;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&quot;/gi, '"')
            .replace(/&#8217;|&rsquo;/gi, '’')
            .replace(/&#8216;|&lsquo;/gi, '‘')
            .replace(/&#8220;|&ldquo;/gi, '“')
            .replace(/&#8221;|&rdquo;/gi, '”')
            .replace(/&#8211;|&ndash;/gi, '–')
            .replace(/&#8212;|&mdash;/gi, '—')
            .replace(/&#(\d+);/g, (_, code) =>
                String.fromCodePoint(Number(code))
            )
            .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
                String.fromCodePoint(parseInt(code, 16))
            )
            .replace(/&[a-z]+;/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const getLocation = (temple) => {
        const location =
            temple.location ||
            temple.address ||
            temple.city ||
            temple.temple_location ||
            '';

        return typeof location === 'string' ? location : '';
    };

    const isSearchPending = search.trim() !== debouncedSearch;

    return (
        <>
        <section className="py-3">
            <div className="container">

                {/* Small Search Bar */}
                <div className="d-flex justify-content-end mb-3">
                    <div
                        className="input-group input-group-sm"
                        style={{ maxWidth: '280px' }}
                    >
                        <span className="input-group-text bg-white">
                            <i className="bi bi-search" />
                        </span>

                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search temples..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            aria-label="Search temples"
                        />

                        {search && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setSearch('')}
                                aria-label="Clear search"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Loading Indicator */}
                {isSearchPending && !isPending && (
                    <div className="small text-secondary mb-3">
                        <span className="spinner-border spinner-border-sm me-2" />
                        Searching...
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div
                        className="alert alert-danger d-flex justify-content-between align-items-center gap-3"
                        role="alert"
                    >
                        <span className="small">
                            <i className="bi bi-exclamation-circle me-2" />
                            {error?.message || 'Unable to load temples.'}
                        </span>

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => refetch()}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Loading Skeletons */}
                {isPending && (
                    <div className="row g-3">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                className="col-6 col-md-4 col-lg-3"
                                key={index}
                            >
                                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                                    <div
                                        className="placeholder-glow bg-light"
                                        style={{ height: '125px' }}
                                    >
                                        <span className="placeholder w-100 h-100" />
                                    </div>

                                    <div className="card-body p-3">
                                        <p className="placeholder-glow mb-2">
                                            <span className="placeholder col-9" />
                                        </p>
                                        <p className="placeholder-glow mb-0">
                                            <span className="placeholder col-12" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Temple Cards */}
                {!isPending && !isError && temples.length > 0 && (
                    <div className="row g-3">
                        {temples.map((temple, index) => {
                            const image = getImage(temple);
                            const title = getTitle(temple);
                            const description = getDescription(temple);
                            const location = getLocation(temple);

                            return (
                                <div
                                    className="col-6 col-md-4 col-lg-3"
                                    key={temple.id ?? temple.slug ?? index}
                                >
                                    <article className="card h-100 border-0 shadow-sm overflow-hidden">

                                        {/* Image */}
                                        <div
                                            className="position-relative bg-light overflow-hidden"
                                            style={{ height: '135px' }}
                                        >
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={title}
                                                    className="w-100 h-100"
                                                    style={{
                                                        objectFit: 'cover',
                                                    }}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            ) : (
                                                <div className="h-100 d-flex align-items-center justify-content-center text-secondary">
                                                    <i className="bi bi-image fs-2" />
                                                </div>
                                            )}

                                            <span className="badge text-bg-dark position-absolute top-0 start-0 m-2">
                                                <i className="bi bi-flower1 me-1" />
                                                Heritage
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="card-body p-3 d-flex flex-column">
                                            <h2
                                                className="h6 fw-bold mb-2"
                                                style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    minHeight: '2.5rem',
                                                }}
                                            >
                                                {title}
                                            </h2>

                                            {location && (
                                                <div
                                                    className="small text-secondary mb-2 text-truncate"
                                                    title={location}
                                                >
                                                    <i className="bi bi-geo-alt me-1" />
                                                    {location}
                                                </div>
                                            )}

                                            <p
                                                className="small text-secondary mb-0"
                                                style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    minHeight: '2.5rem',
                                                }}
                                            >
                                                {description ||
                                                    'Explore this sacred place and its heritage.'}
                                            </p>

                                            <div className="border-top mt-3 pt-2 d-flex justify-content-between align-items-center">
                                                <span className="small text-secondary">
                                                    <i className="bi bi-bank me-1" />
                                                    Temple
                                                </span>

                                                <span className="small text-secondary">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!isPending && !isError && temples.length === 0 && (
                    <div className="text-center py-5">
                        <i className="bi bi-search display-5 text-secondary" />

                        <h2 className="h5 fw-bold mt-3">
                            No temples found
                        </h2>

                        <p className="small text-secondary mb-3">
                            Try searching for another temple.
                        </p>

                        {search && (
                            <button
                                type="button"
                                className="btn btn-sm btn-dark"
                                onClick={() => setSearch('')}
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {/* Load More */}
                {!isPending &&
                    !isError &&
                    temples.length > 0 &&
                    hasNextPage && (
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-dark px-4"
                                disabled={isFetchingNextPage || isFetching}
                                onClick={() => fetchNextPage()}
                            >
                                {isFetchingNextPage ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        Load More Temples
                                        <i className="bi bi-arrow-down ms-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                {/* End of Collection */}
                {!isPending &&
                    !isError &&
                    temples.length > 0 &&
                    !hasNextPage && (
                        <p className="small text-secondary text-center mt-4 mb-0">
                            You've reached the end of the collection.
                        </p>
                    )}
            </div>
        </section>

            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <section className='rs-category-grid'>
                            <a class="rs-category-card" href="#" data-discover="true">
                                <div className='rs-category-image'><img alt="Birhor" loading="lazy" src="https://rabisankar.com/live-wp/wp-content/uploads/2026/10/235341564854444444.jpg" /></div>
                                <div class="rs-category-text">
                                    <figcaption>Birhor</figcaption>
                                </div>
                            </a>
                            <a class="rs-category-card" href="#" data-discover="true">
                                <div className='rs-category-image'><img alt="Birhor" loading="lazy" src="https://rabisankar.com/live-wp/wp-content/uploads/2026/10/352353225443532.jpg" /></div>
                                <div class="rs-category-text">
                                    <figcaption>Bonda</figcaption>
                                </div>
                            </a>
                            <a class="rs-category-card" href="#" data-discover="true">
                                <div className='rs-category-image'><img alt="Birhor" loading="lazy" src="https://rabisankar.com/live-wp/wp-content/uploads/2026/10/352352314841433.jpg" /></div>
                                <div class="rs-category-text">
                                    <figcaption>Chuktia Bhunjia</figcaption>
                                </div>
                            </a>
                             <a class="rs-category-card" href="#" data-discover="true">
                                <div className='rs-category-image'><img alt="Birhor" loading="lazy" src="https://rabisankar.com/live-wp/wp-content/uploads/2026/10/2352353525452.jpg" /></div>
                                <div class="rs-category-text">
                                    <figcaption>Didayi</figcaption>
                                </div>
                            </a>
                             <a class="rs-category-card" href="#" data-discover="true">
                                <div className='rs-category-image'><img alt="Birhor" loading="lazy" src="https://rabisankar.com/live-wp/wp-content/uploads/2026/10/235325232552353333.jpg" /></div>
                                <div class="rs-category-text">
                                    <figcaption>Dongaria</figcaption>
                                </div>
                            </a>
                             <a class="rs-category-card" href="#" data-discover="true">
                                <div className='rs-category-image'><img alt="Birhor" loading="lazy" src="https://rabisankar.com/live-wp/wp-content/uploads/2026/10/3463461841464364.jpg" /></div>
                                <div class="rs-category-text">
                                    <figcaption>Hill Kharia</figcaption>
                                </div>
                            </a>
                            <a class="rs-category-card" href="#" data-discover="true">
                                <div className='rs-category-image'><img alt="Birhor" loading="lazy" src="https://rabisankar.com/live-wp/wp-content/uploads/2026/10/4586484415435235.jpg" /></div>
                                <div class="rs-category-text">
                                    <figcaption>Juang</figcaption>
                                </div>
                            </a>
                            <a class="rs-category-card" href="#" data-discover="true">
                                <div className='rs-category-image'><img alt="Birhor" loading="lazy" src="https://rabisankar.com/live-wp/wp-content/uploads/2026/10/2353253252554132.jpg" /></div>
                                <div class="rs-category-text">
                                    <figcaption>Kutia</figcaption>
                                </div>
                            </a>
                        </section>
                    </div>
                </div>
            </div>
                  

</>
    );
}