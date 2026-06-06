import React, { useEffect } from "react";

export const SEOHelper = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Gamify`;
    }
    if (description) {
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
};
