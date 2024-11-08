import { Spectra } from "../src";
import { serve } from "../src/adapter/node";

const tasks = [
  {
    name: "Example Task",
  },
];

const app = new Spectra()
  .use(async (c, next) => {
    console.log(new Date().toISOString(), c.method, c.path);
    await next();
  })
  .get("/", (c) => {
    return c.json({ message: "Hello World!" });
  })
  .get("/user-agent", (c) => {
    const ua = c.req.header("User-Agent");

    return c.text(ua || "Unknown");
  })
  .get("/tasks", (c) => {
    return c.json({ tasks });
  })
  .post("/tasks", async (c) => {
    const body = await c.req.json();
    tasks.push({ name: body.name });

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
