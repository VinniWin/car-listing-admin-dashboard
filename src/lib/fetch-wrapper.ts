type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  next?: NextFetchRequestConfig;
};

type FetchResponse<T> = {
  data?: T;
  error?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
const isProduction = process.env.NODE_ENV === "production";

export async function fetchWrapper<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  try {
    const response = await fetch(`${isProduction ? "" : baseUrl}${endpoint}`, {
      method: options.method ?? "GET",
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      credentials: options.credentials ?? "include",
      next: options.next,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData?.error || "Something went wrong!",
      };
    }

    const data: T = await response.json();
    return { data };
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: "An unexpected error occurred." };
  }
}
