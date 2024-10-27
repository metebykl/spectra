import { Spectra } from "../src";
import { serve } from "../src/adapter/node";

const tasks = [
  {
    name: "Example Task",
  },
];

const app = new Spectra()
  .get("/", (c) => {
    c.json({ message: "Hello World!" });
  })
  .get("/user-agent", (c) => {
    const ua = c.req.header("User-Agent");

    c.text(ua || "Unknown");
  })
  .get("/tasks", (c) => {
    c.json({ tasks });
  })
  .post("/tasks", async (c) => {
    const body = await c.req.json();
    tasks.push({ name: body.name });

    c.json({ message: "Task created" }, 201);
  })
  .get("/users/:userId", (c) => {
    const { userId } = c.req.params();

    c.json({ userId });
  });

serve(app);
