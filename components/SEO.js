import React from "react";
import { Platform } from "react-native";
import { Helmet } from "react-helmet";

/**
 * SEO Component for React Native Web
 *
 * This component adds SEO metadata for web views of the React Native app
 * Only renders on web platforms (not on native iOS/Android)
 *
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.image - OG image URL (optional)
 * @param {string} props.url - Canonical URL (optional)
 */
export const SEO = ({
  title = "The Wall - A Holy Revolution for the LGBTQ+ Community",
  description = "The Wall is a holy revolution that provides a place to love, pray for, and evangelize the LGBTQ+ community through our Wailing Wall and Testimony Wall initiatives.",
  image,
  url,
}) => {
  // Only render on web platforms
  if (Platform.OS !== "web") {
    return null;
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      {url && <meta property="twitter:url" content={url} />}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {image && <meta property="twitter:image" content={image} />}

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
};

export default SEO;
