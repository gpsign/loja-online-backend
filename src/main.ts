import { loadZod, AppEnv } from "@config";
import app from "./app.js";

loadZod();

const port = AppEnv.PORT || 4000;

app.listen(port, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Server is listening on port ${port}.`);
});
