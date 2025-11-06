export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount: number | null;
  memory?: string;
  color?: string;
  photos: string[];
  model: string;
  rating: number;
  comments?: Array<{
    user: string;
    text: string;
    date: string;
  }>;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    // В серверных компонентах Next.js используем абсолютный URL или относительный путь
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window === "undefined" ? "http://localhost:3000" : "");
    const url = baseUrl ? `${baseUrl}/products.json` : "/products.json";
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();

    // Ищем товар по ID во всех категориях
    for (const category in data) {
      for (const subCategory of data[category]) {
        const product = subCategory.products?.find((p: Product) => p.id === id);
        if (product) {
          return product;
        }
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
    // В серверных компонентах Next.js используем абсолютный URL или относительный путь
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window === "undefined" ? "http://localhost:3000" : "");
    const url = baseUrl ? `${baseUrl}/products.json` : "/products.json";
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
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

