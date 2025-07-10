"use client";

import { fetchWrapper } from "@/lib/fetch-wrapper";
import { useEffect, useState } from "react";

type TokenPayload = {
  email: string;
  name: string;
};
export function useAuthUser() {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await fetchWrapper<{ data: TokenPayload }>(
        "/api/me"
      );

      if (error) {
        console.warn("Auth error:", error);
        setUser(null);
      } else {
        setUser(data?.data ?? null);
      }

      setIsPending(false);
    };

    fetchUser();
  }, []);

  return { user, isPending };
}
