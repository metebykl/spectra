import { Spectra } from "@spectrajs/core";
import { serve } from "@spectrajs/node";

const tasks = [
  {
    name: "Example Task",
  },
];

const app = new Spectra()
  .use(async (c, next) => {
    c.set("message", "Hello World!");
    await next();
  })
  .get("/", (c) => {
    const message = c.get<string>("message");
    return c.json({ message });
  })
  .get("/user-agent", (c) => {
    const ua = c.req.header("User-Agent");

    return c.text(ua || "Unknown");
  })
  .get("/tasks", (c) => {
    return c.json({ tasks });
  })
  .post("/tasks", async (c) => {
    const { name } = await c.req.json<{ name: string }>();
    tasks.push({ name });

    return c.json({ message: "Task created" }, 201);
  })
  .get("/users/:userId", (c) => {
    const { userId } = c.req.params();

    return c.json({ userId });
  })
  .notFound((c) => {
    return c.text("Custom Message", 404);
  });

serve(app, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`);
});
