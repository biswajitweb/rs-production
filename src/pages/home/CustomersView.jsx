import React from 'react';

const START_REVIEWS = 10;
const START_DATE = new Date('2026-10-25T00:00:00');

const getReviewCount = () => {
    const currentDate = new Date();

    const elapsedTime = currentDate.getTime() - START_DATE.getTime();
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

    const weeksPassed = Math.max(
        0,
        Math.floor(elapsedTime / millisecondsPerWeek)
    );

    return START_REVIEWS + weeksPassed;
};

const Star = ({ half = false }) => (
    <span className="rs-star" aria-hidden="true">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
        >
            {half ? (
                <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027l3.918 2.013-.748-4.264 3.17-3.023-4.405-.626L8 2.223z" />
            ) : (
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
            )}
        </svg>
    </span>
);

export default function CustomersView() {
    const reviewCount = getReviewCount();
    const rating = 4.9;

    return (
        <div className="rs-rating-bar">
            <div className="rs-rating-label">
                <span>Our customers say</span>
                <strong>Excellent</strong>
            </div>

            <span className="rs-rating-divider" />

            <div
                className="rs-rating-stars"
                role="img"
                aria-label={`${rating} out of 5 stars`}
            >
                <Star />
                <Star />
                <Star />
                <Star />
                <Star half />
            </div>

            <p className="rs-rating-text">
                {rating} out of 5 stars based on{' '}
                <strong>{reviewCount}</strong> reviews
            </p>
        </div>
    );
}