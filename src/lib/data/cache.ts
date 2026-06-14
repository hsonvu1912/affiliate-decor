import { unstable_cache } from "next/cache";
import {
  loadCategories,
  loadCollections,
  loadProducts,
  loadSettings,
  loadStyles,
} from "@/lib/data/source";

// Cache tags. The revalidate webhook busts these when the owner edits a tab.
// `all` is busted on any content change to cover cross-references.
export const TAGS = {
  products: "products",
  collections: "collections",
  categories: "categories",
  styles: "styles",
  settings: "settings",
  all: "sheet-data",
} as const;

// 600s fallback revalidation in case a webhook is ever missed.
const REVALIDATE = 600;

export const getProductsCached = unstable_cache(loadProducts, ["products"], {
  tags: [TAGS.products, TAGS.all],
  revalidate: REVALIDATE,
});

export const getCollectionsCached = unstable_cache(loadCollections, ["collections"], {
  tags: [TAGS.collections, TAGS.all],
  revalidate: REVALIDATE,
});

export const getCategoriesCached = unstable_cache(loadCategories, ["categories"], {
  tags: [TAGS.categories, TAGS.all],
  revalidate: REVALIDATE,
});

export const getStylesCached = unstable_cache(loadStyles, ["styles"], {
  tags: [TAGS.styles, TAGS.all],
  revalidate: REVALIDATE,
});

export const getSettingsCached = unstable_cache(loadSettings, ["settings"], {
  tags: [TAGS.settings, TAGS.all],
  revalidate: REVALIDATE,
});
