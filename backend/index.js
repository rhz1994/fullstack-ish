const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { Client } = require("pg");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(path.resolve(), "dist")));

// Databas
const client = new Client({
  connectionString: process.env.PGURI,
});
client.connect();

// GET
app.get("/players", async (_req, res) => {
  try {
    const { rows } = await client.query(
      "SELECT * FROM nhl_players ORDER BY points DESC;"
    );
    res.send(rows);
    console.log(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Något gick fel");
  }
});

// POST

app.post("/players", async (req, res) => {
  try {
    const { name, position, team, goals, assists, points, games } = req.body;
    const result = await client.query(
      `INSERT INTO nhl_players
       (name, position, team, goals, assists, points, games)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [name, position, team, goals, assists, points, games]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte lägga till spelare" });
  }
});

// PUT

app.put("/players/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, team, goals, assists, points, games } = req.body;

    const result = await client.query(
      `UPDATE nhl_players
       SET name = $1,
           position = $2,
           team = $3,
           goals = $4,
           assists = $5,
           points = $6,
           games = $7
       WHERE id = $8
       RETURNING *`,
      [name, position, team, goals, assists, points, games, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Spelare ej hittad" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte uppdatera spelare" });
  }
});

// DELETE

app.delete("/players/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query(
      `DELETE FROM nhl_players
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Spelare ej hittad" });
    }

    res.json({ message: "Spelare borttagen", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte uppdatera spelare" });
  }
});

app.listen(port, () => {
  console.log(`Backend är igång på port: ${port}`);
  console.log("Path", path.resolve());
  console.log("DATABASE_PGURI:", process.env.PGURI);
});
