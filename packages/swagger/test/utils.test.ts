import { test, expect } from "vitest";
import { toOpenAPIPath } from "../src/utils";

test("toOpenAPIPath", () => {
  const path = "/api/users/:userId";
  const openAPIPath = toOpenAPIPath(path);
  expect(openAPIPath).toBe("/api/users/{userId}");
});
