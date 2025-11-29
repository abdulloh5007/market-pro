export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount: number | null;
  memory?: string | string[];
  color?: string | string[];
  size?: string[];
  photos: string[];
  model: string;
  rating: number;
  variantPricing?: {
    [variant: string]: number;
  };
  comments?: Array<{
    user: string;
    text: string;
    date: string;
    rating: number;
  }>;
}

export function calculatePrice(
  product: Product,
  selectedVariants?: { memory?: string; color?: string; size?: string }
): number {
  // If no variant pricing defined, return base price
  if (!product.variantPricing || !selectedVariants) {
    return product.price;
  }

  // Check if memory variant has specific pricing
  if (selectedVariants.memory && product.variantPricing[selectedVariants.memory]) {
    return product.variantPricing[selectedVariants.memory];
  }

  // Check if color variant has specific pricing
  if (selectedVariants.color && product.variantPricing[selectedVariants.color]) {
    return product.variantPricing[selectedVariants.color];
  }

  // Check if size variant has specific pricing
  if (selectedVariants.size && product.variantPricing[selectedVariants.size]) {
    return product.variantPricing[selectedVariants.size];
  }

  return product.price;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    let url = "/products.json";

    // Если код выполняется на сервере — делаем абсолютный путь
    if (typeof window === "undefined") {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        `https://${process.env.VERCEL_URL}` ||
        "http://localhost:3000";

      url = `${base}/products.json`;
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();

    for (const category in data) {
      for (const subCategory of data[category]) {
        const product = subCategory.products?.find(
          (p: Product) => p.id === id
        );
        if (product) return product;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProductsByCatalog(catalog: string): Promise<Product[]> {
  try {
    let url = "/products.json";

    // Абсолютный — только на сервере
    if (typeof window === "undefined") {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        `https://${process.env.VERCEL_URL}` ||
        "http://localhost:3000";

      url = `${base}/products.json`;
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();

    const catalogProducts: Product[] = [];
    if (data[catalog]) {
      data[catalog].forEach((subCategory: any) => {
        if (subCategory.products) {
          catalogProducts.push(...subCategory.products);
        }
      });
    }

    return catalogProducts;
  } catch (error) {
    console.error("Error fetching products by catalog:", error);
    return [];
  }
}

export type CatalogType = "electronics" | "clothes" | "sport" | "books";

export interface Category {
  category: string;
  products: Product[];
}

export async function getCategoriesByCatalog(catalog: string): Promise<Category[]> {
  try {
    let url = "/products.json";

    // Абсолютный — только на сервере
    if (typeof window === "undefined") {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        `https://${process.env.VERCEL_URL}` ||
        "http://localhost:3000";

      url = `${base}/products.json`;
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();

    return data[catalog] || [];
  } catch (error) {
    console.error("Error fetching categories by catalog:", error);
    return [];
  }
}

export async function getProductsByCatalogAndCategory(catalog: string, category: string): Promise<Product[]> {
  try {
    let url = "/products.json";

    // Абсолютный — только на сервере
    if (typeof window === "undefined") {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        `https://${process.env.VERCEL_URL}` ||
        "http://localhost:3000";

      url = `${base}/products.json`;
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();

    const catalogProducts: Product[] = [];
    if (data[catalog]) {
      if (category === "all") {
        // Return all products from catalog
        data[catalog].forEach((subCategory: any) => {
          if (subCategory.products) {
            catalogProducts.push(...subCategory.products);
          }
        });
      } else {
        // Return products from specific category
        const categoryData = data[catalog].find((cat: any) => cat.category === category);
        if (categoryData && categoryData.products) {
          catalogProducts.push(...categoryData.products);
        }
      }
    }

    return catalogProducts;
  } catch (error) {
    console.error("Error fetching products by catalog and category:", error);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    let url = "/products.json";

    // Абсолютный — только на сервере
    if (typeof window === "undefined") {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        `https://${process.env.VERCEL_URL}` ||
        "http://localhost:3000";

      url = `${base}/products.json`;
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();

    const allProducts: Product[] = [];
    for (const category in data) {
      data[category].forEach((subCategory: any) => {
        if (subCategory.products) {
          allProducts.push(...subCategory.products);
        }
      });
    }

    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
