import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("/players")
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data); // spara datan i state
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Fullstack-ish NHL Players</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Team</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Points</th>
            <th>Games</th>
            <th>PPG</th>
            <th>+/-</th>
            <th>PIM</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.position}</td>
              <td>{player.team}</td>
              <td>{player.goals}</td>
              <td>{player.assists}</td>
              <td>{player.points}</td>
              <td>{player.games}</td>
              <td>{player.points_per_game}</td>
              <td>{player.plus_minus}</td>
              <td>{player.pim}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
