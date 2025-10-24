import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);
  const [action, setAction] = useState("POST");
  const [playerData, setplayerData] = useState({
    id: "",
    name: "",
    position: "",
    team: "",
    goals: "",
    assists: "",
    points: "",
    games: "",
  });

  // GET
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
        body: JSON.stringify(playerData),
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
      const res = await fetch(`/players/${playerData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playerData),
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

  // DELETE
  const deletePlayer = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/players/${playerData.id}`, { method: "DELETE" });
      setPlayers(
        players.filter((player) => player.id !== parseInt(playerData.id))
      );
      resetForm();
    } catch (err) {
      console.error("Du lyckades inte ta bort en spelare", err);
    }
  };

  const resetForm = () => {
    setplayerData({
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
      <h1>NHL STATS</h1>

      <label>
        Välj åtgärd:
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="POST">Lägg till spelare</option>
          <option value="PUT">Uppdatera spelare</option>
          <option value="DELETE">Ta bort spelare</option>
        </select>
      </label>

      <form onSubmit={handleSubmit} className="player-form">
        {(action === "PUT" || action === "DELETE") && (
          <input
            type="number"
            placeholder="Spelar-ID"
            value={playerData.id}
            onChange={(e) =>
              setplayerData({ ...playerData, id: e.target.value })
            }
            required
          />
        )}

        {(action === "POST" || action === "PUT") && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={playerData.name}
              onChange={(e) =>
                setplayerData({ ...playerData, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Position"
              value={playerData.position}
              onChange={(e) =>
                setplayerData({ ...playerData, position: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Team"
              value={playerData.team}
              onChange={(e) =>
                setplayerData({ ...playerData, team: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Goals"
              min="0"
              value={playerData.goals}
              onChange={(e) =>
                setplayerData({ ...playerData, goals: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Assists"
              min="0"
              value={playerData.assists}
              onChange={(e) =>
                setplayerData({ ...playerData, assists: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Points"
              min="0"
              value={playerData.points}
              onChange={(e) =>
                setplayerData({ ...playerData, points: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Games"
              min="0"
              value={playerData.games}
              onChange={(e) =>
                setplayerData({ ...playerData, games: e.target.value })
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
            <th>Games</th>

            <th>Goals</th>
            <th>Assists</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.name}</td>
              <td>{player.position}</td>
              <td>{player.team}</td>
              <td>{player.games}</td>

              <td>{player.goals}</td>
              <td>{player.assists}</td>
              <td>
                <strong>{player.points}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
