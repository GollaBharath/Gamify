import React, { useEffect } from "react";

/**
 * Reusable SEO Helper Component.
 * Dynamically updates the browser tab title and HTML meta description tags.
 */
const SEO = ({ title, description }) => {
  useEffect(() => {
    // Update Title
    const baseTitle = "Gamify - Level Up Your Productivity";
    document.title = title ? `${title} | Gamify` : baseTitle;

    // Update Meta Description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
};

export default SEO;
