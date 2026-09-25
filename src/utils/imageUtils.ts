// High quality HTTPS curated placeholders from Unsplash and Picsum
export const CATEGORY_PLACEHOLDERS: Record<string, string[]> = {
  'real-estate': [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  ],
  'vehicles': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  ],
  'electronics': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
  ],
  'services': [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  ],
  'jobs': [
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
  ],
  'projects': [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  ],
  'home-furniture': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  ],
  'fashion': [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  ],
  'default': [
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    'https://picsum.photos/seed/souqmaroc1/800/600',
    'https://picsum.photos/seed/souqmaroc2/800/600',
  ],
};

/**
 * Returns a fallback HTTPS image from Unsplash or Picsum.
 */
export function getFallbackImage(categoryId?: string, index: number = 0): string {
  const list = (categoryId && CATEGORY_PLACEHOLDERS[categoryId]) || CATEGORY_PLACEHOLDERS['default'];
  const safeIndex = Math.abs(index) % list.length;
  return list[safeIndex] || `https://picsum.photos/seed/souq_${categoryId || 'item'}_${index}/800/600`;
}

/**
 * Ensures a valid HTTPS image URL.
 * If the input is empty or a broken local bundle path (e.g. /src/assets...),
 * it returns a real Unsplash/Picsum placeholder.
 */
export function getSafeImageUrl(
  url?: string | null,
  categoryId?: string,
  index: number = 0
): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return getFallbackImage(categoryId, index);
  }

  const trimmed = url.trim();

  // If local /src/ path or empty placeholder, replace with real Unsplash image
  if (trimmed.startsWith('/src/assets/images/') || trimmed.startsWith('src/assets/images/')) {
    return getFallbackImage(categoryId, index);
  }

  // Ensure HTTPS
  if (trimmed.startsWith('http://')) {
    return trimmed.replace('http://', 'https://');
  }

  return trimmed;
}

/**
 * Extracts and sanitizes an array of images from a listing object.
 * Always guarantees at least 2 images for clean carousel/gallery display.
 */
export function getSanitizedImages(
  listing: { images?: string[]; imageUrl?: string; categoryId?: string }
): string[] {
  const images: string[] = [];

  if (Array.isArray(listing.images) && listing.images.length > 0) {
    listing.images.forEach((img, idx) => {
      const safe = getSafeImageUrl(img, listing.categoryId, idx);
      if (safe) images.push(safe);
    });
  }

  if (listing.imageUrl && typeof listing.imageUrl === 'string') {
    const safeUrl = getSafeImageUrl(listing.imageUrl, listing.categoryId, 0);
    if (!images.includes(safeUrl)) {
      images.unshift(safeUrl);
    }
  }

  // If still empty or only 1 image, guarantee at least 2 distinct high-quality images
  if (images.length === 0) {
    images.push(getFallbackImage(listing.categoryId, 0));
    images.push(getFallbackImage(listing.categoryId, 1));
  } else if (images.length === 1) {
    images.push(getFallbackImage(listing.categoryId, 1));
  }

  return images;
}
