import { Spectra } from "../src";
import { serve } from "../src/adapter/node";

const app = new Spectra();

app.get("/", (c) => {
  c.json({ message: "Hello World!" });
});

serve(app);
