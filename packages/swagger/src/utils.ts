export const ALLOWED_METHODS = [
  "GET",
  "PUT",
  "POST",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
  "TRACE",
] as const;

export const toOpenAPIPath = (path: string): string => {
  return path
    .split("/")
    .map((p) => {
      let t = p;
      if (t.startsWith(":")) {
        t = `{${t.slice(1, t.length)}}`;
      }
      return t;
    })
    .join("/");
};
