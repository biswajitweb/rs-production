
import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "R S Productions";
const SITE_URL = "https://rabisankar.com/staging/";

const SEO = ({
    title,
    description = "Explore our products and services.",
    canonical,
    image,
    noIndex = false,
}) => {
    const pageTitle = title
        ? `${title} | ${SITE_NAME}`
        : SITE_NAME;

    const canonicalUrl = canonical
        ? `${SITE_URL}${canonical}`
        : undefined;

    return (
        <Helmet>
            <title>{pageTitle}</title>

            <meta
                name="description"
                content={description}
            />

            <meta
                name="robots"
                content={
                    noIndex
                        ? "noindex, nofollow"
                        : "index, follow"
                }
            />

            {canonicalUrl && (
                <link
                    rel="canonical"
                    href={canonicalUrl}
                />
            )}

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description"  content={description} />

            {image && (
                <meta
                    property="og:image"
                    content={image}
                />
            )}

            <meta
                name="twitter:card"
                content={image ? "summary_large_image" : "summary"}
            />

            <meta
                name="twitter:title"
                content={pageTitle}
            />

            <meta
                name="twitter:description"
                content={description}
            />

            {image && (
                <meta
                    name="twitter:image"
                    content={image}
                />
            )}
        </Helmet>
    );
};

export default SEO;
