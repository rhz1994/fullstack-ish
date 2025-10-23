import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);
  const [action, setAction] = useState("POST");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    position: "",
    team: "",
    goals: "",
    assists: "",
    points: "",
    games: "",
  });

  // Hämta alla spelare
  useEffect(() => {
    fetch("/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error(err));
  }, []);

  // POST
  const addPlayer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await res.json();

      const updatedRes = await fetch("/players");
      const updatedPlayers = await updatedRes.json();
      setPlayers(updatedPlayers);

      resetForm();
    } catch (err) {
      console.error("Du lyckades inte lägga till en spelare", err);
    }
  };

  // PUT
  const updatePlayer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/players/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await res.json();

      const updatedRes = await fetch("/players");
      const updatedPlayers = await updatedRes.json();
      setPlayers(updatedPlayers);
      resetForm();
    } catch (err) {
      console.error("Du lyckades inte uppdatera till en spelare", err);
    }
  };

  // DELETE - Ta bort spelare
  const deletePlayer = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/players/${formData.id}`, { method: "DELETE" });
      setPlayers(
        players.filter((player) => player.id !== parseInt(formData.id))
      );
      resetForm();
    } catch (err) {
      console.error("Du lyckades inte ta bort till en spelare", err);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      position: "",
      team: "",
      goals: "",
      assists: "",
      points: "",
      games: "",
    });
  };

  const handleSubmit = (e) => {
    if (action === "POST") addPlayer(e);
    else if (action === "PUT") updatePlayer(e);
    else if (action === "DELETE") deletePlayer(e);
  };

  return (
    <div>
      <h1>NHL Poängliga</h1>

      <label>
        Välj åtgärd:
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="POST">Lägg till spelare</option>
          <option value="PUT">Uppdatera spelare</option>
          <option value="DELETE">Ta bort spelare</option>
        </select>
      </label>

      {/* Formulär */}
      <form onSubmit={handleSubmit} className="player-form">
        {(action === "PUT" || action === "DELETE") && (
          <input
            type="number"
            placeholder="Spelar-ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            required
          />
        )}

        {(action === "POST" || action === "PUT") && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Team"
              value={formData.team}
              onChange={(e) =>
                setFormData({ ...formData, team: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Goals"
              min="0"
              value={formData.goals}
              onChange={(e) =>
                setFormData({ ...formData, goals: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Assists"
              min="0"
              value={formData.assists}
              onChange={(e) =>
                setFormData({ ...formData, assists: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Points"
              min="0"
              value={formData.points}
              onChange={(e) =>
                setFormData({ ...formData, points: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Games"
              min="0"
              value={formData.games}
              onChange={(e) =>
                setFormData({ ...formData, games: e.target.value })
              }
              required
            />
          </>
        )}

        <button type="submit">
          {action === "POST"
            ? "Lägg till"
            : action === "PUT"
            ? "Uppdatera"
            : "Ta bort"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Spelar-ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Team</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Points</th>
            <th>Games</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.name}</td>
              <td>{player.position}</td>
              <td>{player.team}</td>
              <td>{player.goals}</td>
              <td>{player.assists}</td>
              <td>{player.points}</td>
              <td>{player.games}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
