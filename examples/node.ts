import { Spectra } from "../src";
import { serve } from "../src/adapter/node";

const app = new Spectra();

app.get("/", (c) => {
  c.json({ message: "Hello World!" });
});

app.get("/tasks/:taskId", (c) => {
  const taskId = c.req.param("taskId");
  c.json({ taskId });
});

serve(app);
