const express = require("express"),
  path = require("path");

const app = express();

const port = process.env.PORT || 3000;

app.get("/api", (_request, response) => {
  response.send({ hello: "World" });
});

app.use(express.static(path.join(path.resolve(), "dist")));

app.listen(port, () => {
  console.log(`Backend är igång på port: ${port}`);
  console.log("Path", path.resolve());
});
