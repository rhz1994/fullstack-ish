const express = require("express"),
  path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require("dotenv"),
  { Client } = require("pg");

dotenv.config();

app.use(express.static(path.join(path.resolve(), "dist")));

app.listen(port, () => {
  console.log(`Backend är igång på port: ${port}`);
  console.log("Path", path.resolve());
});

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

app.get("/api", async (_request, response) => {
  const { rows } = await client.query("SELECT * FROM cities WHERE name = $1", [
    "Stockholm",
  ]);

  response.send(rows);
});
