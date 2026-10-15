/**
 * useEquipmentImages - Hook for fetching and managing equipment images
 *
 * Features:
 * - Prevents flickering with ID-based deduplication
 * - Handles carousel state (activeIndex)
 * - Provides navigation methods (next, previous)
 * - Caches images to prevent refetching
 *
 * Usage:
 *   const {
 *     images,
 *     loading,
 *     activeIndex,
 *     next,
 *     previous,
 *     goToIndex
 *   } = useEquipmentImages(equipmentId, baseImageUrl);
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { queryAPI } from '../utils/QueryGraph';

/**
 * Build the correct image URL from an asset ID or URL
 * @param {string} assetIdOrUrl - Asset ID or full URL
 * @param {string} baseImageUrl - Base URL for images (fallback)
 * @returns {string} Complete image URL
 */
const buildImageUrl = (assetIdOrUrl, baseImageUrl) => {
  if (!assetIdOrUrl) return '';

  const trimmed = assetIdOrUrl.trim();

  // If it's already a full URL, use it (with possible modifications)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // For Janes asset URLs, they should work directly
    // Some CDNs may need .jpg extension, others don't
    // Check if it already has an image extension
    if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmed)) {
      return trimmed;
    }
    // For Janes assets, the URL format is typically: https://asset.janes.com/image/{assetId}
    // These work without .jpg extension
    if (trimmed.includes('asset.janes.com')) {
      return trimmed;
    }
    // For other URLs, return as-is
    return trimmed;
  }

  // It's just an asset ID - construct the URL
  const assetId = trimmed.split("/").pop();

  if (!baseImageUrl) {
    // Fallback to Janes asset URL format
    return `https://asset.janes.com/image/${assetId}`;
  }

  // Normalize the baseImageUrl
  const normalizedBaseUrl = baseImageUrl
    .replace(/\/images\/?$/, '')  // Remove trailing /images or /images/
    .replace(/\/$/, '');           // Remove any trailing slash

  return `${normalizedBaseUrl}/images/${assetId}.jpg`;
};

/**
 * Parse image assets from API response
 * @param {Array} resultRows - Raw API response
 * @param {string} baseImageUrl - Base URL for images
 * @returns {Array} Parsed image objects
 */
const parseImageResponse = (resultRows, baseImageUrl) => {
  if (!resultRows || !Array.isArray(resultRows)) return [];

  const allImages = [];

  resultRows.forEach((row) => {
    const body = row[0];
    const assets = row[1];

    if (!body || !assets || !Array.isArray(assets)) return;

    const htmlDom = new DOMParser().parseFromString(body, "text/html");

    assets.forEach((asset) => {
      const props = asset.properties || asset;
      if (!props.id) return;

      const assetIdOrUrl = props.id.trim();
      const assetId = assetIdOrUrl.split("/").pop();

      // Find caption from HTML data attributes
      const captionElement = Array.from(htmlDom.querySelectorAll("data"))
        .find((e) => {
          const value = e.getAttribute("value");
          return value && value.split("/").pop() === assetId;
        });

      const caption = captionElement?.getAttribute("data-caption") || '';

      // Build the image URL correctly
      const imgPath = buildImageUrl(assetIdOrUrl, baseImageUrl);

      allImages.push({
        id: assetId,
        label: caption,
        imgPath: imgPath,
        altImgPath: imgPath
      });
    });
  });

  return allImages;
};

/**
 * Custom hook for managing equipment images
 * @param {string} equipmentId - Equipment ID to fetch images for
 * @param {string} baseImageUrl - Base URL for constructing image paths
 * @returns {Object} Image state and navigation methods
 */
export function useEquipmentImages(equipmentId, baseImageUrl) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track previous ID to prevent duplicate fetches (anti-flickering)
  const prevIdRef = useRef(null);
  // Track if component is mounted
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Fetch images when equipment ID changes
  useEffect(() => {
    // Skip if no ID or baseImageUrl
    if (!equipmentId || !baseImageUrl) {
      return;
    }

    // Skip if same ID (prevents flickering on re-renders)
    if (equipmentId === prevIdRef.current) {
      return;
    }

    // Update ref and reset state
    prevIdRef.current = equipmentId;
    setLoading(true);
    setImages([]);
    setActiveIndex(0);
    setError(null);

    queryAPI("images", equipmentId)
      .then((res) => {
        if (!mountedRef.current) return;

        const parsedImages = parseImageResponse(res?.resultRows, baseImageUrl);
        setImages(parsedImages);
      })
      .catch((err) => {
        if (!mountedRef.current) return;

        console.error("Error fetching equipment images:", err);
        setError(err.message || 'Failed to fetch images');
      })
      .finally(() => {
        if (mountedRef.current) {
          setLoading(false);
        }
      });
  }, [equipmentId, baseImageUrl]);

  // Navigation methods
  const next = useCallback(() => {
    setActiveIndex((prev) => Math.min(prev + 1, images.length - 1));
  }, [images.length]);

  const previous = useCallback(() => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToIndex = useCallback((index) => {
    if (index >= 0 && index < images.length) {
      setActiveIndex(index);
    }
  }, [images.length]);

  const reset = useCallback(() => {
    setImages([]);
    setActiveIndex(0);
    setError(null);
    prevIdRef.current = null;
  }, []);

  // Computed values
  const computed = useMemo(() => ({
    hasImages: images.length > 0,
    totalImages: images.length,
    currentImage: images[activeIndex] || null,
    isFirst: activeIndex === 0,
    isLast: activeIndex === images.length - 1,
    canGoNext: activeIndex < images.length - 1,
    canGoPrevious: activeIndex > 0
  }), [images, activeIndex]);

  return {
    // State
    images,
    loading,
    error,
    activeIndex,

    // Navigation
    next,
    previous,
    goToIndex,
    setActiveIndex,
    reset,

    // Computed
    ...computed
  };
}

export default useEquipmentImages;
