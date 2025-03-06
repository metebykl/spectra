import { describe, test, expect, vi } from "vitest";
import { createServer, type IncomingMessage } from "node:http";
import { Readable } from "node:stream";
import request from "supertest";
import { getListener } from "../src/listener";

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

describe("getListener", () => {
  test("Should return 400 for an invalid request", async () => {
    const fetchCallback = vi.fn();
    const listener = getListener(fetchCallback);

    const server = createServer(async (req, res) => {
      const incoming = new Readable() as IncomingMessage;
      incoming.url = req.url;
      await listener(incoming, res);
    });

    const res = await request(server).get("/");
    expect(res.status).toBe(400);
  });

  test("Should return 500 if handler does not return a response", async () => {
    const fetchCallback = vi.fn();
    const listener = getListener(fetchCallback);

    const server = createServer(async (req, res) => {
      await listener(req, res);
    });

    const res = await request(server).get("/");
    expect(res.status).toBe(500);
  });

  test("Should return 500 if handler fails", async () => {
    const fetchCallback = () => {
      throw new Error("failed");
      return new Response("ok");
    };
    const listener = getListener(fetchCallback);

    const server = createServer(async (req, res) => {
      await listener(req, res);
    });

    const res = await request(server).get("/");
    expect(res.status).toBe(500);
  });

  test("Should return 500 when reading the response body fails", async () => {
    const fetchCallback = () => {
      const stream = new ReadableStream({
        start(controller) {
          controller.error(new Error("failed"));
          controller.close();
        },
      });
      return new Response(stream);
    };
    const listener = getListener(fetchCallback);

    const server = createServer(async (req, res) => {
      await listener(req, res);
    });

    const res = await request(server).get("/");
    expect(res.status).toBe(500);
  });

  test("Should return 504 on timeout errors", async () => {
    const fetchCallback = () => {
      throw new TimeoutError("failed");
      return new Response("ok");
    };
    const listener = getListener(fetchCallback);

    const server = createServer(async (req, res) => {
      await listener(req, res);
    });

    const res = await request(server).get("/");
    expect(res.status).toBe(504);
  });
});
