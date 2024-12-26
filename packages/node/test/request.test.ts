import { describe, expect, test } from "vitest";
import type { IncomingMessage } from "node:http";
import { convertIncomingMessageToRequest } from "../src/request";

describe("convertIncomingMessageToRequest", () => {
  test("Should convert to standard Request", () => {
    const url = new URL(`http://localhost/`);
    const req = convertIncomingMessageToRequest(url, {
      method: "GET",
      url: url.pathname,
      headers: {
        host: "localhost",
      },
    } as IncomingMessage);

    expect(req).toBeInstanceOf(Request);
    expect(req.method).toBe("GET");
    expect(req.url).toBe("http://localhost/");
    expect(req.headers.get("host")).toBe("localhost");
  });
});
