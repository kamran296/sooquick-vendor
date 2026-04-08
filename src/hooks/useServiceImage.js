import { useMemo } from "react";
// import Placeholder from "../../assets/landing/serviceCategories/homeCleaning.png";
// import { servicesCategoryData, mainCategory } from "../../utils/landingData";

// normalize string for reliable matching
const normalize = (str) => str?.toString().trim().toLowerCase() || "";

export const useServiceImage = (service, categories, imageIndex = 0) => {
  return useMemo(() => {
    if (!service) return null;
    const cleanedService = service.service ? service.service : service;
    /* ------------------------------
       1. Service uploaded images
    -------------------------------- */
    const photos = cleanedService?.documents?.photos || [];

    if (photos.length > 0) {
      const safeIndex =
        typeof imageIndex === "number" &&
        imageIndex >= 0 &&
        imageIndex < photos.length
          ? imageIndex
          : 0;

      const imagePath = photos[safeIndex];

      if (imagePath) {
        // Already absolute URL (CDN / external)
        if (imagePath.startsWith("http")) {
          return imagePath;
        }

        return `${import.meta.env.VITE_API_URL}${imagePath}`;
      }
    }

    const categoryImage = categories?.find(
      (cat) => cat._id === service?.category,
    )?.image;

    if (categoryImage) {
      return `${import.meta.env.VITE_API_URL}${categoryImage}`;
    }

    /* ------------------------------
       4. Default placeholder
    -------------------------------- */
    // return Placeholder;
    return null;
  }, [imageIndex, service?.documents?.photos, service?.category, categories]);
};

export const getServiceImage = (service, categories) => {
  if (!service || !categories) return null;

  const categoryImage = categories.find(
    (cat) => cat._id === service.category,
  )?.image;

  return `${import.meta.env.VITE_API_URL}${categoryImage}` || null;
};
