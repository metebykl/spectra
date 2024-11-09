import { describe, test, expect } from "vitest";
import { SpectraRequest } from "./request";

describe("Query parameters", () => {
  test("req.query()", () => {
    const request = new Request("http://localhost?foo=bar&page=1");
    const req = new SpectraRequest(request, {});

    const query = req.query();
    const expected = {
      foo: "bar",
      page: "1",
    };
    expect(query).toEqual(expected);
  });

  test("req.query(param)", () => {
    const request = new Request("http://localhost?foo=bar");
    const req = new SpectraRequest(request, {});

    const foo = req.query("foo");
    expect(foo).toBe("bar");
  });

  test("req.queries()", () => {
    const request = new Request(
      "http://localhost?foo=bar&foo=baz&page=1&page=2"
    );
    const req = new SpectraRequest(request, {});

    const queries = req.queries();
    const expected = {
      foo: ["bar", "baz"],
      page: ["1", "2"],
    };
    expect(queries).toEqual(expected);
  });

  test("req.queries(param)", () => {
    const request = new Request("http://localhost?page=1&page=2");
    const req = new SpectraRequest(request, {});

    const queries = req.queries("page");
    expect(queries).toEqual(["1", "2"]);
  });
});
