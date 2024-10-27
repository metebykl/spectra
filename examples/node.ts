import { Spectra } from "../src";
import { serve } from "../src/adapter/node";

const app = new Spectra();

const tasks = [
  {
    name: "Example Task",
  },
];

app.get("/", (c) => {
  c.json({ message: "Hello World!" });
});

app.get("/user-agent", (c) => {
  const ua = c.req.header("User-Agent");

  c.text(ua || "Unknown");
});

app.get("/tasks", (c) => {
  c.json({ tasks });
});

app.post("/tasks", async (c) => {
  const body = await c.req.json();
  tasks.push({ name: body.name });

  c.json({ message: "Task created" }, 201);
});

app.get("/users/:userId", (c) => {
  const { userId } = c.req.params();

  c.json({ userId });
});

serve(app);
