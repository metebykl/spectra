import { describe, test, expect } from "vitest";
import { buildOutgoingHttpHeaders } from "../src/utils";

describe("buildOutgoingHttpHeaders", () => {
  test("Preserve content-type", () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const result = buildOutgoingHttpHeaders(headers);
    expect(result).toEqual({
      "content-type": "application/json",
    });
  });

  test("Multiple set-cookie", () => {
    const headers = new Headers();
    headers.append("set-cookie", "foo");
    headers.append("set-cookie", "bar");

    const result = buildOutgoingHttpHeaders(headers);
    expect(result).toEqual({
      "set-cookie": ["foo", "bar"],
      "content-type": "text/plain; charset=UTF-8",
    });
  });

  test("Headers", () => {
    const headers = new Headers();
    headers.set("X-Message", "Spectra");

    const result = buildOutgoingHttpHeaders(headers);
    console.log(result);
    expect(result).toEqual({
      "x-message": "Spectra",
      "content-type": "text/plain; charset=UTF-8",
    });
  });

  test("Record<string, string>", () => {
    const headers = { "X-Message": "Spectra" };
    const result = buildOutgoingHttpHeaders(headers);
    expect(result).toEqual({
      "x-message": "Spectra",
      "content-type": "text/plain; charset=UTF-8",
    });
  });

  test("HeadersInit", () => {
    const headers: HeadersInit = [["X-Message", "Spectra"]];
    const result = buildOutgoingHttpHeaders(headers);
    expect(result).toEqual({
      "x-message": "Spectra",
      "content-type": "text/plain; charset=UTF-8",
    });
  });

  test("null", () => {
    const result = buildOutgoingHttpHeaders(null);
    expect(result).toEqual({
      "content-type": "text/plain; charset=UTF-8",
    });
  });

  test("undefined", () => {
    const result = buildOutgoingHttpHeaders(undefined);
    expect(result).toEqual({
      "content-type": "text/plain; charset=UTF-8",
    });
  });
});
