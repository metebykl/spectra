import { OutgoingHttpHeaders } from "node:http";

export const buildOutgoingHttpHeaders = (
  headers: Headers | HeadersInit | null | undefined
): OutgoingHttpHeaders => {
  const res: OutgoingHttpHeaders = {};
  if (!(headers instanceof Headers)) {
    headers = new Headers(headers ?? undefined);
  }

  const cookies = [];
  for (const [k, v] of headers) {
    if (k === "set-cookie") {
      cookies.push(v);
    } else {
      res[k] = v;
    }
  }

  if (cookies.length > 0) {
    res["set-cookie"] = cookies;
  }

  res["content-type"] ??= "text/plain; charset=UTF-8";

  return res;
};
