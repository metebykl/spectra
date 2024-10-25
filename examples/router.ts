import { Spectra } from "../src";

const app = new Spectra();

app.get("/users/:userId/tasks/:taskId", (c) => {
  const { userId, taskId } = c.req.params;
});
