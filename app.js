const express = require("express");
const records = require("./js/records");

const app = express();

app.use(express.json());

//logger
// app.use((req, res, next) => {
//   console.log(req.body);
//   next();
// });

const routes = require("./routes");
app.use("/api", routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

let port = process.env.PORT ?? 3000;

app.listen(port, () => console.log(`Quote API listening on port ${port}!`));