
import { useState } from "react";

export default function CategoryList({
    categories,
    onHandleCategory,
    activeCategory
}) {
    const [showDropdown, setShowDropdown] = useState(false);

    if (!Array.isArray(categories) || categories.length === 0) {
        return null;
    }

    const visibleCategories = categories.slice(0, 8);
    const remainingCategories = categories.slice(8);

    // Clear category filter
    const handleClearFilter = () => {
        setShowDropdown(false);
        onHandleCategory("", "");
    };

    // Select category
    const handleCategoryClick = (catItem) => {
        setShowDropdown(false);
        onHandleCategory(catItem.parent_slug, catItem.slug);
    };

    return (
        <section className="rs-sub-category-area">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">

                        <div className="rs-sub-category-grid">

                            {visibleCategories.map((catItem) => (
                                <button
                                    type="button"
                                    className="rs-sub-category-link"
                                    key={catItem.id}
                                    onClick={() => handleCategoryClick(catItem)}
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
                                            color: activeCategory === catItem.slug
                                                ? "#f16f21"
                                                : ""
                                        }}
                                    >
                                        {catItem.name}
                                    </span>
                                </button>
                            ))}

                        </div>

                        {/* View More + Clear Filter */}
                        <div className="rs-sub-category-more-menu">
                            <div className="d-inline-flex align-items-center">

                                {remainingCategories.length > 0 && (
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            className="btn btn-link btn-more"
                                            onClick={() =>
                                                setShowDropdown(!showDropdown)
                                            }
                                            aria-expanded={showDropdown}
                                        >
                                            <i class="bi bi-three-dots me-1"></i>
                                            <span>More</span>
                                            
                                        </button>

                                        {showDropdown && (
                                            <div className="dropdown-menu show">
                                                {remainingCategories.map((catItem) => (
                                                    <button
                                                        type="button"
                                                        key={catItem.id}
                                                        className="dropdown-item"
                                                        onClick={() =>
                                                            handleCategoryClick(catItem)
                                                        }
                                                    >
                                                        <span
                                                            className="link-text"
                                                            style={{
                                                                color: activeCategory === catItem.slug
                                                                    ? "#f16f21"
                                                                    : ""
                                                            }}
                                                        >
                                                            {catItem.name}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Clear Filter Icon */}
                                {activeCategory && (
                                    <button
                                        type="button"
                                        className="btn btn-link btn-clear"
                                        onClick={handleClearFilter}
                                        title="Clear Filter"
                                        aria-label="Clear Filter"
                                    >
                                    <i class="bi bi-x"></i> <span>Clear</span>
                                    </button>
                                )}

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
