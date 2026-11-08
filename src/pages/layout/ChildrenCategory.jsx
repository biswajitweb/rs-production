import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ChildrenCategory({
    parentId,
    categories = [],
    onClose
}) {

    const navigate = useNavigate();
    const location = useLocation();
    const childCategories = categories.filter(
        (item) => Number(item.id) === Number(parentId)
    );
    if (childCategories[0]?.children.length === 0) {
        return null;
    }
    const patrentPath = childCategories[0]?.slug;

   
    
    
    const handleCategoryClick = (slug) => {
        navigate(`/${patrentPath}/${slug}`);
        onClose?.();
    };
    

    return (
        <>
            {childCategories[0]?.children.map((item) => {
                const categoryPath = `/${patrentPath}/${item.slug}`;
                const isActive = location.pathname === categoryPath;
                return (
                    <>
                        <li key={item.id}>
                            <button
                                    type="button"
                                    className={`dropdown-item ${isActive ? "active" : ""}`}
                                    onClick={() => handleCategoryClick(item.slug)}
                                >
                                    {item.name}
                                </button>
                        </li>
                    </>
                )

                
            })}
        </>
    );
}