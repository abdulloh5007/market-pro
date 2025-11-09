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
  comments?: Array<{
    user: string;
    text: string;
    date: string;
    rating: number;
  }>;
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
