import { describe, expect, test } from "vitest";
import { getExtension, getMimeType } from "./mime";

describe("Mime", () => {
  test("getMimeType", () => {
    expect(getMimeType("index.txt")).toBe("text/plain; charset=utf-8");
    expect(getMimeType("index.html")).toBe("text/html; charset=utf-8");
    expect(getMimeType("index.json")).toBe("application/json");
    expect(getMimeType("image.png")).toBe("image/png");
    expect(getMimeType("foo.bar.gif")).toBe("image/gif");
    expect(getMimeType("manifest.webmanifest")).toBe(
      "application/manifest+json"
    );
    expect(getMimeType("index")).toBeUndefined();
    expect(getMimeType("index.random")).toBeUndefined();
  });

  test("getExtension", () => {
    expect(getExtension("application/octet-stream")).toBe("bin");
    expect(getExtension("image/png")).toBe("png");
    expect(getExtension("audio/mpeg")).toBe("mp3");
    expect(getExtension("application/json")).toBe("json");
    expect(getExtension("text/html")).toBe("htm");
    expect(getExtension("application/zip")).toBe("zip");
    expect(getExtension("foo/bar")).toBeUndefined();
  });
});
