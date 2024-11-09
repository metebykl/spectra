import { describe, test } from "vitest";
import { Spectra } from "./spectra";
import type { Equal, Expect } from "./utils/types";

describe("Path parameter types", () => {
  const app = new Spectra();

  test("Should handle single path parameters", () => {
    app.get("/user/:id", (c) => {
      const params = c.req.params();
      type Expected = {
        id: string;
      };

      type Verify = Expect<Equal<typeof params, Expected>>;

      return c.text("OK");
    });
  });

  test("Should handle multiple path parameters", () => {
    app.get("/user/:userId/post/:postId", (c) => {
      const params = c.req.params();
      type Expected = {
        userId: string;
        postId: string;
      };

      type Verify = Expect<Equal<typeof params, Expected>>;

      return c.text("OK");
    });
  });
});
