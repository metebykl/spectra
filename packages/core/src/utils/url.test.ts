import { describe, test, expect } from "vitest";
import { getNonStrictPath, getPath, getQueryParam, mergePath } from "./url";

describe("Url Utils", () => {
  describe("getPath()", () => {
    test("getPath() - no trailing slash", () => {
      let path = getPath(new Request("http://localhost/"));
      expect(path).toBe("/");

      path = getPath(new Request("http://localhost/foo"));
      expect(path).toBe("/foo");

      path = getPath(new Request("http://localhost/foo/bar"));
      expect(path).toBe("/foo/bar");

      path = getPath(new Request("http://localhost/foo?q=bar"));
      expect(path).toBe("/foo");

      path = getPath(new Request("http://localhost/foo?q=hello&q=world"));
      expect(path).toBe("/foo");
    });

    test("getPath() - with trailing slash", () => {
      let path = getPath(new Request("http://localhost/"));
      expect(path).toBe("/");

      path = getPath(new Request("http://localhost/foo/"));
      expect(path).toBe("/foo/");

      path = getPath(new Request("http://localhost/foo/bar/"));
      expect(path).toBe("/foo/bar/");
    });
  });
});

test("getNonStrictPath()", () => {
  let path = getNonStrictPath(new Request("http://localhost/"));
  expect(path).toBe("/");

  path = getNonStrictPath(new Request("http://localhost/foo/"));
  expect(path).toBe("/foo");

  path = getNonStrictPath(new Request("http://localhost/foo/bar/"));
  expect(path).toBe("/foo/bar");
});

test("mergePath()", () => {
  expect(mergePath("/foo", "/")).toBe("/foo");
  expect(mergePath("/foo/", "/")).toBe("/foo/");
  expect(mergePath("foo", "/")).toBe("/foo");
  expect(mergePath("foo/", "/")).toBe("/foo/");
  expect(mergePath("foo", "bar")).toBe("/foo/bar");
  expect(mergePath("/foo", "/bar")).toBe("/foo/bar");
  expect(mergePath("/foo/", "/bar")).toBe("/foo/bar");
  expect(mergePath("/foo/", "/bar/")).toBe("/foo/bar/");
  expect(mergePath("/foo/", "/bar")).toBe("/foo/bar");
  expect(mergePath("/foo", "/bar", "/faz")).toBe("/foo/bar/faz");
});

describe("getQueryParam()", () => {
  test("getQueryParam()", () => {
    let url = "http://localhost/?name=spectra";
    expect(getQueryParam(url)).toStrictEqual({ name: "spectra" });

    url = "http://localhost/?message=Hello+World";
    expect(getQueryParam(url)).toStrictEqual({ message: "Hello World" });
  });

  test("getQueryParam() - with key", () => {
    let url = "http://localhost/?name=spectra";
    expect(getQueryParam(url, "name")).toBe("spectra");
    expect(getQueryParam(url, "example")).toBe(undefined);

    url = "http://localhost/?message=Hello+World";
    expect(getQueryParam(url, "message")).toBe("Hello World");

    url = "http://localhost/?q=foo&q=bar";
    expect(getQueryParam(url, "q")).toBe("foo");
  });

  test("getQueryParam() - multiple", () => {
    let url = "http://localhost/?name=spectra";
    expect(getQueryParam(url, undefined, true)).toStrictEqual({
      name: ["spectra"],
    });

    url = "http://localhost/?message=Hello+World";
    expect(getQueryParam(url, undefined, true)).toStrictEqual({
      message: ["Hello World"],
    });

    url = "http://localhost/?q=foo&q=bar";
    expect(getQueryParam(url, undefined, true)).toStrictEqual({
      q: ["foo", "bar"],
    });
  });

  test("getQueryParam() - multiple with key", () => {
    let url = "http://localhost/?name=spectra";
    expect(getQueryParam(url, "name", true)).toStrictEqual(["spectra"]);
    expect(getQueryParam(url, "example", true)).toBe(undefined);

    url = "http://localhost/?message=Hello+World";
    expect(getQueryParam(url, "message", true)).toStrictEqual(["Hello World"]);

    url = "http://localhost/?q=foo&q=bar";
    expect(getQueryParam(url, "q", true)).toStrictEqual(["foo", "bar"]);
  });
});
