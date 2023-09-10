import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BoardGameForm = () => {
    // State initialization for board games and new game fields
    const [boardGames, setBoardGames] = useState([]);
    const [newGameName, setNewGameName] = useState("");
    const [newMaxPlayers, setNewMaxPlayers] = useState("");

    // Fetch the existing board games on initial component load
    useEffect(() => {
        fetch("/api/games")
            .then(res => res.json())
            .then(data => {
                setBoardGames(data);
            })
            .catch(error => {
                console.error("Error fetching board games", error);
            });
    }, []);

    // Handler for adding a new game
    const handleAddGame = () => {
        if (newGameName && newMaxPlayers) {
            const newGame = {
                name: newGameName,
                maxPlayers: parseInt(newMaxPlayers, 10),
            };

            // Post the new game to the API
            fetch("/api/games", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newGame),
            })
            .then(res => res.json())
            .then(data => {
                setBoardGames([...boardGames, data]);
                setNewGameName("");
                setNewMaxPlayers("");
            })
            .catch(error => {
                console.error("Error adding new board game", error);
            });
        }
    }


    // Component render
    return (
        <div className="board-game-page">
            <h2>Board Games</h2>
            <ul>
                {boardGames.map(game => (
                    <li key={game._id}>
                        <p><strong>Name: {game.name}</strong></p>
                        <p>Max players: {game.maxPlayers}</p>
                    </li>
                ))}
            </ul>
            <br></br>
            <h3>Add new game:</h3>
            <input
                type="text"
                placeholder="Name"
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Max players"
                value={newMaxPlayers}
                onChange={(e) => setNewMaxPlayers(e.target.value)}
            />
            <button
                type="button"
                onClick={handleAddGame}>
                    Add game
            </button>
            <div>
            <br></br>
                <Link to="/">
                    <button>Back</button>
                </Link>
            </div>
        </div>
    );
};

export default BoardGameForm;