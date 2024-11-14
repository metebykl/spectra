import { Context } from "./context";

type Cookie = Record<string, string>;

export type CookieOptions = {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
};

interface GetCookie {
  (c: Context): Cookie;
  (c: Context, name: string): string | undefined;
}

export const getCookie: GetCookie = (c, name?) => {
  const cookie = c.req.header("Cookie");
  if (!cookie) {
    return undefined;
  }

  const cookies = parse(cookie);
  if (typeof name === "string") {
    return cookies[name];
  }

  return cookies as any;
};

const parse = (cookie: string, name?: string): Cookie => {
  // cookie string should consist of one char minimum, plus '='
  if (cookie.length < 2) {
    return {};
  }

  // requested name should exist in the cookie string
  if (name && cookie.indexOf(name) === -1) {
    return {};
  }

  const pairs = cookie.trim().split(";");
  const parsed: Cookie = {};

  for (let pair of pairs) {
    pair = pair.trim();

    const equalIdx = pair.indexOf("=");
    if (equalIdx === -1) continue;

    const cookieName = pair.substring(0, equalIdx).trim();
    if (name && cookieName !== name) continue;

    let cookieValue = pair.substring(equalIdx + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }

    parsed[cookieName] = decodeURIComponent(cookieValue);

    if (name) {
      break;
    }
  }

  return parsed;
};

export const setCookie = (
  c: Context,
  name: string,
  value: string,
  options?: CookieOptions
): void => {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options?.path) {
    cookie = addProperty(cookie, "Path", options.path);
  }

  if (options?.domain) {
    cookie = addProperty(cookie, "Domain", options.domain);
  }

  if (options?.maxAge) {
    cookie = addProperty(cookie, "Max-Age", options.maxAge);
  }

  if (options?.expires) {
    cookie = addProperty(cookie, "Expires", options.expires.toUTCString());
  }

  if (options?.secure) {
    cookie = addProperty(cookie, "Secure");
  }

  if (options?.httpOnly) {
    cookie = addProperty(cookie, "HttpOnly");
  }

  if (options?.sameSite) {
    cookie = addProperty(cookie, "SameSite", options.sameSite);
  }

  c.header("Set-Cookie", cookie, { append: true });
};

export const deleteCookie = (
  c: Context,
  name: string,
  options?: CookieOptions
) => {
  setCookie(c, name, "", { ...options, path: "/", maxAge: 0 });
};

const addProperty = (cookie: string, property: string, value?: any): string => {
  if (!value) {
    return cookie + `; ${property}`;
  }

  return cookie + `; ${property}=${value}`;
};
