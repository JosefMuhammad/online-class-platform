const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT;

(async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected to the db :)");
})();

app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
