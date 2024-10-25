// This example is for development only and will be removed after routers and adapters are implemented.

import { Spectra } from "../src";

const app = new Spectra();

app.get("/:id", (c) => {
  const { id } = c.req.params;
  console.log("ID:", id);
});

const handler = app.getHandler("GET", "/:id");
if (handler) {
  handler({ req: { params: { id: "1" } } });
} else {
  console.error("handler not found");
}
