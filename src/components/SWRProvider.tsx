"use client";
import { SWRConfig } from "swr";
import { fetcher } from "@/util";

export const SWRProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (err) => {
          console.error("SWR Error:", err);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
