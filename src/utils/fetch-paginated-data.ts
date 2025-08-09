type FetchPaginatedDataResult<T> = {
  [key: string]: T[];
} & {
  totalPages: number;
};

export const fetchPaginatedData = async <T>(
  endpoint: string,
  key: string,
  page = 1,
  limit = 6,
  options?: RequestInit,
): Promise<FetchPaginatedDataResult<T>> => {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 3000}`
        : "http://localhost:3000";
        
    const url = new URL(`${baseUrl}/api/${endpoint}`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const res = await fetch(url.toString(), {
      cache: "no-store",
      next: { tags: [key] },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `خطا در دریافت ${key}`);
    }

    const data = await res.json();

    if (!data || !data[key] || typeof data.totalPages !== "number") {
      throw new Error(`فرمت ${key} نامعتبر است`);
    }

    return {
      [key]: data[key],
      totalPages: data.totalPages,
    } as FetchPaginatedDataResult<T>;
  } catch (error) {
    console.error(`Fetch ${key} error:`, error);
    throw new Error(
      error instanceof Error ? error.message : `خطای ناشناخته در دریافت ${key}`,
    );
  }
};
