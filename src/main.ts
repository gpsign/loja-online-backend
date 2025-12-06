import { loadZod } from "config/zod.config.js";
import app from "./app.js";
import { AppEnv } from "config/env.config.js";

loadZod();

const port = AppEnv.PORT || 4000;

app.listen(port, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Server is listening on port ${port}.`);
});
