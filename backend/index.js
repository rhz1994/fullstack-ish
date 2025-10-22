const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { Client } = require("pg");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(path.resolve(), "dist")));

// Databas
const client = new Client({
  connectionString: process.env.PGURI,
});
client.connect();

app.get("/players", async (_req, res) => {
  try {
    const { rows } = await client.query("SELECT * FROM nhl_players;");
    res.send(rows);
    console.log(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Något gick fel");
  }
});

app.listen(port, () => {
  console.log(`Backend är igång på port: ${port}`);
  console.log("Path", path.resolve());
});
