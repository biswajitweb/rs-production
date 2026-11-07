import React from 'react';
import './PostStats.css';


export default function PostStats({
    likes = 0,
    views = 0,
    productId,
    onLike,
    isLiked = false,
}) {
    return (
        <div className="rs-stats">
            <button
                type="button"
                className={`rs-like ${Number(likes) === 1 ? 'active' : ''}`}
                onClick={()=>onLike(productId)}
                aria-label={`${isLiked ? 'Unlike' : 'Like'} this post`}
                aria-pressed={isLiked}
            >
                <i
                    className={`bi ${
                        isLiked ? 'bi-suit-heart-fill' : 'bi-suit-heart'
                    }`}
                />
                <span>{likes}</span>
            </button>

            <div className="rs-view d-none">
                <i className="bi bi-eye" aria-hidden="true" />
                <span>{views}</span>
            </div>
        </div>
    );
}