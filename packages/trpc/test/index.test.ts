import { describe, test, expect } from "vitest";
import { initTRPC } from "@trpc/server";
import { Spectra } from "@spectrajs/core";
import { trpc } from "../src";

describe("tRPC Adapter", () => {
  const t = initTRPC.create();

  const appRouter = t.router({
    greet: t.procedure.input(String).query(({ input }) => {
      return `Hi ${input}!`;
    }),
  });

  const app = new Spectra();
  app.use("/trpc/*", trpc({ endpoint: "/trpc", router: appRouter }));

  test("Should return response 200", async () => {
    const searchParams = new URLSearchParams({
      batch: "1",
      input: JSON.stringify({ "0": "Spectra" }),
    });
    const req = new Request(
      `http://localhost/trpc/greet?${searchParams.toString()}`
    );
    const res = await app.fetch(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ result: { data: "Hi Spectra!" } }]);
  });
});
