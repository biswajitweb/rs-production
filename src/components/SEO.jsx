import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "R S Productions";
const SITE_URL = "https://rabisankar.com";
const DEFAULT_DESCRIPTION =
    "Explore our products and services.";

const SEO = ({
    title,
    description = DEFAULT_DESCRIPTION,
    canonical,
    image,
    noIndex = false,
    type = "website",
}) => {
    // Dynamic page title
    const pageTitle = title
        ? `${title} | ${SITE_NAME}`
        : SITE_NAME;

    // Dynamic canonical URL
    const canonicalUrl = canonical
        ? new URL(canonical, SITE_URL).href
        : undefined;

    // Normalize image URL
    const imageUrl = image
        ? new URL(image, SITE_URL).href
        : undefined;

    const robotsContent = noIndex
        ? "noindex, nofollow"
        : "index, follow";

    return (
        <Helmet>
            {/* Basic SEO */}
            <title>{pageTitle}</title>

            <meta
                name="description"
                content={description}
            />

            <meta
                name="robots"
                content={robotsContent}
            />

            {canonicalUrl && (
                <link
                    rel="canonical"
                    href={canonicalUrl}
                />
            )}

            {/* Open Graph */}
            <meta property="og:type" content={type} />

            <meta
                property="og:site_name"
                content={SITE_NAME}
            />

            <meta
                property="og:title"
                content={pageTitle}
            />

            <meta
                property="og:description"
                content={description}
            />

            {canonicalUrl && (
                <meta
                    property="og:url"
                    content={canonicalUrl}
                />
            )}

            {imageUrl && (
                <meta
                    property="og:image"
                    content={imageUrl}
                />
            )}

            {/* Twitter */}
            <meta
                name="twitter:card"
                content={
                    imageUrl
                        ? "summary_large_image"
                        : "summary"
                }
            />

            <meta
                name="twitter:title"
                content={pageTitle}
            />

            <meta
                name="twitter:description"
                content={description}
            />

            {imageUrl && (
                <meta
                    name="twitter:image"
                    content={imageUrl}
                />
            )}
        </Helmet>
    );
};

export default SEO;
