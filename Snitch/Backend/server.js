import app from "./src/app.js";
import connectToDB from "./src/config/db.js";
import { config } from "./src/config/config.js";

connectToDB();

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
