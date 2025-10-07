export const getTodayLocalizedISO = () =>
  new Date().toLocaleDateString("en-CA"); // en-CA locale uses ISO format

// export const fetcher = (url: string) =>
//   fetch(url, { cache: "no-store" }).then((res) => res.json());

export const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();
  return json;
};

export const underscoresToSpaces = (str: string) => str.replace("_", " ");
